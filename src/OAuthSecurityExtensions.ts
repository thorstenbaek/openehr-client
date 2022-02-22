/**
     * The three security endpoints that SMART servers might declare in the
     * conformance statement
     */
 interface OAuthSecurityExtensions {

    /**
     * You could register new SMART client at this endpoint (if the server
     * supports dynamic client registration)
     */
    registrationUri: string;

    /**
     * You must call this endpoint to ask for authorization code
     */
    authorizeUri: string;

    /**
     * You must call this endpoint to exchange your authorization code
     * for an access token.
     */
    tokenUri: string;
}