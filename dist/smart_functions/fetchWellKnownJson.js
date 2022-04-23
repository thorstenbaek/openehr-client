"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWellKnownJson = void 0;
const getAndCache_1 = require("../lib/getAndCache");
/**
 * Fetches the well-known json file from the given base URL.
 * Note that the result is cached in memory (until the page is reloaded in the
 * browser) because it might have to be re-used by the client
 * @param baseUrl The base URL of the FHIR server
 */
function fetchWellKnownJson(baseUrl = '/', requestOptions) {
    const url = String(baseUrl).replace(/\/*$/, '/') + '.well-known/smart-configuration';
    console.log('Oauth url', url);
    return (0, getAndCache_1.getAndCache)(url, requestOptions).catch((ex) => {
        throw new Error(`Failed to fetch the well-known json "${url}". ${ex.message}`);
    });
}
exports.fetchWellKnownJson = fetchWellKnownJson;
