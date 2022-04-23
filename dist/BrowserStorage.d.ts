import { Storage } from './Storage';
export declare class BrowserStorage implements Storage {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<any>;
    unset(key: string): Promise<boolean>;
}
