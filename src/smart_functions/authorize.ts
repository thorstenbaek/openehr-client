
import {randomString} from "../lib/randomString";
import {Client, SMART_KEY} from "../Client";
import {getSecurityExtensions} from "./getSecurityExtensions";
import {env} from "../BrowserEnvironment";


export async function authorize(params: AuthorizeParams): Promise<Client> {
    const url = env.getUrl(); new URL(location + "");

    // Obtain input
    const {
        clientSecret, fakeTokenResponse, patientId, encounterId, target, width, height
    } = params;

    let {
        iss, launch, fhirServiceUrl, redirectUri, scope = "", clientId, completeInTarget
    } = params;

    const storage = env.getStorage();

    // For these three an url param takes precedence over inline option
    iss = url.searchParams.get("iss") || iss;
    fhirServiceUrl = url.searchParams.get("fhirServiceUrl") || fhirServiceUrl;
    launch = url.searchParams.get("launch") || launch;

    if (!redirectUri) {
        redirectUri = env.relative(".");
    } else if (!redirectUri.match(/^https?\:\/\//)) {
        redirectUri = env.relative(redirectUri);
    }

    if (iss) {
        console.log(`Making EHR launch...`);
    }

    // append launch scope if needed
    if (launch && !scope.match(/launch/)) {
        scope += " launch";
    }

    // If `authorize` is called, make sure we clear any previous state (in case
    // this is a re-authorize)
    const oldKey = await storage.get(SMART_KEY);
    await storage.unset(oldKey);

    const serverUrl = iss;

    const stateKey = randomString(16);

    const state: ClientState = {
        clientId,
        scope,
        redirectUri,
        serverUrl,
        clientSecret,
        tokenResponse: {},
        key: stateKey,
        completeInTarget
    };

    const extensions = await getSecurityExtensions(serverUrl);
    Object.assign(state, extensions);
    await storage.set(stateKey, state);

    // build the redirect uri
    const redirectParams = [
        "response_type=code",
        "client_id=" + encodeURIComponent(clientId || ""),
        "scope=" + encodeURIComponent(scope),
        "redirect_uri=" + encodeURIComponent(redirectUri),
        "aud=" + encodeURIComponent(serverUrl),
        "state=" + encodeURIComponent(stateKey)
    ];


    // also pass this in case of EHR launch
    if (launch) {
        redirectParams.push("launch=" + encodeURIComponent(launch));
    }

    let redirectUrl = state.authorizeUri + "?" + redirectParams.join("&");

    console.log(redirectUrl);

    if (iss) {
        await storage.set(stateKey, state);

        return await env.redirect(redirectUrl);
    }
}
