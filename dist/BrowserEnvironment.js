"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.BrowserEnvironment = void 0;
const BrowserStorage_1 = require("./BrowserStorage");
class BrowserEnvironment {
    constructor() {
        this._storage = null;
    }
    getUrl() {
        if (!this._url) {
            this._url = new URL(location + '');
        }
        return this._url;
    }
    getStorage() {
        if (this._storage == null) {
            this._storage = new BrowserStorage_1.BrowserStorage();
        }
        return this._storage;
    }
    relative(path) {
        return new URL(path, this.getUrl().href).href;
    }
    redirect(to) {
        location.href = to;
    }
    btoa(str) {
        return window.btoa(str);
    }
    atob(str) {
        return window.atob(str);
    }
}
exports.BrowserEnvironment = BrowserEnvironment;
exports.env = new BrowserEnvironment();
//# sourceMappingURL=BrowserEnvironment.js.map