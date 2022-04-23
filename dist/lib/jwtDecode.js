"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtDecode = void 0;
/**
 * Decodes a JWT token and returns it's body.
 * @param token The token to read
 * @param env An `Adapter` or any other object that has an `atob` method
 * @category Utility
 */
function jwtDecode(token, env) {
    const payload = token.split('.')[1];
    return payload ? JSON.parse(env.atob(payload)) : null;
}
exports.jwtDecode = jwtDecode;
