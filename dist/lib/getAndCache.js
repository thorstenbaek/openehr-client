"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAndCache = void 0;
const request_1 = require("./request");
/**
 * Makes a request using `fetch` and stores the result in internal memory cache.
 * The cache is cleared when the page is unloaded.
 * @param url The URL to request
 * @param requestOptions Request options
 * @param force If true, reload from source and update the cache, even if it has
 * already been cached.
 */
function getAndCache(url, requestOptions, force = /*process.env.NODE_ENV === "test"*/ true) {
    // if (force || !cache[url]) {
    //     cache[url] = request(url/*, requestOptions*/);
    //     return cache[url];
    // }
    return Promise.resolve((0, request_1.request)(url, requestOptions));
}
exports.getAndCache = getAndCache;
