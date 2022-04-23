"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeAuth = void 0;
const BrowserEnvironment_1 = require("../BrowserEnvironment");
const assert_1 = require("../lib/assert");
const request_1 = require("../lib/request");
const buildTokenRequest_1 = require("./buildTokenRequest");
const getAccessTokenExpiration_1 = require("./getAccessTokenExpiration");
const Client_1 = require("../Client");
/**
 * The completeAuth function should only be called on the page that represents
 * the redirectUri. We typically land there after a redirect from the
 * authorization server..
 */
async function completeAuth() {
    const url = BrowserEnvironment_1.env.getUrl();
    const storage = BrowserEnvironment_1.env.getStorage();
    const params = url.searchParams;
    let key = params.get('state');
    const code = params.get('code');
    const authError = params.get('error');
    const authErrorDescription = params.get('error_description');
    if (!key) {
        key = await storage.get(Client_1.SMART_KEY);
    }
    (0, assert_1.assert)(key, "No 'state' parameter found. Please (re)launch the app.");
    // Check if we have a previous state
    let state = (await storage.get(key));
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
        (0, assert_1.assert)(code, "'code' url parameter is required");
        //debug("Preparing to exchange the code for access token...");
        const requestOptions = (0, buildTokenRequest_1.buildTokenRequest)(code, state);
        //debug("Token request options: %O", requestOptions);
        // The EHR authorization server SHALL return a JSON structure that
        // includes an access token or a message indicating that the
        // authorization request has been denied.
        const tokenResponse = await (0, request_1.request)(state.tokenUri, requestOptions);
        console.log('tokenResponse', tokenResponse);
        //debug("Token response: %O", tokenResponse);
        (0, assert_1.assert)(tokenResponse.access_token, 'Failed to obtain access token.');
        // Now we need to determine when is this authorization going to expire
        state.expiresAt = (0, getAccessTokenExpiration_1.getAccessTokenExpiration)(tokenResponse);
        // save the tokenResponse so that we don't have to re-authorize on
        // every page reload
        state = { ...state, tokenResponse };
        await storage.set(key, state);
        //debug("Authorization successful!");
        console.log('success', state);
    }
    const client = new Client_1.Client(state);
    //debug("Created client instance: %O", client);
    return client;
}
exports.completeAuth = completeAuth;
