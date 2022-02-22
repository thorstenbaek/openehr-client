interface WellKnownSmartConfiguration {
    /**
     * URL to the OAuth2 authorization endpoint.
     */
    authorization_endpoint: string;

    /**
     * URL to the OAuth2 token endpoint.
     */
    token_endpoint: string;

    /**
     * If available, URL to the OAuth2 dynamic registration endpoint for the
     * FHIR server.
     */
    registration_endpoint?: string;

    /**
     * RECOMMENDED! URL where an end-user can view which applications currently
     * have access to data and can make adjustments to these access rights.
     */
    management_endpoint?: string;

    /**
     * RECOMMENDED! URL to a server’s introspection endpoint that can be used
     * to validate a token.
     */
    introspection_endpoint?: string;

    /**
     * RECOMMENDED! URL to a server’s revoke endpoint that can be used to
     * revoke a token.
     */
    revocation_endpoint?: string;

    /**
     * Array of client authentication methods supported by the token endpoint.
     * The options are “client_secret_post” and “client_secret_basic”.
     */
    token_endpoint_auth_methods?: any[]; //SMARTAuthenticationMethod[];

    /**
     * Array of scopes a client may request.
     */
    scopes_supported?: string[];

    /**
     * Array of OAuth2 response_type values that are supported
     */
    response_types_supported?: string[];

    /**
     * Array of strings representing SMART capabilities (e.g., single-sign-on
     * or launch-standalone) that the server supports.
     */
    capabilities: Array<any>;
    /*    SMARTAuthenticationMethod |
        launchMode |
        clientType |
        singleSignOn |
        launchContext |
        launchContextEHR |
        launchContextStandalone |
        permissions
    >;*/
}
