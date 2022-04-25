"use strict";
/**
 * Used in fetch Promise chains to reject if the "ok" property is not true
 */
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
exports.checkResponse = void 0;
function checkResponse(resp) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!resp.ok) {
            throw new Error('response failed');
        }
        return resp;
    });
}
exports.checkResponse = checkResponse;
//# sourceMappingURL=checkResponse.js.map