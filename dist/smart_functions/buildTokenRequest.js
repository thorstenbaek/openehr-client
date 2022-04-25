"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTokenRequest = void 0;
const BrowserEnvironment_1 = require("../BrowserEnvironment");
const assert_1 = require("../lib/assert");
/**
 * Builds the token request options. Does not make the request, just
 * creates it's configuration and returns it in a Promise.
 */
function buildTokenRequest(code, state) {
    const { redirectUri, clientSecret, tokenUri, clientId } = state;
    (0, assert_1.assert)(redirectUri, 'Missing state.redirectUri');
    (0, assert_1.assert)(tokenUri, 'Missing state.tokenUri');
    (0, assert_1.assert)(clientId, 'Missing state.clientId');
    const requestOptions = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: `code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectUri)}`,
    };
    // For public apps, authentication is not possible (and thus not required),
    // since a client with no secret cannot prove its identity when it issues a
    // call. (The end-to-end system can still be secure because the client comes
    // from a known, https protected endpoint specified and enforced by the
    // redirect uri.) For confidential apps, an Authorization header using HTTP
    // Basic authentication is required, where the username is the app’s
    // client_id and the password is the app’s client_secret (see example).
    if (clientSecret) {
        requestOptions.headers.Authorization = 'Basic ' + BrowserEnvironment_1.env.btoa(clientId + ':' + clientSecret);
        //debug("Using state.clientSecret to construct the authorization header: %s", requestOptions.headers.Authorization);
    }
    else {
        //debug("No clientSecret found in state. Adding the clientId to the POST body");
        requestOptions.body += `&client_id=${encodeURIComponent(clientId)}`;
    }
    return requestOptions;
}
exports.buildTokenRequest = buildTokenRequest;
//# sourceMappingURL=buildTokenRequest.js.map