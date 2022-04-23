"use strict";
/**
 * Given a path, converts it to absolute url based on the `baseUrl`. If baseUrl
 * is not provided, the result would be a rooted path (one that starts with `/`).
 * @param path The path to convert
 * @param baseUrl The base URL
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.absolute = void 0;
function absolute(path, baseUrl) {
    if (path.match(/^http/))
        return path;
    if (path.match(/^urn/))
        return path;
    return String(baseUrl || '').replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}
exports.absolute = absolute;
