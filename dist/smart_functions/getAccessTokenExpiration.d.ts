import { TokenResponse } from '../models/TokenResponse';
/**
 * Given a token response, computes and returns the expiresAt timestamp.
 * Note that this should only be used immediately after an access token is
 * received, otherwise the computed timestamp will be incorrect.
 * @param tokenResponse
 */
export declare function getAccessTokenExpiration(tokenResponse: TokenResponse): number;
