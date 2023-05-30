import Environment from "./Environment";
import Client from "./Client";
import { Utils } from "./Utils";
import AuthorizeParams from "./AuthorizeParams";
import ClientState from "./ClientState";

const DEBUG:boolean = true;
//export const SMART_KEY = "SMART_KEY";

function debug(value: any) {
    if (DEBUG) {
        var paramName = arguments[0];

        console.log(`DEBUG:${paramName}=${value}`)
    }
}

function assert(condition: any, message: string): asserts condition {
    if (!(condition)) {
        throw new Error(message)
    }
}

export async function authorize(params: AuthorizeParams, env: Environment, utils: Utils) : Promise<any> {

    if (Object.keys(params).length == 0) {
        throw Error("authorization parameter can not be empty");
    }

    if (!params.clientId) {
        throw Error("client-id is missing in authorization parameter");
    }

    if (!params.scope) {
        throw Error("scope is missing in authorization parameter");
    }

    const url = env.getUrl();
    
    let {
        clientId,
        iss,        
        redirectUri,        
        scope,
        launch} = params;

    // For these two an url param takes precedence over inline option
    iss            = url.searchParams.get("iss")            || iss;
    launch         = url.searchParams.get("launch")         || launch;

    if (!redirectUri) {
        redirectUri = env.relative(".");
    } else if (!redirectUri.match(/^https?\:\/\//)) {
        redirectUri = env.relative(redirectUri);
    }

    if (!iss) {
        throw Error("Missing iss parameter");
    }
    
    console.log(`Making EHR launch...`);
    const storage = env.getStorage();

    // append launch scope if needed
    if (launch && !scope.match(/launch/)) {
        scope += " launch";
    }

    // If `authorize` is called, make sure we clear any previous state (in case
    // this is a re-authorize)
    /*const oldKey = await storage.get(SMART_KEY);
    await storage.unset(oldKey);*/

    const serverUrl: string = iss;
    const stateKey: string = utils.randomString();

    const state: ClientState = {
        clientId,
        scope,
        redirectUri,
        serverUrl,
        tokenResponse: {},
        key: stateKey
    };

    var wellKnownJson = await fetchWellKnownJson(serverUrl, utils);

    console.log(wellKnownJson);

    state.authorizeUri = wellKnownJson.authorization_endpoint;
    state.tokenUri = wellKnownJson.token_endpoint;

    // build the redirect uri
    const redirectParams = [
        "response_type=code",
        "client_id="    + encodeURIComponent(clientId || ""),
        "scope="        + encodeURIComponent(scope),
        "redirect_uri=" + encodeURIComponent(redirectUri),
        "aud="          + encodeURIComponent(serverUrl),
        "state="        + encodeURIComponent(stateKey)
    ];


    // also pass this in case of EHR launch
    if (launch) {
        redirectParams.push("launch=" + encodeURIComponent(launch));
    }

    let redirectUrl = state.authorizeUri + "?" + redirectParams.join("&");
    
    await storage.set(stateKey, state);
    return await env.redirect(redirectUrl);    
}

async function fetchWellKnownJson(baseUrl = "/", utils: Utils): Promise<WellKnownSmartConfiguration> {
    
    const url = String(baseUrl).replace(/\/*$/, "/") + ".well-known/smart-configuration";
     
    console.log("Oauth url", url);

    try {
        var res = await utils.request(url, {});
        console.log(res);
        return res;
    }
    catch(ex) {
        throw new Error(`Failed to fetch the well-known json "${url}". ${ex}`);
    };
}

/**
 * @param env
 * @param [onSuccess]
 * @param [onError]
 */
export async function ready(env: Environment, utils: Utils, onSuccess?: (client: Client) => any, onError?: (error: Error) => any): Promise<Client>
{
    debug("Ready was called");

    let task = completeAuth(env, utils);
    if (onSuccess) {
        task = task.then(onSuccess);
    }
    if (onError) {
        task = task.catch(onError);
    }
    return task;
}

/**
 * The completeAuth function should only be called on the page that represents
 * the redirectUri. We typically land there after a redirect from the
 * authorization server..
 */
export async function completeAuth(env: Environment, utils: Utils): Promise<Client> {
    const url = env.getUrl();
    const storage = env.getStorage();
    const params = url.searchParams;

    let key                    = params.get("state");
    const code                 = params.get("code");
    const authError            = params.get("error");
    const authErrorDescription = params.get("error_description");

    /*if (!key) {
        key = await storage.get(SMART_KEY);
    }*/

    assert(key, "No 'state' parameter found. Please (re)launch the app.");
    debug(key);
    // Check if we have a previous state
    let state = (await storage.get(key)) as ClientState;
    debug(state);

     // Assume the client has already completed a token exchange when
    // there is no code (but we have a state) or access token is found in state
    const authorized = !code || state.tokenResponse?.access_token;

    params.delete("code");
    params.delete("state");
    params.delete("scope");
    params.delete("session_state");
    
    // if (window.history.replaceState) {
    //     window.history.replaceState({}, "", url.href);
    // }
    // Store alle states in storage and delete them from querystring later

    // If we are authorized already, then this is just a reload.
    // Otherwise, we have to complete the code flow
    if (!authorized && state.tokenUri) {

        assert(code, "'code' url parameter is required");

        //debug("Preparing to exchange the code for access token...");
        const requestOptions = buildTokenRequest(env, code, state);
        //debug("Token request options: %O", requestOptions);

        // The EHR authorization server SHALL return a JSON structure that
        // includes an access token or a message indicating that the
        // authorization request has been denied.
        const tokenResponse = await utils.request(state.tokenUri, requestOptions);
        console.log("tokenResponse", tokenResponse);
        //debug("Token response: %O", tokenResponse);
        assert(tokenResponse.access_token, "Failed to obtain access token.");

        // Now we need to determine when is this authorization going to expire
        state.expiresAt = getAccessTokenExpiration(utils, env, tokenResponse);

        // throw new Error("bang!");

        // save the tokenResponse so that we don't have to re-authorize on
        // every page reload
        state = { ...state, tokenResponse };
        await storage.set(key, state);
        //debug("Authorization successful!");
        console.log("success", state);
    }

    const client = new Client(state);
    //debug("Created client instance: %O", client);
    return client;
}

/**
 * Builds the token request options. Does not make the request, just
 * creates it's configuration and returns it in a Promise.
 */
 export function buildTokenRequest(env: Environment, code: string, state: ClientState): RequestInit
 {
     const { redirectUri, clientSecret, tokenUri, clientId } = state;
 
     assert(redirectUri, "Missing state.redirectUri");
     assert(tokenUri, "Missing state.tokenUri");
     assert(clientId, "Missing state.clientId");
 
     const requestOptions: Record<string, any> = {
         method: "POST",
         headers: { "content-type": "application/x-www-form-urlencoded" },
         body: `code=${code}&grant_type=authorization_code&redirect_uri=${
             encodeURIComponent(redirectUri)}`
     };
 
     // For public apps, authentication is not possible (and thus not required),
     // since a client with no secret cannot prove its identity when it issues a
     // call. (The end-to-end system can still be secure because the client comes
     // from a known, https protected endpoint specified and enforced by the
     // redirect uri.) For confidential apps, an Authorization header using HTTP
     // Basic authentication is required, where the username is the app’s
     // client_id and the password is the app’s client_secret (see example).
     if (clientSecret) {
         requestOptions.headers.Authorization = "Basic " + env.btoa(
             clientId + ":" + clientSecret
         );
         //debug("Using state.clientSecret to construct the authorization header: %s", requestOptions.headers.Authorization);
     } else {
         //debug("No clientSecret found in state. Adding the clientId to the POST body");
         requestOptions.body += `&client_id=${encodeURIComponent(clientId)}`;
     }
 
     return requestOptions as RequestInit;
 }

 /**
 * Given a token response, computes and returns the expiresAt timestamp.
 * Note that this should only be used immediately after an access token is
 * received, otherwise the computed timestamp will be incorrect.
 * @param tokenResponse 
 */
export function getAccessTokenExpiration(utils: Utils, env: Environment, tokenResponse: TokenResponse): number
{
    const now = Math.floor(Date.now() / 1000);

    // Option 1 - using the expires_in property of the token response
    if (tokenResponse.expires_in) {
        return now + tokenResponse.expires_in;
    }

    // Option 2 - using the exp property of JWT tokens (must not assume JWT!)
    if (tokenResponse.access_token) {
        let tokenBody = utils.jwtDecode(tokenResponse.access_token, env);
        if (tokenBody && tokenBody.exp) {
            return tokenBody.exp;
        }
    }

    // Option 3 - if none of the above worked set this to 5 minutes after now
    return now + 300;
}
