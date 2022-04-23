"use strict";
/**
 * Used in fetch Promise chains to reject if the "ok" property is not true
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResponse = void 0;
async function checkResponse(resp) {
    if (!resp.ok) {
        throw new Error('response failed');
    }
    return resp;
}
exports.checkResponse = checkResponse;
