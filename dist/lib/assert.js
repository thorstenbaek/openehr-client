"use strict";
/**
 * Given a token response, computes and returns the expiresAt timestamp.
 * Note that this should only be used immediately after an access token is
 * received, otherwise the computed timestamp will be incorrect.
 * @param tokenResponse
 * @param env
 */
/*
export function getAccessTokenExpiration(tokenResponse: fhirclient.TokenResponse, env: fhirclient.Adapter): number
{
    const now = Math.floor(Date.now() / 1000);

    // Option 1 - using the expires_in property of the token response
    if (tokenResponse.expires_in) {
        return now + tokenResponse.expires_in;
    }

    // Option 2 - using the exp property of JWT tokens (must not assume JWT!)
    if (tokenResponse.access_token) {
        let tokenBody = jwtDecode(tokenResponse.access_token, env);
        if (tokenBody && tokenBody.exp) {
            return tokenBody.exp;
        }
    }

    // Option 3 - if none of the above worked set this to 5 minutes after now
    return now + 300;
}
*/
/**
 * Groups the observations by code. Returns a map that will look like:
 * ```js
 * const map = client.byCodes(observations, "code");
 * // map = {
 * //     "55284-4": [ observation1, observation2 ],
 * //     "6082-2": [ observation3 ]
 * // }
 * ```
 * @param observations Array of observations
 * @param property The name of a CodeableConcept property to group by
 */
/*
export function byCode(
    observations: fhirclient.FHIR.Observation | fhirclient.FHIR.Observation[],
    property: string
): fhirclient.ObservationMap
{
    const ret: fhirclient.ObservationMap = {};

    function handleCodeableConcept(concept: fhirclient.FHIR.CodeableConcept, observation: fhirclient.FHIR.Observation) {
        if (concept && Array.isArray(concept.coding)) {
            concept.coding.forEach(({ code }) => {
                if (code) {
                    ret[code] = ret[code] || [] as fhirclient.FHIR.Observation[];
                    ret[code].push(observation);
                }
            });
        }
    }

    makeArray(observations).forEach(o => {
        if (o.resourceType === "Observation" && o[property]) {
            if (Array.isArray(o[property])) {
                o[property].forEach((concept: fhirclient.FHIR.CodeableConcept) => handleCodeableConcept(concept, o));
            } else {
                handleCodeableConcept(o[property], o);
            }
        }
    });

    return ret;
}
*/
/**
 * First groups the observations by code using `byCode`. Then returns a function
 * that accepts codes as arguments and will return a flat array of observations
 * having that codes. Example:
 * ```js
 * const filter = client.byCodes(observations, "category");
 * filter("laboratory") // => [ observation1, observation2 ]
 * filter("vital-signs") // => [ observation3 ]
 * filter("laboratory", "vital-signs") // => [ observation1, observation2, observation3 ]
 * ```
 * @param observations Array of observations
 * @param property The name of a CodeableConcept property to group by
 */
/*
export function byCodes(
    observations: fhirclient.FHIR.Observation | fhirclient.FHIR.Observation[],
    property: string
): (...codes: string[]) => any[]
{
    const bank = byCode(observations, property);
    return (...codes) => codes
        .filter(code => (code + "") in bank)
        .reduce(
            (prev, code) => prev.concat(bank[code + ""]),
            [] as fhirclient.FHIR.Observation[]
        );
}
*/
/**
 * Given a conformance statement and a resource type, returns the name of the
 * URL parameter that can be used to scope the resource type by patient ID.
 */
/*
export function getPatientParam(conformance: fhirclient.FHIR.CapabilityStatement, resourceType: string): string
{
    // Find what resources are supported by this server
    const resources = getPath(conformance, "rest.0.resource") || [];

    // Check if this resource is supported
    const meta = resources.find((r: any) => r.type === resourceType);
    if (!meta) {
        throw new Error(`Resource "${resourceType}" is not supported by this FHIR server`);
    }

    // Check if any search parameters are available for this resource
    if (!Array.isArray(meta.searchParam)) {
        throw new Error(`No search parameters supported for "${resourceType}" on this FHIR server`);
    }

    // This is a rare case but could happen in generic workflows
    if (resourceType == "Patient" && meta.searchParam.find((x: any) => x.name == "_id")) {
        return "_id";
    }

    // Now find the first possible parameter name
    const out = patientParams.find(p => meta.searchParam.find((x: any) => x.name == p));

    // If there is no match
    if (!out) {
        throw new Error("I don't know what param to use for " + resourceType);
    }

    return out;
}
*/
/**
 * Resolves a reference to target window. It may also open new window or tab if
 * the `target = "popup"` or `target = "_blank"`.
 * @param target
 * @param width Only used when `target = "popup"`
 * @param height Only used when `target = "popup"`
 */
/*
export async function getTargetWindow(target: fhirclient.WindowTarget, width: number = 800, height: number = 720): Promise<Window>
{
    // The target can be a function that returns the target. This can be
    // used to open a layer pop-up with an iframe and then return a reference
    // to that iframe (or its name)
    if (typeof target == "function") {
        target = await target();
    }

    // The target can be a window reference
    if (target && typeof target == "object") {
        return target;
    }

    // At this point target must be a string
    if (typeof target != "string") {
        _debug("Invalid target type '%s'. Failing back to '_self'.", typeof target);
        return self;
    }

    // Current window
    if (target == "_self") {
        return self;
    }

    // The parent frame
    if (target == "_parent") {
        return parent;
    }

    // The top window
    if (target == "_top") {
        return top;
    }

    // New tab or window
    if (target == "_blank") {
        let error, targetWindow: Window | null = null;
        try {
            targetWindow = window.open("", "SMARTAuthPopup");
            if (!targetWindow) {
                throw new Error("Perhaps window.open was blocked");
            }
        } catch (e) {
            error = e;
        }

        if (!targetWindow) {
            _debug("Cannot open window. Failing back to '_self'. %s", error);
            return self;
        } else {
            return targetWindow;
        }
    }

    // Popup window
    if (target == "popup") {
        let error, targetWindow: Window | null = null;
        // if (!targetWindow || targetWindow.closed) {
        try {
            targetWindow = window.open("", "SMARTAuthPopup", [
                "height=" + height,
                "width=" + width,
                "menubar=0",
                "resizable=1",
                "status=0",
                "top=" + (screen.height - height) / 2,
                "left=" + (screen.width - width) / 2
            ].join(","));
            if (!targetWindow) {
                throw new Error("Perhaps the popup window was blocked");
            }
        } catch (e) {
            error = e;
        }

        if (!targetWindow) {
            _debug("Cannot open window. Failing back to '_self'. %s", error);
            return self;
        } else {
            return targetWindow;
        }
    }

    // Frame or window by name
    const winOrFrame: Window = frames[target as any];
    if (winOrFrame) {
        return winOrFrame;
    }

    _debug("Unknown target '%s'. Failing back to '_self'.", target);
    return self;
}
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = void 0;
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
exports.assert = assert;
