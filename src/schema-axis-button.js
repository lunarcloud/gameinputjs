/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/schema-button.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */


/**
 * Schema Axis-As-Button
 */
export default class SchemaAxisButton {
    constructor (indexAndDirection, threshold, deadZone)
    {
        this.index = Math.abs(indexAndDirection);
        this.direction = indexAndDirection < 0 ? "negative" : "positive";
        if ( typeof(threshold) === "undefined" ) threshold = 0.5;
        this.threshold = (this.direction === "positive" ? 1 : -1 ) * Math.abs(threshold);
        if ( typeof(deadZone) === "undefined" ) deadZone = 0;
        this.deadZone = (this.direction === "positive" ? 1 : -1 ) * Math.abs(deadZone);
    }
}

export {SchemaAxisButton}

/**
 * @preserve
 * @license-end
 */
