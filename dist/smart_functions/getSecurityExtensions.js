"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecurityExtensionsFromWellKnownJson = exports.getSecurityExtensions = void 0;
const fetchWellKnownJson_1 = require("./fetchWellKnownJson");
/**
 * Given a FHIR server, returns an object with it's Oauth security endpoints
 * that we are interested in. This will try to find the info in both the
 * `CapabilityStatement` and the `.well-known/smart-configuration`. Whatever
 * Arrives first will be used and the other request will be aborted.
 * @param [baseUrl] Fhir server base URL
 * @param [env] The Adapter
 */
function getSecurityExtensions(baseUrl = '/') {
    return getSecurityExtensionsFromWellKnownJson(baseUrl);
}
exports.getSecurityExtensions = getSecurityExtensions;
/**
 * Fetch a "WellKnownJson" and extract the SMART endpoints from it
 */
function getSecurityExtensionsFromWellKnownJson(baseUrl = '/', requestOptions) {
    return (0, fetchWellKnownJson_1.fetchWellKnownJson)(baseUrl, requestOptions).then((meta) => {
        console.log('meta', meta);
        if (!meta.authorization_endpoint || !meta.token_endpoint) {
            throw new Error('Invalid wellKnownJson');
        }
        return {
            registrationUri: meta.registration_endpoint || '',
            authorizeUri: meta.authorization_endpoint,
            tokenUri: meta.token_endpoint,
        };
    });
}
exports.getSecurityExtensionsFromWellKnownJson = getSecurityExtensionsFromWellKnownJson;
