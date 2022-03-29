import { openehrclient } from "../types";
export declare class BrowserStorage implements openehrclient.Storage {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<any>;
    unset(key: string): Promise<boolean>;
}
