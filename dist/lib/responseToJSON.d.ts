/**
 * A namespace with functions for converting between different measurement units
 */
/**
 * Assertion function to guard arguments for `units` functions
 */
/**
 * Used in fetch Promise chains to reject if the "ok" property is not true
 */
/**
 * Used in fetch Promise chains to return the JSON version of the response.
 * Note that `resp.json()` will throw on empty body so we use resp.text()
 * instead.
 */
export declare function responseToJSON(resp: Response): Promise<object | string>;
