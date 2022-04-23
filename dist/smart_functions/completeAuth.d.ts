import { Client } from '../Client';
/**
 * The completeAuth function should only be called on the page that represents
 * the redirectUri. We typically land there after a redirect from the
 * authorization server..
 */
export declare function completeAuth(): Promise<Client>;
