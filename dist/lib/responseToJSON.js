"use strict";
/**
 * A namespace with functions for converting between different measurement units
 */
/*
export const units = {
    cm({ code, value }: fhirclient.CodeValue) {
        ensureNumerical({ code, value });
        if (code == "cm"     ) return value;
        if (code == "m"      ) return value *   100;
        if (code == "in"     ) return value *  2.54;
        if (code == "[in_us]") return value *  2.54;
        if (code == "[in_i]" ) return value *  2.54;
        if (code == "ft"     ) return value * 30.48;
        if (code == "[ft_us]") return value * 30.48;
        throw new Error("Unrecognized length unit: " + code);
    },
    kg({ code, value }: fhirclient.CodeValue){
        ensureNumerical({ code, value });
        if (code == "kg"    ) return value;
        if (code == "g"     ) return value / 1000;
        if (code.match(/lb/)) return value / 2.20462;
        if (code.match(/oz/)) return value / 35.274;
        throw new Error("Unrecognized weight unit: " + code);
    },
    any(pq: fhirclient.CodeValue){
        ensureNumerical(pq);
        return pq.value;
    }
};
*/
/**
 * Assertion function to guard arguments for `units` functions
 */
/*
function ensureNumerical({ value, code }: fhirclient.CodeValue) {
    if (typeof value !== "number") {
        throw new Error("Found a non-numerical unit: " + value + " " + code);
    }
}
*/
/**
 * Used in fetch Promise chains to reject if the "ok" property is not true
 */
/*
export async function checkResponse(resp: Response): Promise<Response> {
    if (!resp.ok) {
        const error = new HttpError(resp);
        await error.parse();
        throw error;
    }
    return resp;
}
*/
/**
 * Used in fetch Promise chains to return the JSON version of the response.
 * Note that `resp.json()` will throw on empty body so we use resp.text()
 * instead.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseToJSON = void 0;
function responseToJSON(resp) {
    return resp.text().then((text) => (text.length ? JSON.parse(text) : ''));
}
exports.responseToJSON = responseToJSON;
//# sourceMappingURL=responseToJSON.js.map