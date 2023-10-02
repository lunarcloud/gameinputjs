/**
 * @typedef {'Android'|'iOS'|'Windows'|'macOS'|'Linux'|'Other'} OSName
 */

const osStrings = [
    { s: 'Android', r: /Android/ },
    { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
    { s: 'Windows', r: /Windows/ },
    { s: 'macOS', r: /Mac/ },
    { s: 'Linux', r: /(Linux|X11)/ }
]

/**
 * Current OS.
 * @type {import('./gameinput-model.js').OSName}
 */
let _detectedOS = 'Other'
for (const id in osStrings) {
    if (osStrings[id].r.test(navigator.userAgent)) {
        _detectedOS = osStrings[id].s 
        break 
    }
}
const DetectedOS = _detectedOS

/**
 * Detected Browser.
 * @type {'Chrome'|'Firefox'|'Other'} 
 */
const DetectedBrowser = /Chrome/.test(navigator.userAgent) 
                    ? 'Chrome' 
                    : /Firefox/.test(navigator.userAgent) 
                        ? 'Firefox'
                        : 'Other'

export { DetectedOS, DetectedBrowser }
