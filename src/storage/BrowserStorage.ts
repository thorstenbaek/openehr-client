import {openehrclient} from "../types"

export class BrowserStorage implements openehrclient.Storage{

    async get(key: string): Promise<any> {
        const value = sessionStorage[key];
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }

    async set(key: string, value: any): Promise<any> {
        sessionStorage[key] = JSON.stringify(value);
        return value;
    }

    async unset(key: string): Promise<boolean> {
        if (key in sessionStorage) {
            delete sessionStorage[key];
            return true;
        }
        return false;
    }
}