/**
 * Authorization parameters that can be passed to `authorize` or `init`
 */
export interface AuthorizeParams {
    /**
     * This is the URL of the service you are connecting to.
     * For [EHR Launch](http://hl7.org/fhir/smart-app-launch/#ehr-launch-sequence)
     * you **MUST NOT** provide this option. It will be passed by the EHR as
     * url parameter instead. Using `iss` as an option will "lock" your app to
     * that service provider. In other words, passing an `iss` option is how
     * you can do [Standalone Launch](http://hl7.org/fhir/smart-app-launch/#standalone-launch-sequence).
     */
    iss?: string;
    /**
     * Can be used to verify that the app is being launched against certain
     * servers. This is especially useful when working with multiple EHR
     * configurations. Can be a string (in which case it will be expected to
     * match the provided ISS exactly), a regular expression to test against
     * the current ISS, or a function that will be called with the current
     * ISS and should return true or false to signify if that ISS is acceptable.
     */
    issMatch?: string | RegExp | ((iss: string) => boolean);
    /**
     * Do not pass use this option, unless you want to test it. It should come
     * as url parameter from the SMART authorization server as part of the EHR
     * launch sequence
     */
    launch?: string;
    /**
     * The base URL of the FHIR server to use. This is just like the `iss`
     * option, except that it is designed to bypass the authentication. If
     * `fhirServiceUrl` is passed, the `authorize` function will NOT actually
     * attempt to authorize. It will skip that and redirect you to your
     * `redirect_uri`.
     */
    fhirServiceUrl?: string;
    /**
     * Defaults to the current directory (it's index file)
     * @alias redirect_uri
     */
    redirectUri?: string;
    /**
     * Same as redirectUri
     * @alias redirectUri
     * @deprecated
     */
    redirect_uri?: string;
    /**
     * The client_id that you have obtained while registering your app in the
     * EHR. This is not required if you only intend to communicate with open
     * FHIR servers. Note: For backwards compatibility reasons we also accept
     * `client_id` instead of `clientId`!
     * @alias client_id
     */
    clientId?: string;
    /**
     * The client_id that you have obtained while registering your app in the
     * EHR. This is not required if you only intend to communicate with open
     * FHIR servers. Note: For backwards compatibility reasons we accept
     * `client_id` as an alias of `clientId`!
     * @alias clientId
     * @deprecated
     */
    client_id?: string;
    /**
     * One or more space-separated scopes that you would like to request from
     * the EHR. [Learn more](http://hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html)
     */
    scope?: string;
    /**
     * The ID of the selected patient. If you are launching against an open FHIR
     * server, there is no way to obtain the launch context that would include
     * the selected patient ID. This way you can "inject" that ID and make the
     * client behave as if that is the currently active patient.
     */
    patientId?: string;
    /**
     * The ID of the selected encounter. If you are launching against an open
     * FHIR server, there is no way to obtain the launch context that would
     * (in some EHRs) include the selected encounter ID. This way you can
     * "inject" that ID and make the client behave as if this is the currently
     * active encounter.
     */
    encounterId?: string;
    /**
     * If you have registered a confidential client, you should pass your
     * `clientSecret` here. **Note: ONLY use this on the server**, as the
     * browsers are considered incapable of keeping a secret.
     */
    clientSecret?: string;
    /**
     * Useful for testing. This object can contain any properties that are
     * typically contained in an [access token response](http://hl7.org/fhir/smart-app-launch/#step-3-app-exchanges-authorization-code-for-access-token).
     * These properties will be stored into the client state, as if it has been
     * authorized.
     */
    fakeTokenResponse?: object;
    /**
     * Where to start the auth flow. This option is only applicable in
     * browsers and is ignored on the server. Can be one of:
     * - `_self`    Authorize in the same window (**default**)
     * - `_top`     Authorize in the topmost window
     * - `_parent`  Authorize in the parent window
     * - `_blank`   Authorize in new tab or window
     * - `"popup"`  Open a popup, authorize in it and close it when done
     * - `String`   Frame name (string index in window.frames)
     * - `Number`   Numeric index in `window.frames`
     * - `Object`   Window reference (must have the same `origin`)
     * - `Function` A function that returns one of the above values or a
     *   promise that will resolve to such value.
     */
    target?: string;
    /**
     * The width of the authorization popup window. Only used in browsers
     * and if the [[target]] option is set to "popup".
     */
    width?: number;
    /**
     * The height of the authorization popup window. Only used in browsers
     * and if the [[target]] option is set to "popup".
     */
    height?: number;
    /**
     * If `true`, the app will be initialized in the specified [[target]].
     * Otherwise, the app will be initialized in the window in which
     * [[authorize]] was called.
     */
    completeInTarget?: boolean;
}
