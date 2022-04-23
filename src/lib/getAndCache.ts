import {request} from "./request";

/**
 * Makes a request using `fetch` and stores the result in internal memory cache.
 * The cache is cleared when the page is unloaded.
 * @param url The URL to request
 * @param requestOptions Request options
 * @param force If true, reload from source and update the cache, even if it has
 * already been cached.
 */

export function getAndCache(url: string, requestOptions?: RequestInit, force: boolean = /*process.env.NODE_ENV === "test"*/ true): Promise<any> {
    // if (force || !cache[url]) {        
    //     cache[url] = request(url/*, requestOptions*/);
    //     return cache[url];
    // }
    return Promise.resolve(request(url, requestOptions));
}
