"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessTokenExpiration = void 0;
const BrowserEnvironment_1 = require("../BrowserEnvironment");
const jwtDecode_1 = require("../lib/jwtDecode");
/**
 * Given a token response, computes and returns the expiresAt timestamp.
 * Note that this should only be used immediately after an access token is
 * received, otherwise the computed timestamp will be incorrect.
 * @param tokenResponse
 */
function getAccessTokenExpiration(tokenResponse) {
    const now = Math.floor(Date.now() / 1000);
    // Option 1 - using the expires_in property of the token response
    if (tokenResponse.expires_in) {
        return now + tokenResponse.expires_in;
    }
    // Option 2 - using the exp property of JWT tokens (must not assume JWT!)
    if (tokenResponse.access_token) {
        const tokenBody = (0, jwtDecode_1.jwtDecode)(tokenResponse.access_token, BrowserEnvironment_1.env);
        if (tokenBody && tokenBody.exp) {
            return tokenBody.exp;
        }
    }
    // Option 3 - if none of the above worked set this to 5 minutes after now
    return now + 300;
}
exports.getAccessTokenExpiration = getAccessTokenExpiration;
//# sourceMappingURL=getAccessTokenExpiration.js.map