/**
 * Schema Axis-As-Button
 */
class AxisAsButton {
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
     * @param {'+'|'-'} direction           positive or negative direction
     * @param {number} index                Axis index.
     * @param {number|undefined} threshold  threshold to activate as button
     * @param {number|undefined} deadZone   axis dead zone
     */
    constructor (direction, index, threshold = undefined, deadZone = undefined) {
        this.index = Math.abs(index)
        this.direction = direction === '-' ? 'negative' : 'positive'

        if (typeof (threshold) === 'undefined')
            threshold = 0.5
        this.threshold = (this.direction === 'positive' ? 1 : -1) * Math.abs(threshold)

        if (typeof (deadZone) === 'undefined')
            deadZone = 0
        this.deadZone = (this.direction === 'positive' ? 1 : -1) * Math.abs(deadZone)
    }
}

export { AxisAsButton }
