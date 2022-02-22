import {Storage, BrowserStorage} from "./BrowserStorage";

export interface Environment {
    getUrl():URL;
    getStorage(): Storage;
    relative(path: string):string;
    redirect(to: string): void | Promise<any>;
    btoa(str: string): string;
    atob(str: string): string;
}

class BrowserEnvironment implements Environment {
    _url: URL;
    _storage: Storage;
    
    constructor() {
        this._storage = null;
    }

    getUrl(): URL {
        if (!this._url) {
            this._url = new URL(location + "");
        }
        return this._url;
    }

    getStorage(): Storage {
        if (this._storage == null) {
            this._storage = new BrowserStorage()
        }
        return this._storage;
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

export const env:Environment = new BrowserEnvironment();