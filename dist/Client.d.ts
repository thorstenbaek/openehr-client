import { ClientState } from './models/ClientState';
export declare const SMART_KEY = "SMART_KEY";
export declare class Client {
    /**
     * The SMART on OpenEHR Client
     */
    state: ClientState;
    patient: string;
    encounter: string;
    resource: string;
    constructor(state: ClientState);
    getState(path?: string): any;
    post(relativeUrl: string, body: string): Promise<any>;
    query(aql: string, queryParameters?: {
        [name: string]: object;
    }): Promise<any>;
    compose(composition: string): Promise<any>;
}
