import { Environment } from '../models/Environment';

/**
 * Decodes a JWT token and returns it's body.
 * @param token The token to read
 * @param env An `Adapter` or any other object that has an `atob` method
 * @category Utility
 */

export function jwtDecode(token: string, env: Environment): Record<string, any> | null {
  const payload = token.split('.')[1];
  return payload ? JSON.parse(env.atob(payload)) : null;
}
