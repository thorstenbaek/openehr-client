import { Buffer } from 'buffer/';
import { getPath } from './lib/getPath';
import DocumentRequest from './models/DocumentRequest';

export const SMART_KEY = 'SMART_KEY';

export class Client {
  /**
   * The SMART on OpenEHR Client
   */
  state: ClientState;
  patient: string;
  encounter: string;
  resource: string;

  constructor(state: ClientState) {
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
    return getPath({ ...this.state }, path);
  }

  post(relativeUrl: string, body: string): Promise<any> {
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

  async query(aql: string, queryParameters: { [name: string]: object } = {}): Promise<any> {
    const queryContext: { [name: string]: [string] } = {};
    queryContext.PatientId = [this.patient];

    const param = {
      q: aql,
      query_parameters: queryParameters,
      queryContext: queryContext,
    };

    const response = await this.post('query', JSON.stringify(param));
    return await response.json();
  }

  async compose(composition: string): Promise<any> {
    const buffer = Buffer.from(composition);
    const base64string = buffer.toString('base64');

    const documentRequest: DocumentRequest = {
      content: base64string,
      contentType: 'application/json',
      templateId: 1002701,
      documentTypeId: 1001414,
      patientId: parseInt(this.patient),
      authorId: 1004733, //Rekvirent: Thor Stenbæk  dips-hcpid": "1004733"
      eventTime: new Date().toISOString(),
      documentFormat: 16,
    };

    const response = await this.post('document', JSON.stringify(documentRequest));
    return response.ok;
  }
}
