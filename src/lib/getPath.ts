/**
 * Fetches the conformance statement from the given base URL.
 * Note that the result is cached in memory (until the page is reloaded in the
 * browser) because it might have to be re-used by the client
 * @param baseUrl The base URL of the FHIR server
 * @param [requestOptions] Any options passed to the fetch call
 */
/*
export function fetchConformanceStatement(baseUrl = "/", requestOptions?: RequestInit): Promise<fhirclient.FHIR.CapabilityStatement>
{
    const url = String(baseUrl).replace(/\/*$/, "/") + "metadata";
    return getAndCache(url, requestOptions).catch((ex: Error) => {
        throw new Error(
            `Failed to fetch the conformance statement from "${url}". ${ex}`
        );
    });
}
*/
/**
 * Walks through an object (or array) and returns the value found at the
 * provided path. This function is very simple so it intentionally does not
 * support any argument polymorphism, meaning that the path can only be a
 * dot-separated string. If the path is invalid returns undefined.
 * @param obj The object (or Array) to walk through
 * @param path The path (eg. "a.b.4.c")
 * @returns {*} Whatever is found in the path or undefined
 */

export function getPath(obj: Record<string, any>, path = ''): any {
  path = path.trim();
  if (!path) {
    return obj;
  }

  const segments = path.split('.');
  let result = obj;

  while (result && segments.length) {
    const key = segments.shift();
    if (!key && Array.isArray(result)) {
      return result.map((o) => getPath(o, segments.join('.')));
    } else {
      result = result[key as string];
    }
  }

  return result;
}
