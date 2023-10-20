import { GamepadMapping } from './gamepad-mapping.js'
import { AxisAsButton } from './axis-as-button.js'

/**
 * Standard mapping
 * @type {GamepadMapping}
 */
const StardardGamepadMapping = new GamepadMapping(
    /* dPad */ 13, 14, 15, 16,
    /* menu */ 10,
    /* face */ 1, 2, 3, 4,
    /* leftStick */
    new AxisAsButton(-2),
    new AxisAsButton(2),
    new AxisAsButton(-1),
    new AxisAsButton(1),
    /* rightStick */
    new AxisAsButton(-4),
    new AxisAsButton(4),
    new AxisAsButton(-3),
    new AxisAsButton(3),
    /* shoulders */ 5, 6,
    /* triggers */ 7, 8
)

const GravisGamepadProSchema = new GamepadMapping(
    StardardGamepadMapping.leftStickUp,
    StardardGamepadMapping.leftStickDown,
    StardardGamepadMapping.leftStickLeft,
    StardardGamepadMapping.leftStickRight,
    StardardGamepadMapping.menu,
    /* face */ 2, 3, 1, 4,
    /* leftStick */ undefined, undefined, undefined, undefined,
    StardardGamepadMapping.rightStickUp,
    StardardGamepadMapping.rightStickDown,
    StardardGamepadMapping.rightStickLeft,
    StardardGamepadMapping.rightStickRight,
    StardardGamepadMapping.leftShoulder,
    StardardGamepadMapping.rightShoulder,
    StardardGamepadMapping.leftTrigger,
    StardardGamepadMapping.rightTrigger
)

export default StardardGamepadMapping
export { StardardGamepadMapping, GravisGamepadProSchema }
