export declare namespace openehrclient {
    export function authorize(options: AuthorizeParams): Promise<string|void>;

    export interface Storage {
        get(key: string): Promise<any>
        set(key: string, value: any): Promise<any>
        unset(key: string): Promise<boolean>
    }

    export interface Environment {
        getUrl():URL;
        getStorage(): Storage;
        relative(path: string):string;
        redirect(to: string): void | Promise<any>;
        btoa(str: string): string;
        atob(str: string): string;
    }


type WindowTargetVariable = "_self"|"_top"|"_parent"|"_blank"|"popup"|string|number|Window;
//    function WindowTargetFunction(): WindowTargetVariable;
//    function WindowTargetFunction(): Promise<WindowTargetVariable>;
    type WindowTarget = WindowTargetVariable //| typeof WindowTargetFunction;
}