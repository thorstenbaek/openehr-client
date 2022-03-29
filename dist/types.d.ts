export declare namespace openehrclient {
    function authorize(options: AuthorizeParams): Promise<string | void>;
    interface Storage {
        get(key: string): Promise<any>;
        set(key: string, value: any): Promise<any>;
        unset(key: string): Promise<boolean>;
    }
    interface Environment {
        getUrl(): URL;
        getStorage(): Storage;
        relative(path: string): string;
        redirect(to: string): void | Promise<any>;
        btoa(str: string): string;
        atob(str: string): string;
    }
    type WindowTargetVariable = "_self" | "_top" | "_parent" | "_blank" | "popup" | string | number | Window;
    type WindowTarget = WindowTargetVariable;
}
