"use strict";
/**
 * If the argument is an array returns it as is. Otherwise puts it in an array
 * (`[arg]`) and returns the result
 * @param arg The element to test and possibly convert to array
 * @category Utility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeArray = void 0;
function makeArray(arg) {
    if (Array.isArray(arg)) {
        return arg;
    }
    return [arg];
}
exports.makeArray = makeArray;
