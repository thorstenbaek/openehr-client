interface ClientState {
    /**
             * The base URL of the Fhir server. The library should have detected it
             * at authorization time from request query params of from config options.
             */
    serverUrl: string;

    /**
     * The client_id that you should have obtained while registering your
     * app with the auth server or EHR (as set in the configuration options)
     */
    clientId?: string;

    /**
     * The URI to redirect to after successful authorization, as set in the
     * configuration options.
     */
    redirectUri?: string;

    /**
     * The access scopes that you requested in your options (or an empty string).
     * @see http://docs.smarthealthit.org/authorization/scopes-and-launch-context/
     */
    scope?: string;

    /**
     * Your client secret if you have one (for confidential clients)
     */
    clientSecret?: string;

    /**
     * The (encrypted) access token, in case you have completed the auth flow
     * already.
     */
    // access_token?: string;

    /**
     * The response object received from the token endpoint while trying to
     * exchange the auth code for an access token (if you have reached that point).
     */
    tokenResponse?: TokenResponse;

    /**
     * The username for basic auth. If present, `password` must also be provided.
     */
    username?: string;

    /**
     * The password for basic auth. If present, `username` must also be provided.
     */
    password?: string;

    /**
     * You could register new SMART client at this endpoint (if the server
     * supports dynamic client registration)
     */
    registrationUri?: string;

    /**
     * You must call this endpoint to ask for authorization code
     */
    authorizeUri?: string;

    /**
     * You must call this endpoint to exchange your authorization code
     * for an access token.
     */
    tokenUri?: string;

    /**
     * The key under which this state is persisted in the storage
     */
    key?: string;

    /**
     * If `true`, the app requested to be initialized in the specified [[target]].
     * Otherwise, the app requested to be initialized in the window in which
     * [[authorize]] was called.
     */
    completeInTarget?: boolean;

    /**
     * An Unix timestamp (JSON numeric value representing the number of
     * seconds since 1970). This updated every time an access token is
     * received from the server.
     */
    expiresAt?: number;
}
