import { AuthorizeParams } from "./models/AuthorizeParams";

/* eslint-disable @typescript-eslint/no-namespace */
export declare namespace openehrclient {
  export function authorize(options: AuthorizeParams): Promise<string | void>;

  type WindowTargetVariable = '_self' | '_top' | '_parent' | '_blank' | 'popup' | string | number | Window;
  //    function WindowTargetFunction(): WindowTargetVariable;
  //    function WindowTargetFunction(): Promise<WindowTargetVariable>;
  type WindowTarget = WindowTargetVariable; //| typeof WindowTargetFunction;
}
