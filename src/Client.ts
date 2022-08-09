import ClientState from "./ClientState";
import DocumentRequest from "./DocumentRequest";
import {Buffer} from "buffer/";

/**
 * The SMART on OpenEHR Client
 */
export default class Client {
    state: ClientState;
    patient?: string;    
    encounter?: string;
    resource?: string;

    constructor(state: ClientState) {
        
        if (state == null) {
            throw Error("state parameter is null");
        }

        var patientId = state.tokenResponse?.patient;
        if (patientId?.startsWith("cdp")) {
            patientId = patientId.substring(3);
        }
        
        this.state = state;
        this.patient = patientId;
        this.encounter = state.tokenResponse?.encounter;
        this.resource = state.tokenResponse?.resource;
    }

    post(relativeUrl: string, body: string): Promise<any> {
        return fetch(`${this.state.serverUrl}/${relativeUrl}`, {
            method: "POST",
            mode: "cors", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.state.tokenResponse?.access_token,
            },
            body: body
        })        
    }

    async query(aql: string, queryParameters: {[name:string]:object} = {}): Promise<any> {        
        if (!this.patient) {
            throw Error("Missing patient in client");
        }
        
        let queryContext: {[name:string]:[string]} = {};        
        queryContext.PatientId = [this.patient];
        
        var param = {
            q: aql,
            query_parameters: queryParameters,
            queryContext: queryContext

        };

        var response = await this.post("query", JSON.stringify(param));       
        return await response.json();
    }

    async compose(composition: string): Promise<any> {
        if (!this.patient) {
            throw Error("Missing patient in client");
        }

        var buffer = Buffer.from(composition);
        var base64string = buffer.toString("base64");


        var documentRequest: DocumentRequest = {
            content: base64string,
            contentType: "application/json",
            templateId: 1002761,
            documentTypeId: -4027,
            patientId: parseInt(this.patient),
            authorId: 1004725, //Rekvirent: Thor Stenbæk  dips-hcpid": "1004725"
            eventTime: new Date().toISOString(),
            documentFormat: 16            
        }

        const response = await this.post("document", JSON.stringify(documentRequest));
        return response.ok;
    }
}