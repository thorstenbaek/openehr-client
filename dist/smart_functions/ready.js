"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ready = void 0;
const completeAuth_1 = require("./completeAuth");
/**
 * @param env
 * @param [onSuccess]
 * @param [onError]
 */
async function ready(onSuccess, onError) {
    let task = (0, completeAuth_1.completeAuth)();
    if (onSuccess) {
        task = task.then(onSuccess);
    }
    if (onError) {
        task = task.catch(onError);
    }
    return task;
}
exports.ready = ready;
