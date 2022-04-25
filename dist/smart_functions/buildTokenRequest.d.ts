import { ClientState } from '../models/ClientState';
/**
 * Builds the token request options. Does not make the request, just
 * creates it's configuration and returns it in a Promise.
 */
export declare function buildTokenRequest(code: string, state: ClientState): RequestInit;
