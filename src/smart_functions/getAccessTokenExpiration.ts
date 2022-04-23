import { env } from '../BrowserEnvironment';
import { jwtDecode } from '../lib/jwtDecode';

/**
 * Given a token response, computes and returns the expiresAt timestamp.
 * Note that this should only be used immediately after an access token is
 * received, otherwise the computed timestamp will be incorrect.
 * @param tokenResponse
 */

export function getAccessTokenExpiration(tokenResponse: TokenResponse): number {
  const now = Math.floor(Date.now() / 1000);

  // Option 1 - using the expires_in property of the token response
  if (tokenResponse.expires_in) {
    return now + tokenResponse.expires_in;
  }

  // Option 2 - using the exp property of JWT tokens (must not assume JWT!)
  if (tokenResponse.access_token) {
    const tokenBody = jwtDecode(tokenResponse.access_token, env);
    if (tokenBody && tokenBody.exp) {
      return tokenBody.exp;
    }
  }

  // Option 3 - if none of the above worked set this to 5 minutes after now
  return now + 300;
}
