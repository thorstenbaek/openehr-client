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
exports.ready = void 0;
const completeAuth_1 = require("./completeAuth");
/**
 * @param env
 * @param [onSuccess]
 * @param [onError]
 */
function ready(onSuccess, onError) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = (0, completeAuth_1.completeAuth)();
        if (onSuccess) {
            task = task.then(onSuccess);
        }
        if (onError) {
            task = task.catch(onError);
        }
        return task;
    });
}
exports.ready = ready;
//# sourceMappingURL=ready.js.map