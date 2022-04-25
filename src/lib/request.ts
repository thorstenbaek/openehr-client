import { responseToJSON } from './responseToJSON';
import { checkResponse } from './checkResponse';

/**
 * This is our built-in request function. It does a few things by default
 * (unless told otherwise):
 * - Makes CORS requests
 * - Sets accept header to "application/json"
 * - Handles errors
 * - If the response is json return the json object
 * - If the response is text return the result text
 * - Otherwise return the response object on which we call stuff like `.blob()`
 */

export function request(url: string | Request, requestOptions: FetchOptions = {}): Promise<any> {
  console.log(url);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { includeResponse, ...options } = requestOptions;

  return fetch(url, {
    mode: 'cors',
    ...options,
    headers: {
      accept: 'application.json',
      ...options.headers,
    },
  })
    .then(checkResponse)
    .then((res: Response) => {
      console.log(res);
      const type = res.headers.get('Content-Type') + '';
      if (type.match(/\bjson\b/i)) {
        return responseToJSON(res).then((body) => ({ res, body }));
      }
      if (type.match(/^text\//i)) {
        return res.text().then((body) => ({ res, body }));
      }
      return { res };
    })
    .then(({ res, body }: { res: Response; body?: string }) => {
      return body;
    });

  /*const { includeResponse, ...options } = requestOptions;
    return fetch(url, {
        mode: "cors",
        ...options,
        headers: {
            accept: "application/json",
            ...options.headers
        }
    })
    .then(checkResponse)
    .then((res: Response) => {
        const type = res.headers.get("Content-Type") + "";
        if (type.match(/\bjson\b/i)) {
            return responseToJSON(res).then(body => ({ res, body }));
        }
        if (type.match(/^text\//i)) {
            return res.text().then(body => ({ res, body }));
        }
        return { res };
    })
    .then(({res, body}: {res:Response, body?:JsonObject|string}) => {

        // Some servers will reply after CREATE with json content type but with
        // empty body. In this case check if a location header is received and
        // fetch that to use it as the final result.
        if (!body && res.status == 201) {
            const location = res.headers.get("location");
            if (location) {
                return request(location, { ...options, method: "GET", body: null, includeResponse });
            }
        }

        if (includeResponse) {
            return { body, response: res };
        }

        // For any non-text and non-json response return the Response object.
        // This to let users decide if they want to call text(), blob() or
        // something else on it
        if (body === undefined) {
            return res;
        }

        // Otherwise just return the parsed body (can also be "" or null)
        return body;
    });*/
}
