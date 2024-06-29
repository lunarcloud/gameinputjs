import { AxisAsButton } from "./axis-as-button.js"
import { GamepadAnalogStickMapping } from "./gamepad-mapping.js"

/**
 * Schema 2-Axes-Combined-As-1-Axis as Button
 */
class CombinedAxesAsStick extends GamepadAnalogStickMapping {
    /**
     * Axis index.
     * @type {number}
     */
    index


    /**
     * Constructor.
     * @param {number}  index           Axis index.
     * @param {import("./gamepad-mapping.js").SchemaButtonDef} click    Button/Axis for "stick click"
     */
    constructor (index, click) {
        super(
            new CombinedAxisToButton(index, 'up'),
            new CombinedAxisToButton(index, 'right'),
            new CombinedAxisToButton(index, 'down'),
            new CombinedAxisToButton(index, 'left'),
            click)
    }
}

class CombinedAxisToButton extends AxisAsButton {

    /**
     * Axis direction
     * @type {'up'|'right'|'down'|'left'}
     */
    cardinal

    /**
     * Constructor.
     * @param {number} index                            Axis index.
     * @param {'up'|'right'|'down'|'left'} cardinal     Direction.
     */
    constructor(index, cardinal) {
        super(undefined, index)

        this.cardinal = cardinal
    }

    /**
     * Test whether the axis value matches this "button"'s direction
     * @param {number} value Axis value.
     * @returns {boolean}
     */
    test(value) {
        switch (this.cardinal) {
            case "up":
                return [-5/7, -1, 1].includes(value)
            case "right":
                return -5/7 >= value && value >= -1/7
            case "down":
                return -1/7 >= value && value >= 3/7
            case "left":
                return 3/7 >= value && value >= 7/7
            default:
                return false;
        }
    }
}

export { CombinedAxesAsStick, CombinedAxisToButton as AxisAsExactValues }
