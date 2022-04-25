import { Client } from '../Client';
/**
 * @param env
 * @param [onSuccess]
 * @param [onError]
 */
export declare function ready(onSuccess?: (client: Client) => any, onError?: (error: Error) => any): Promise<Client>;
