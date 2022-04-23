"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const randomString_1 = require("../lib/randomString");
const Client_1 = require("../Client");
const getSecurityExtensions_1 = require("./getSecurityExtensions");
const BrowserEnvironment_1 = require("../BrowserEnvironment");
async function authorize(params) {
    const url = BrowserEnvironment_1.env.getUrl();
    new URL(location + '');
    // Obtain input
    const { clientSecret, fakeTokenResponse, patientId, encounterId, target, width, height } = params;
    // eslint-disable-next-line prefer-const
    let { iss, launch, fhirServiceUrl, redirectUri, scope = '', clientId, completeInTarget } = params;
    const storage = BrowserEnvironment_1.env.getStorage();
    // For these three an url param takes precedence over inline option
    iss = url.searchParams.get('iss') || iss;
    fhirServiceUrl = url.searchParams.get('fhirServiceUrl') || fhirServiceUrl;
    launch = url.searchParams.get('launch') || launch;
    if (!redirectUri) {
        redirectUri = BrowserEnvironment_1.env.relative('.');
    }
    else if (!redirectUri.match(/^https?\\:\/\//)) {
        redirectUri = BrowserEnvironment_1.env.relative(redirectUri);
    }
    if (iss) {
        console.log(`Making EHR launch...`);
    }
    // append launch scope if needed
    if (launch && !scope.match(/launch/)) {
        scope += ' launch';
    }
    // If `authorize` is called, make sure we clear any previous state (in case
    // this is a re-authorize)
    const oldKey = await storage.get(Client_1.SMART_KEY);
    await storage.unset(oldKey);
    const serverUrl = iss;
    const stateKey = (0, randomString_1.randomString)(16);
    const state = {
        clientId,
        scope,
        redirectUri,
        serverUrl,
        clientSecret,
        tokenResponse: {},
        key: stateKey,
        completeInTarget,
    };
    const extensions = await (0, getSecurityExtensions_1.getSecurityExtensions)(serverUrl);
    Object.assign(state, extensions);
    await storage.set(stateKey, state);
    // build the redirect uri
    const redirectParams = [
        'response_type=code',
        'client_id=' + encodeURIComponent(clientId || ''),
        'scope=' + encodeURIComponent(scope),
        'redirect_uri=' + encodeURIComponent(redirectUri),
        'aud=' + encodeURIComponent(serverUrl),
        'state=' + encodeURIComponent(stateKey),
    ];
    // also pass this in case of EHR launch
    if (launch) {
        redirectParams.push('launch=' + encodeURIComponent(launch));
    }
    const redirectUrl = state.authorizeUri + '?' + redirectParams.join('&');
    console.log(redirectUrl);
    if (iss) {
        await storage.set(stateKey, state);
        return await BrowserEnvironment_1.env.redirect(redirectUrl);
    }
}
exports.authorize = authorize;
