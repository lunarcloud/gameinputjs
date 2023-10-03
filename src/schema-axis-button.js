/**
 * Schema Axis-As-Button
 */
export default class SchemaAxisButton {
    /**
     * Axis index.
     * @type {number}
     */
    index

    /**
     * Axis Direction
     * @type {'negative'|'positive'}
     */
    direction

    /**
     * Axis threshold to activate as button.
     * @type {number}
     */
    threshold

    /**
     * Axis dead zone
     * @type {number}
     */
    deadZone

    /**
     * Constructor.
     * @param {number} indexAndDirection The button index, sign is direction
     * @param {number} threshold threshold to activate as button
     * @param {number} deadZone axis dead zone
     */
    constructor (indexAndDirection, threshold, deadZone) {
        this.index = Math.abs(indexAndDirection)
        this.direction = indexAndDirection < 0 ? 'negative' : 'positive'

        if (typeof (threshold) === 'undefined')
            threshold = 0.5
        this.threshold = (this.direction === 'positive' ? 1 : -1) * Math.abs(threshold)

        if (typeof (deadZone) === 'undefined')
            deadZone = 0
        this.deadZone = (this.direction === 'positive' ? 1 : -1) * Math.abs(deadZone)
    }
}

export { SchemaAxisButton }
