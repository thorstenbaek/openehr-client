import { Environment } from '../models/Environment';
/**
 * Decodes a JWT token and returns it's body.
 * @param token The token to read
 * @param env An `Adapter` or any other object that has an `atob` method
 * @category Utility
 */
export declare function jwtDecode(token: string, env: Environment): Record<string, any> | null;
