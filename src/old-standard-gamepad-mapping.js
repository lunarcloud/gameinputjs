import { OldAxisAsButton } from './axis-as-button.js'
import { OldGamepadMapping } from './old-gamepad-mapping.js'

export const OldStandardDPadMapping = [13, 14, 15, 16]
export const OldStandardFaceMapping = [1, 2, 3, 4]
export const OldStandardGravisFaceMapping = [1, 2, 3, 4]
export const OldStandardPlumberFaceMapping = [3, 2, 4, 1]
export const OldStandardCenterMapping = 10
export const OldStandardShoulderMapping = [5, 6]
export const OldStandardTriggerMapping = [7, 8]
export const OldStandardLeftStickMapping = [
    new OldAxisAsButton(-2),
    new OldAxisAsButton(2),
    new OldAxisAsButton(-1),
    new OldAxisAsButton(1)
]
export const OldStandardRightStickMapping = [
    new OldAxisAsButton(-4),
    new OldAxisAsButton(4),
    new OldAxisAsButton(-3),
    new OldAxisAsButton(3)
]

/**
 * Standard mapping
 * @type {OldGamepadMapping}
 */
const OldStandardGamepadMapping = new OldGamepadMapping(
    /* dPad */ 13, 14, 15, 16,
    /* menu */ 10,
    /* face */ 1, 2, 3, 4,
    /* leftStick */
    new OldAxisAsButton(-2),
    new OldAxisAsButton(2),
    new OldAxisAsButton(-1),
    new OldAxisAsButton(1),
    /* rightStick */
    new OldAxisAsButton(-4),
    new OldAxisAsButton(4),
    new OldAxisAsButton(-3),
    new OldAxisAsButton(3),
    /* shoulders */ 5, 6,
    /* triggers */ 7, 8
)

const OldGravisGamepadProSchema = new OldGamepadMapping(
    OldStandardGamepadMapping.leftStickUp,
    OldStandardGamepadMapping.leftStickDown,
    OldStandardGamepadMapping.leftStickLeft,
    OldStandardGamepadMapping.leftStickRight,
    OldStandardGamepadMapping.menu,
    /* face */ 2, 3, 1, 4,
    /* leftStick */ undefined, undefined, undefined, undefined,
    OldStandardGamepadMapping.rightStickUp,
    OldStandardGamepadMapping.rightStickDown,
    OldStandardGamepadMapping.rightStickLeft,
    OldStandardGamepadMapping.rightStickRight,
    OldStandardGamepadMapping.leftShoulder,
    OldStandardGamepadMapping.rightShoulder,
    OldStandardGamepadMapping.leftTrigger,
    OldStandardGamepadMapping.rightTrigger
)

export default OldStandardGamepadMapping
export { OldStandardGamepadMapping, OldGravisGamepadProSchema }
