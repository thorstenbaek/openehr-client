import { Storage } from './Storage';
import { Environment } from './models/Environment';
export declare class BrowserEnvironment implements Environment {
    _url: URL;
    _storage: Storage;
    constructor();
    getUrl(): URL;
    getStorage(): Storage;
    relative(path: string): string;
    redirect(to: string): void | Promise<any>;
    btoa(str: string): string;
    atob(str: string): string;
}
export declare const env: Environment;
