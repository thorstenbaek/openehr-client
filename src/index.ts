import { BrowserEnvironment } from "./Environment";
import {authorize as internalAuthorize, ready as internalReady} from "./authorize";
import Client from "./Client";
import { BrowserUtils } from "./Utils";
import AuthorizeParams from "./AuthorizeParams";


export async function authorize(params: AuthorizeParams) : Promise<Client> {
    console.log("Forwarding authorize");
    return await internalAuthorize(params, new BrowserEnvironment(), new BrowserUtils());
}

export async function ready(onSuccess?: (client: Client) => any, onError?: (error: Error) => any): Promise<Client> {
    console.log("Forwarding ready");
    return await internalReady(new BrowserEnvironment(), new BrowserUtils(), onSuccess, onError);
}
