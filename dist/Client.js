"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.SMART_KEY = void 0;
const buffer_1 = require("buffer/");
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
        return (0, getPath_1.getPath)({ ...this.state }, path);
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
    async query(aql, queryParameters = {}) {
        const queryContext = {};
        queryContext.PatientId = [this.patient];
        const param = {
            q: aql,
            query_parameters: queryParameters,
            queryContext: queryContext,
        };
        const response = await this.post('query', JSON.stringify(param));
        return await response.json();
    }
    async compose(composition) {
        const buffer = buffer_1.Buffer.from(composition);
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
        const response = await this.post('document', JSON.stringify(documentRequest));
        return response.ok;
    }
}
exports.Client = Client;
