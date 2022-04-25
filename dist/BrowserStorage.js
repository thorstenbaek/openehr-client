"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserStorage = void 0;
class BrowserStorage {
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = sessionStorage[key];
            if (value) {
                return JSON.parse(value);
            }
            return null;
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            sessionStorage[key] = JSON.stringify(value);
            return value;
        });
    }
    unset(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key in sessionStorage) {
                delete sessionStorage[key];
                return true;
            }
            return false;
        });
    }
}
exports.BrowserStorage = BrowserStorage;
//# sourceMappingURL=BrowserStorage.js.map