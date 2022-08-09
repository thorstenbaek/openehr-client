import { Environment } from "./Environment";

export interface Utils {

    responseToJSON(resp: Response): Promise<object|string>;
    checkResponse(resp: Response): Promise<Response>;
    request(url: string | Request, requestOptions: FetchOptions): Promise<any>;
    getPath(obj: Record<string, any>, path: string): any;
    setPath(obj: Record<string, any>, path: string, value: any, createEmpty: boolean): Record<string, any>;
    makeArray<T = any>(arg: any): T[];
    absolute(path: string, baseUrl?: string): string;    
    randomString(): string;
    jwtDecode(token: string, env: Environment): Record<string, any> | null;
    assert(condition: any, message: string): asserts condition;
}

export class BrowserUtils implements Utils {

    responseToJSON(resp: Response): Promise<object|string> {
        return resp.text().then(text => text.length ? JSON.parse(text) : "");
    }

    async checkResponse(resp: Response): Promise<Response> {
        if (!resp.ok) {
            throw new Error("response failed");
        }
        return resp;
    }

    /**
     * This is our built-in request function. It does a few things by default
     * (unless told otherwise):
     * - Makes CORS requests
     * - Sets accept header to "application/json"
     * - Handles errors
     * - If the response is json return the json object
     * - If the response is text return the result text
     * - Otherwise return the response object on which we call stuff like `.blob()`
     */

    request(url: string | Request, requestOptions: FetchOptions): Promise<any>
    {
        console.log(url);

        const { includeResponse, ...options } = requestOptions;

        return fetch(url, {
            mode: "cors", 
            ...options,
            headers: {
                accept: "application.json",
                ...options.headers
            }
        })
        .then(this.checkResponse)
        .then((res: Response) => {
            console.log(res);
            const type = res.headers.get("Content-Type") + "";
            if (type.match(/\bjson\b/i)) {
                return this.responseToJSON(res).then(body => ({res, body}));
            }
            if (type.match(/^text\//i)) {
                return res.text().then(body => ({res, body}));
            }
            return {res};
        })
        .then(({res, body}: {res:Response, body?:string}) => {
            return body;
        });
    }

    /**
     * Walks through an object (or array) and returns the value found at the
     * provided path. This function is very simple so it intentionally does not
     * support any argument polymorphism, meaning that the path can only be a
     * dot-separated string. If the path is invalid returns undefined.
     * @param obj The object (or Array) to walk through
     * @param path The path (eg. "a.b.4.c")
     * @returns {*} Whatever is found in the path or undefined
     */
    getPath(obj: Record<string, any>, path = ""): any {
        path = path.trim();
        if (!path) {
            return obj;
        }

        let segments = path.split(".");
        let result = obj;

        while (result && segments.length) {
            const key = segments.shift();
            if (!key && Array.isArray(result)) {
                return result.map(o => this.getPath(o, segments.join(".")));
            } else {
                result = result[key as string];
            }
        }

        return result;
    }

    /**
     * Like getPath, but if the node is found, its value is set to @value
     * @param obj The object (or Array) to walk through
     * @param path The path (eg. "a.b.4.c")
     * @param value The value to set
     * @param createEmpty If true, create missing intermediate objects or arrays
     * @returns The modified object
     */
    setPath(obj: Record<string, any>, path: string, value: any, createEmpty = false): Record<string, any> {
        path.trim().split(".").reduce(
            (out, key, idx, arr) => {
                if (out && idx === arr.length - 1) {
                    out[key] = value;
                }
                else {
                    if (out && out[key] === undefined && createEmpty) {
                        out[key] = arr[idx + 1].match(/^[0-9]+$/) ? [] : {};
                    }
                    return out ? out[key] : undefined;
                }
            },
            obj
        );
        return obj;
    }

    /**
     * If the argument is an array returns it as is. Otherwise puts it in an array
     * (`[arg]`) and returns the result
     * @param arg The element to test and possibly convert to array
     * @category Utility
     */
    makeArray<T = any>(arg: any): T[] {
        if (Array.isArray(arg)) {
            return arg;
        }
        return [arg];
    }

    /**
     * Given a path, converts it to absolute url based on the `baseUrl`. If baseUrl
     * is not provided, the result would be a rooted path (one that starts with `/`).
     * @param path The path to convert
     * @param baseUrl The base URL
     */
    absolute(path: string, baseUrl?: string): string
    {
        if (path.match(/^http/)) return path;
        if (path.match(/^urn/)) return path;
        return String(baseUrl || "").replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
    }

    /**
     * Generates random strings. By default this returns random 8 characters long
     * alphanumeric strings.
     * @param strLength The length of the output string. Defaults to 8.
     * @param charSet A string containing all the possible characters.
     *     Defaults to all the upper and lower-case letters plus digits.
     * @category Utility
     */
    randomString(
        strLength = 8,
        charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    ): string
    {
        const result = [];
        const len = charSet.length;
        while (strLength--) {
            result.push(charSet.charAt(Math.floor(Math.random() * len)));
        }
        return result.join("");
    }

    /**
     * Decodes a JWT token and returns it's body.
     * @param token The token to read
     * @param env An `Adapter` or any other object that has an `atob` method
     * @category Utility
     */
    jwtDecode(token: string, env: Environment): Record<string, any> | null
    {
        const payload = token.split(".")[1];
        return payload ? JSON.parse(env.atob(payload)) : null;
    }

    assert(condition: any, message: string): asserts condition {
        if (!(condition)) {
            throw new Error(message)
        }
    }
}