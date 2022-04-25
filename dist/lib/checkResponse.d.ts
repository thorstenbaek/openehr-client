/**
 * Used in fetch Promise chains to reject if the "ok" property is not true
 */
export declare function checkResponse(resp: Response): Promise<Response>;
