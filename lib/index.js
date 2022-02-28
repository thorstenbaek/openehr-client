"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myTypes = exports.ready = exports.authorize = void 0;
var Client_1 = require("./Client");
Object.defineProperty(exports, "authorize", { enumerable: true, get: function () { return Client_1.authorize; } });
Object.defineProperty(exports, "ready", { enumerable: true, get: function () { return Client_1.ready; } });
const clienttypes = require("./Client");
var myTypes;
(function (myTypes) {
    myTypes.clientypes = clienttypes;
})(myTypes = exports.myTypes || (exports.myTypes = {}));
//export function client(stateOrURI: fhirclient.ClientState | string): Client;
/*export const AbortController: {
    new (): AbortController;
    prototype: AbortController;
};*/
