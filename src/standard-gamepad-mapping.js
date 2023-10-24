import { FaceDirections, GamepadAnalogStickMapping, GamepadCenterMapping, GamepadDirectionsMapping, GamepadFaceMapping, GamepadLRMapping, GamepadMapping } from './gamepad-mapping.js'
import { AxisAsButton } from './axis-as-button.js'

export const StandardDPadMapping = new GamepadDirectionsMapping(12, 15, 13, 14)
export const StandardFaceMapping = new GamepadFaceMapping(3, 1, 0, 2)
export const StandardPlumberFaceMapping = new GamepadFaceMapping(3, 2, 1, 0, FaceDirections.rtl)
export const StandardCenterMapping = new GamepadCenterMapping(9, 8)
export const StandardShoulderMapping = new GamepadLRMapping(4, 5)
export const StandardTriggerMapping = new GamepadLRMapping(6, 7)
export const StandardLeftStickMapping = new GamepadAnalogStickMapping(
    new AxisAsButton('-', 1),
    new AxisAsButton('+', 0),
    new AxisAsButton('+', 1),
    new AxisAsButton('-', 0),
    10
)
export const StandardRightStickMapping = new GamepadAnalogStickMapping(
    new AxisAsButton('-', 3),
    new AxisAsButton('+', 2),
    new AxisAsButton('+', 3),
    new AxisAsButton('-', 2),
    11
)

/**
 * Standard mapping
 */
export const StandardGamepadMapping = new GamepadMapping(
    StandardDPadMapping,
    StandardFaceMapping,
    StandardCenterMapping,
    StandardShoulderMapping,
    StandardTriggerMapping,
    StandardLeftStickMapping,
    StandardRightStickMapping
)

/**
 * Standard Plumber (RTL) mapping
 */
export const StandardPlumberGamepadMapping = StandardGamepadMapping
    .variant({ face: StandardPlumberFaceMapping })

export const GravisDPadMapping = new GamepadDirectionsMapping(3, 2, 1, 0)

export const GravisGamepadProSchema = StandardGamepadMapping
    .variant({
        dpad: GravisDPadMapping,
        rightStick: undefined
    })

export const NonStandardRagdollMapping = StandardGamepadMapping.variant({
    dpad: new GamepadDirectionsMapping(
        new AxisAsButton('-', 7),
        new AxisAsButton('+', 6),
        new AxisAsButton('+', 7),
        new AxisAsButton('-', 6)
    ),
    face: new GamepadFaceMapping(2, 1, 0, 3),
    rightStick: new GamepadAnalogStickMapping(
        new AxisAsButton('-', 4),
        new AxisAsButton('+', 3),
        new AxisAsButton('+', 4),
        new AxisAsButton('-', 3)
    ),
    trigger: new GamepadLRMapping(
        new AxisAsButton('+', 2),
        new AxisAsButton('+', 5)
    )
})

export const NonStandardAfterglow360Mapping = NonStandardRagdollMapping.variant({
    center: new GamepadCenterMapping(7)
})
