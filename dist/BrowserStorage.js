"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserStorage = void 0;
class BrowserStorage {
    async get(key) {
        const value = sessionStorage[key];
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }
    async set(key, value) {
        sessionStorage[key] = JSON.stringify(value);
        return value;
    }
    async unset(key) {
        if (key in sessionStorage) {
            delete sessionStorage[key];
            return true;
        }
        return false;
    }
}
exports.BrowserStorage = BrowserStorage;
