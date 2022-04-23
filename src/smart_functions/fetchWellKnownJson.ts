import { getAndCache } from '../lib/getAndCache';

/**
 * Fetches the well-known json file from the given base URL.
 * Note that the result is cached in memory (until the page is reloaded in the
 * browser) because it might have to be re-used by the client
 * @param baseUrl The base URL of the FHIR server
 */

export function fetchWellKnownJson(baseUrl = '/', requestOptions?: RequestInit): Promise<WellKnownSmartConfiguration> {
  const url = String(baseUrl).replace(/\/*$/, '/') + '.well-known/smart-configuration';

  console.log('Oauth url', url);

  return getAndCache(url, requestOptions).catch((ex: Error) => {
    throw new Error(`Failed to fetch the well-known json "${url}". ${ex.message}`);
  });
}
