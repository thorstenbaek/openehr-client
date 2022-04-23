


import {fetchWellKnownJson} from "./fetchWellKnownJson";

/**
 * Given a FHIR server, returns an object with it's Oauth security endpoints
 * that we are interested in. This will try to find the info in both the
 * `CapabilityStatement` and the `.well-known/smart-configuration`. Whatever
 * Arrives first will be used and the other request will be aborted.
 * @param [baseUrl] Fhir server base URL
 * @param [env] The Adapter
 */

export function getSecurityExtensions(baseUrl = "/"): Promise<any> {
    return getSecurityExtensionsFromWellKnownJson(baseUrl);
}

/**
 * Fetch a "WellKnownJson" and extract the SMART endpoints from it
 */
export function getSecurityExtensionsFromWellKnownJson(baseUrl = "/", requestOptions?: RequestInit): Promise<OAuthSecurityExtensions> {
    return fetchWellKnownJson(baseUrl, requestOptions).then(meta => {
        console.log("meta", meta);
        if (!meta.authorization_endpoint || !meta.token_endpoint) {
            throw new Error("Invalid wellKnownJson");
        }
        return {
            registrationUri: meta.registration_endpoint || "",
            authorizeUri: meta.authorization_endpoint,
            tokenUri: meta.token_endpoint
        };
    });
}
