import { WellKnownSmartConfiguration } from '../models/WellKnownSmartConfiguration';
/**
 * Fetches the well-known json file from the given base URL.
 * Note that the result is cached in memory (until the page is reloaded in the
 * browser) because it might have to be re-used by the client
 * @param baseUrl The base URL of the FHIR server
 */
export declare function fetchWellKnownJson(baseUrl?: string, requestOptions?: RequestInit): Promise<WellKnownSmartConfiguration>;
