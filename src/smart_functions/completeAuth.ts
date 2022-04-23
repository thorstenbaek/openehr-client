import {env} from "../BrowserEnvironment";
import {assert} from "../lib/assert";
import {request} from "../lib/request";
import {buildTokenRequest} from "./buildTokenRequest";
import {getAccessTokenExpiration} from "./getAccessTokenExpiration";
import {Client, SMART_KEY} from "../Client";

/**
 * The completeAuth function should only be called on the page that represents
 * the redirectUri. We typically land there after a redirect from the
 * authorization server..
 */



export async function completeAuth(): Promise<Client> {
    const url = env.getUrl();
    const storage = env.getStorage();
    const params = url.searchParams;

    let key = params.get("state");
    const code = params.get("code");
    const authError = params.get("error");
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
        state = {...state, tokenResponse};
        await storage.set(key, state);
        //debug("Authorization successful!");
        console.log("success", state);
    }

    const client = new Client(state);
    //debug("Created client instance: %O", client);
    return client;
}
