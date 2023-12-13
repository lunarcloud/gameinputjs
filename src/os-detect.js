/**
 * @module
 */

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

export default DetectedOS
export { DetectedOS }
