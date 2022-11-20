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

    post(relativeUrl: string, body: string, customHeaders: Record<string, string> = {}): Promise<any> {
        var headers: Record<string,string> = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.state.tokenResponse?.access_token,
        };
        
        var keys = Object.keys(customHeaders);

        if (keys.length > 0) {
            keys.forEach(key => {
                headers[key] = customHeaders[key];
            });            
        }
        
        console.log("Headers", headers);

        
        return fetch(`${this.state.serverUrl}/${relativeUrl}`, {
            method: "POST",
            mode: "cors", 
            headers: headers,
            body: body
        })        
    }

    async query(aql: string, queryParameters: {[name:string]:object} = {}): Promise<any> {        
        if (!this.patient) {
            throw Error("Missing patient in client");
        }
        
        //let queryContext: {[name:string]:[string]} = {};        
        type QueryContextVariables = Record<string,string[]>;       
        const queryContext :QueryContextVariables = {};
        
        queryContext.PatientId = [this.patient];
        
        var param = {
            q: aql,
            query_parameters: queryParameters,
            queryContext: queryContext

        };

        var response = await this.post("query", JSON.stringify(param));       
        return await response.json();
    }

    async compose(concept: string, composition: string): Promise<any> {
        if (!this.patient) {
            throw Error("Missing patient in client");
        }
        
        var conceptArray: string[] = concept.split(":");

        let documentType:number = parseInt(conceptArray[0]);
        let template: number = parseInt(conceptArray[1]);
        
        var context: Record<string, string> = {
            "dips-pas-patientId": this.patient,
            "dips-healthrecord-document-type":documentType.toString(),
            "dips-healthrecord-templateId":template.toString()
        }       
        console.log(composition);

        const response = await this.post("composition", composition, context);
        return response.ok;
    }
}