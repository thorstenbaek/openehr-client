import Environment from "./Environment";
import {Storage, BrowserStorage} from "./BrowserStorage";

export default class BrowserEnvironment implements Environment {
    url: URL;
    storage: Storage;
    
    constructor() {
        this.url = new URL(location + "");
        this.storage = new BrowserStorage()
    }

    getUrl(): URL {
        return this.url;
    }

    getStorage(): Storage {
        return this.storage;
    }

    relative(path: string): string {
        return new URL(path, this.getUrl().href).href;
    }

    redirect(to: string): void | Promise<any>{
        location.href = to;        
    }

    btoa(str: string): string {
        return window.btoa(str);
    }

    atob(str: string): string {
        return window.atob(str);
    }
}