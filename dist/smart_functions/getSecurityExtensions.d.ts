/**
 * Given a FHIR server, returns an object with it's Oauth security endpoints
 * that we are interested in. This will try to find the info in both the
 * `CapabilityStatement` and the `.well-known/smart-configuration`. Whatever
 * Arrives first will be used and the other request will be aborted.
 * @param [baseUrl] Fhir server base URL
 * @param [env] The Adapter
 */
export declare function getSecurityExtensions(baseUrl?: string): Promise<any>;
/**
 * Fetch a "WellKnownJson" and extract the SMART endpoints from it
 */
export declare function getSecurityExtensionsFromWellKnownJson(baseUrl?: string, requestOptions?: RequestInit): Promise<OAuthSecurityExtensions>;
