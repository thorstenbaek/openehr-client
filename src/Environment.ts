import {Storage} from "./BrowserStorage";

export default interface Environment {
    getUrl():URL;
    getStorage(): Storage;
    relative(path: string):string;
    redirect(to: string): void | Promise<any>;
    btoa(str: string): string;
    atob(str: string): string;
}