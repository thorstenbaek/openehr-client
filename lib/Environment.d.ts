import { Storage } from "./BrowserStorage";
export interface Environment {
    getUrl(): URL;
    getStorage(): Storage;
    relative(path: string): string;
    redirect(to: string): void | Promise<any>;
    btoa(str: string): string;
    atob(str: string): string;
}
export declare const env: Environment;
