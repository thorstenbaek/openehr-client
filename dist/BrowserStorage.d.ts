export interface Storage {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<any>;
    unset(key: string): Promise<boolean>;
}
export declare class BrowserStorage implements Storage {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<any>;
    unset(key: string): Promise<boolean>;
}
