import { env } from '../BrowserEnvironment';
import { assert } from '../lib/assert';
import { ClientState } from '../models/ClientState';


/**
 * Builds the token request options. Does not make the request, just
 * creates it's configuration and returns it in a Promise.
 */

export function buildTokenRequest(code: string, state: ClientState): RequestInit {
  const { redirectUri, clientSecret, tokenUri, clientId } = state;

  assert(redirectUri, 'Missing state.redirectUri');
  assert(tokenUri, 'Missing state.tokenUri');
  assert(clientId, 'Missing state.clientId');

  const requestOptions: Record<string, any> = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: `code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectUri)}`,
  };

  // For public apps, authentication is not possible (and thus not required),
  // since a client with no secret cannot prove its identity when it issues a
  // call. (The end-to-end system can still be secure because the client comes
  // from a known, https protected endpoint specified and enforced by the
  // redirect uri.) For confidential apps, an Authorization header using HTTP
  // Basic authentication is required, where the username is the app’s
  // client_id and the password is the app’s client_secret (see example).
  if (clientSecret) {
    requestOptions.headers.Authorization = 'Basic ' + env.btoa(clientId + ':' + clientSecret);
    //debug("Using state.clientSecret to construct the authorization header: %s", requestOptions.headers.Authorization);
  } else {
    //debug("No clientSecret found in state. Adding the clientId to the POST body");
    requestOptions.body += `&client_id=${encodeURIComponent(clientId)}`;
  }

  return requestOptions as RequestInit;
}
