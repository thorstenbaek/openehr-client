"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ready = exports.authorize = exports.openEHRClient = void 0;
const Client_1 = require("./Client");
Object.defineProperty(exports, "openEHRClient", { enumerable: true, get: function () { return Client_1.Client; } });
const authorize_1 = require("./smart_functions/authorize");
Object.defineProperty(exports, "authorize", { enumerable: true, get: function () { return authorize_1.authorize; } });
const ready_1 = require("./smart_functions/ready");
Object.defineProperty(exports, "ready", { enumerable: true, get: function () { return ready_1.ready; } });
//# sourceMappingURL=index.js.map