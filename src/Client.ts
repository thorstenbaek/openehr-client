import {env} from "./Environment";
import {Buffer} from "buffer/";
import { randomString, getAndCache, request, assert, jwtDecode, getPath } from "./lib";
import DocumentRequest from "./DocumentRequest";

export const SMART_KEY = "SMART_KEY";

export async function authorize(params: AuthorizeParams) : Promise<Client> {
    const url = env.getUrl(); new URL(location + "");
    
     // Obtain input
     const {
        clientSecret,
        fakeTokenResponse,
        patientId,
        encounterId,
        target,
        width,
        height
    } = params;
    
    let {
        iss,
        launch,
        fhirServiceUrl,
        redirectUri,
        scope = "",
        clientId,
        completeInTarget        
    } = params;
    
    const storage = env.getStorage();

    // For these three an url param takes precedence over inline option
    iss            = url.searchParams.get("iss")            || iss;
    fhirServiceUrl = url.searchParams.get("fhirServiceUrl") || fhirServiceUrl;
    launch         = url.searchParams.get("launch")         || launch;

    if (!redirectUri) {
        redirectUri = env.relative(".");
    } else if (!redirectUri.match(/^https?\:\/\//)) {
        redirectUri = env.relative(redirectUri);
    }

    if (iss) {
        console.log(`Making EHR launch...`);
    }

    // append launch scope if needed
    if (launch && !scope.match(/launch/)) {
        scope += " launch";
    }

    // If `authorize` is called, make sure we clear any previous state (in case
    // this is a re-authorize)
    const oldKey = await storage.get(SMART_KEY);
    await storage.unset(oldKey);

    const serverUrl = iss;

    const stateKey = randomString(16);

    const state: ClientState = {
        clientId,
        scope,
        redirectUri,
        serverUrl,
        clientSecret,
        tokenResponse: {},
        key: stateKey,
        completeInTarget
    };

    const extensions = await getSecurityExtensions(serverUrl);
    Object.assign(state, extensions);
    await storage.set(stateKey, state);

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

    console.log(redirectUrl);    
    
    if (iss) {
        await storage.set(stateKey, state);
        
        return await env.redirect(redirectUrl);
    }        
}

/**
 * Fetches the well-known json file from the given base URL.
 * Note that the result is cached in memory (until the page is reloaded in the
 * browser) because it might have to be re-used by the client
 * @param baseUrl The base URL of the FHIR server
 */
 export function fetchWellKnownJson(baseUrl = "/", requestOptions?: RequestInit): Promise<WellKnownSmartConfiguration>
 {
     const url = String(baseUrl).replace(/\/*$/, "/") + ".well-known/smart-configuration";
     
     console.log("Oauth url", url);

     return getAndCache(url, requestOptions).catch((ex: Error) => {
         throw new Error(`Failed to fetch the well-known json "${url}". ${ex.message}`);
     });
 }

/**
 * Fetch a "WellKnownJson" and extract the SMART endpoints from it
 */
 function getSecurityExtensionsFromWellKnownJson(baseUrl = "/", requestOptions?: RequestInit): Promise<OAuthSecurityExtensions>
 {
     return fetchWellKnownJson(baseUrl, requestOptions).then(meta => {
         console.log("meta", meta);
         if (!meta.authorization_endpoint || !meta.token_endpoint) {
             throw new Error("Invalid wellKnownJson");
         }
         return {
             registrationUri: meta.registration_endpoint  || "",
             authorizeUri   : meta.authorization_endpoint,
             tokenUri       : meta.token_endpoint
         };
     });
 }

/**
 * Given a FHIR server, returns an object with it's Oauth security endpoints
 * that we are interested in. This will try to find the info in both the
 * `CapabilityStatement` and the `.well-known/smart-configuration`. Whatever
 * Arrives first will be used and the other request will be aborted.
 * @param [baseUrl] Fhir server base URL
 * @param [env] The Adapter
 */
export function getSecurityExtensions(baseUrl = "/"): Promise<any>
{
    return getSecurityExtensionsFromWellKnownJson(baseUrl);     
}

/**
 * @param env
 * @param [onSuccess]
 * @param [onError]
 */
export async function ready(onSuccess?: (client: Client) => any, onError?: (error: Error) => any): Promise<Client>
{
    let task = completeAuth();
    if (onSuccess) {
        task = task.then(onSuccess);
    }
    if (onError) {
        task = task.catch(onError);
    }
    return task;
}

/**
 * Builds the token request options. Does not make the request, just
 * creates it's configuration and returns it in a Promise.
 */
 export function buildTokenRequest(code: string, state: ClientState): RequestInit
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
export function getAccessTokenExpiration(tokenResponse: TokenResponse): number
{
    const now = Math.floor(Date.now() / 1000);

    // Option 1 - using the expires_in property of the token response
    if (tokenResponse.expires_in) {
        return now + tokenResponse.expires_in;
    }

    // Option 2 - using the exp property of JWT tokens (must not assume JWT!)
    if (tokenResponse.access_token) {
        let tokenBody = jwtDecode(tokenResponse.access_token, env);
        if (tokenBody && tokenBody.exp) {
            return tokenBody.exp;
        }
    }

    // Option 3 - if none of the above worked set this to 5 minutes after now
    return now + 300;
}

/**
 * The completeAuth function should only be called on the page that represents
 * the redirectUri. We typically land there after a redirect from the
 * authorization server..
 */
export async function completeAuth(): Promise<Client> {
    const url = env.getUrl();
    const storage = env.getStorage();
    const params = url.searchParams;

    let key                    = params.get("state");
    const code                 = params.get("code");
    const authError            = params.get("error");
    const authErrorDescription = params.get("error_description");

    if (!key) {
        key = await storage.get(SMART_KEY);
    }

    assert(key, "No 'state' parameter found. Please (re)launch the app.");

    // Check if we have a previous state
    let state = (await storage.get(key)) as ClientState;

     // Assume the client has already completed a token exchange when
    // there is no code (but we have a state) or access token is found in state
    const authorized = !code || state.tokenResponse?.access_token;

    // params.delete("code");
    // params.delete("state");
    // params.delete("scope");
    // params.delete("session_state");
    
    // if (window.history.replaceState) {
    //     window.history.replaceState({}, "", url.href);
    // }
    // Store alle states in storage and delete them from querystring later

    // If we are authorized already, then this is just a reload.
    // Otherwise, we have to complete the code flow
    if (!authorized && state.tokenUri) {

        assert(code, "'code' url parameter is required");

        //debug("Preparing to exchange the code for access token...");
        const requestOptions = buildTokenRequest(code, state);
        //debug("Token request options: %O", requestOptions);

        // The EHR authorization server SHALL return a JSON structure that
        // includes an access token or a message indicating that the
        // authorization request has been denied.
        const tokenResponse = await request(state.tokenUri, requestOptions);
        console.log("tokenResponse", tokenResponse);
        //debug("Token response: %O", tokenResponse);
        assert(tokenResponse.access_token, "Failed to obtain access token.");

        // Now we need to determine when is this authorization going to expire
        state.expiresAt = getAccessTokenExpiration(tokenResponse);

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


export class Client {
    /**
     * The SMART on OpenEHR Client
     */
    state: ClientState;
    patient: string;    
    encounter: string;
    resource: string;

    constructor(state: ClientState) {

        var patientId = state.tokenResponse.patient;
        if (patientId.startsWith("cdp")) {
            patientId = patientId.substring(3);
        }

        console.log(state);
        this.state = state;
        this.patient = patientId;
        this.encounter = state.tokenResponse.encounter;
        this.resource = state.tokenResponse.resource;
    }

    getState(path = "") {
        return getPath({ ...this.state }, path);
    }

    post(relativeUrl: string, body: string): Promise<any> {
        return fetch(`${this.state.serverUrl}/${relativeUrl}`, {
            method: "POST",
            mode: "cors", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.state.tokenResponse.access_token,
            },
            body: body
        })        
    }

    async query(aql: string, queryParameters: {[name:string]:object} = {}): Promise<any> {        
        let queryContext: {[name:string]:[string]} = {};
        queryContext.PatientId = [this.patient];
        
        var param = {
            q: aql,
            query_parameters: queryParameters,
            queryContext: queryContext

        };

        var response = await this.post("query", JSON.stringify(param));       
        return await response.json();
    }

    async compose(composition: string): Promise<any> {
        var buffer = Buffer.from(composition);
        var base64string = buffer.toString("base64");


        var documentRequest: DocumentRequest = {
            content: base64string,
            contentType: "application/json",
            templateId: 1002701,
            documentTypeId: 1001414,
            patientId: parseInt(this.patient),
            authorId: 1004733, //Rekvirent: Thor Stenbæk  dips-hcpid": "1004733"
            eventTime: new Date().toISOString(),
            documentFormat: 16            
        }

        const response = await this.post("document", JSON.stringify(documentRequest));
        return response.ok;
    }
}