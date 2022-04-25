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
exports.Client = exports.SMART_KEY = void 0;
const getPath_1 = require("./lib/getPath");
exports.SMART_KEY = 'SMART_KEY';
class Client {
    constructor(state) {
        let patientId = state.tokenResponse.patient;
        if (patientId.startsWith('cdp')) {
            patientId = patientId.substring(3);
        }
        console.log(state);
        this.state = state;
        this.patient = patientId;
        this.encounter = state.tokenResponse.encounter;
        this.resource = state.tokenResponse.resource;
    }
    getState(path = '') {
        return (0, getPath_1.getPath)(Object.assign({}, this.state), path);
    }
    post(relativeUrl, body) {
        return fetch(`${this.state.serverUrl}/${relativeUrl}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.tokenResponse.access_token,
            },
            body: body,
        });
    }
    query(aql, queryParameters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryContext = {};
            queryContext.PatientId = [this.patient];
            const param = {
                q: aql,
                query_parameters: queryParameters,
                queryContext: queryContext,
            };
            const response = yield this.post('query', JSON.stringify(param));
            return yield response.json();
        });
    }
    compose(composition) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = Buffer.from(composition);
            const base64string = buffer.toString('base64');
            const documentRequest = {
                content: base64string,
                contentType: 'application/json',
                templateId: 1002701,
                documentTypeId: 1001414,
                patientId: parseInt(this.patient),
                authorId: 1004733,
                eventTime: new Date().toISOString(),
                documentFormat: 16,
            };
            const response = yield this.post('document', JSON.stringify(documentRequest));
            return response.ok;
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map