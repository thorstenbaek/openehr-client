export declare namespace openehrclient {
    function authorize(options: AuthorizeParams): Promise<string | void>;
    type WindowTargetVariable = "_self" | "_top" | "_parent" | "_blank" | "popup" | string | number | Window;
    type WindowTarget = WindowTargetVariable;
}
