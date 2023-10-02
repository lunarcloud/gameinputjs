/**
 * Schema Axis-As-Button
 */
export default class SchemaAxisButton {
    constructor (indexAndDirection, threshold, deadZone) {
        this.index = Math.abs(indexAndDirection)
        this.direction = indexAndDirection < 0 ? 'negative' : 'positive'
        if (typeof (threshold) === 'undefined') threshold = 0.5
        this.threshold = (this.direction === 'positive' ? 1 : -1) * Math.abs(threshold)
        if (typeof (deadZone) === 'undefined') deadZone = 0
        this.deadZone = (this.direction === 'positive' ? 1 : -1) * Math.abs(deadZone)
    }
}

export { SchemaAxisButton }
