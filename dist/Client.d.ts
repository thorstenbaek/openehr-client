export declare const SMART_KEY = "SMART_KEY";
export declare function authorize(params: AuthorizeParams): Promise<Client>;
/**
 * Fetches the well-known json file from the given base URL.
 * Note that the result is cached in memory (until the page is reloaded in the
 * browser) because it might have to be re-used by the client
 * @param baseUrl The base URL of the FHIR server
 */
export declare function fetchWellKnownJson(baseUrl?: string, requestOptions?: RequestInit): Promise<WellKnownSmartConfiguration>;
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
 * @param env
 * @param [onSuccess]
 * @param [onError]
 */
export declare function ready(onSuccess?: (client: Client) => any, onError?: (error: Error) => any): Promise<Client>;
/**
 * Builds the token request options. Does not make the request, just
 * creates it's configuration and returns it in a Promise.
 */
export declare function buildTokenRequest(code: string, state: ClientState): RequestInit;
/**
* Given a token response, computes and returns the expiresAt timestamp.
* Note that this should only be used immediately after an access token is
* received, otherwise the computed timestamp will be incorrect.
* @param tokenResponse
*/
export declare function getAccessTokenExpiration(tokenResponse: TokenResponse): number;
/**
 * The completeAuth function should only be called on the page that represents
 * the redirectUri. We typically land there after a redirect from the
 * authorization server..
 */
export declare function completeAuth(): Promise<Client>;
export declare class Client {
    /**
     * The SMART on OpenEHR Client
     */
    state: ClientState;
    patient: string;
    encounter: string;
    resource: string;
    constructor(state: ClientState);
    getState(path?: string): any;
    post(relativeUrl: string, body: string): Promise<any>;
    query(aql: string, queryParameters?: {
        [name: string]: object;
    }): Promise<any>;
    compose(composition: string, documentTypeId: number, templateId: number): Promise<any>;
}
