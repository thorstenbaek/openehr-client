"use strict";
/**
 * Like getPath, but if the node is found, its value is set to @value
 * @param obj The object (or Array) to walk through
 * @param path The path (eg. "a.b.4.c")
 * @param value The value to set
 * @param createEmpty If true, create missing intermediate objects or arrays
 * @returns The modified object
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPath = void 0;
function setPath(obj, path, value, createEmpty = false) {
    path
        .trim()
        .split('.')
        .reduce((out, key, idx, arr) => {
        if (out && idx === arr.length - 1) {
            out[key] = value;
        }
        else {
            if (out && out[key] === undefined && createEmpty) {
                out[key] = arr[idx + 1].match(/^[0-9]+$/) ? [] : {};
            }
            return out ? out[key] : undefined;
        }
    }, obj);
    return obj;
}
exports.setPath = setPath;
//# sourceMappingURL=setPath.js.map