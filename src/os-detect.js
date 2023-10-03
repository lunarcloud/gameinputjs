/**
 * @typedef {'Android'|'iOS'|'Windows'|'macOS'|'Linux'|'Other'} OSName
 */

/**
 * Current OS.
 * @type {Array<{s: OSName, r: RegExp}>}
 * @ignore
 */
const osStrings = [
    { s: 'Windows', r: /Windows/ },
    { s: 'macOS', r: /Mac/ },
    { s: 'Linux', r: /(Linux|X11)/ },
    { s: 'Android', r: /Android/ },
    { s: 'iOS', r: /(iPhone|iPad|iPod)/ }
]

let _detectedOS
for (const id in osStrings)
    if (osStrings[id].r.test(navigator.userAgent))
        _detectedOS = osStrings[id].s

/**
 * Current OS.
 * @type {OSName}
 */
const DetectedOS = _detectedOS || 'Other'

/**
 * Detected Browser.
 * @type {'Chrome'|'Firefox'|'Other'}
 */
const DetectedBrowser = /Chrome/.test(navigator.userAgent)
                    ? 'Chrome'
                    : /Firefox/.test(navigator.userAgent)
                        ? 'Firefox'
                        : 'Other'

/* Provide this globally */
globalThis.Detected = {
    OS: DetectedOS,
    Browser: DetectedBrowser
}

export { DetectedOS, DetectedBrowser }
