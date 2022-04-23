/**
 * Used in fetch Promise chains to reject if the "ok" property is not true
 */

export async function checkResponse(resp: Response): Promise<Response> {
  if (!resp.ok) {
    throw new Error('response failed');
  }
  return resp;
}
