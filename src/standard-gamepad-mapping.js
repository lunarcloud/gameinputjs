import { GamepadMapping } from './gamepad-mapping.js'
import { AxisAsButton } from './axis-as-button.js'

/**
 * Standard mapping
 * @type {GamepadMapping}
 */
const StardardGamepadMapping = new GamepadMapping(
    13, 14, 15, 16,
    10,
    1, 2, 3, 4,
    new AxisAsButton(-2),
    new AxisAsButton(2),
    new AxisAsButton(-1),
    new AxisAsButton(1),
    new AxisAsButton(-4),
    new AxisAsButton(4),
    new AxisAsButton(-3),
    new AxisAsButton(3),
    5, 6, 7, 8
)

export default StardardGamepadMapping
export { StardardGamepadMapping }
