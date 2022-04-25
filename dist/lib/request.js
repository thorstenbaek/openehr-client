"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const responseToJSON_1 = require("./responseToJSON");
const checkResponse_1 = require("./checkResponse");
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
function request(url, requestOptions = {}) {
    console.log(url);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { includeResponse } = requestOptions, options = __rest(requestOptions, ["includeResponse"]);
    return fetch(url, Object.assign(Object.assign({ mode: 'cors' }, options), { headers: Object.assign({ accept: 'application.json' }, options.headers) }))
        .then(checkResponse_1.checkResponse)
        .then((res) => {
        console.log(res);
        const type = res.headers.get('Content-Type') + '';
        if (type.match(/\bjson\b/i)) {
            return (0, responseToJSON_1.responseToJSON)(res).then((body) => ({ res, body }));
        }
        if (type.match(/^text\//i)) {
            return res.text().then((body) => ({ res, body }));
        }
        return { res };
    })
        .then(({ res, body }) => {
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
exports.request = request;
//# sourceMappingURL=request.js.map