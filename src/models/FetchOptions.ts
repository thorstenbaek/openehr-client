/**
 * Options passed to the lib.request function
 */
interface FetchOptions extends RequestInit {
  /**
   * If `true` the request function will be instructed to resolve with a
   * [[CombinedFetchResult]] object that contains the `Response` object
   * abd the parsed body (if any)
   */
  includeResponse?: boolean;
}
