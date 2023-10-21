import { GameInputModel } from './gameinput-model.js'
import { GameInputSchema } from './gameinput-schema.js'
import { FaceDirections, GamepadCenterMapping, GamepadDirectionsMapping, GamepadFaceMapping, GamepadLRMapping, GamepadMapping } from './gamepad-mapping.js'
import { AxisAsButton } from './axis-as-button.js'
import { StardardGamepadMapping, GravisGamepadProSchema, StandardPlumberGamepadMapping, StandardLeftStickMapping, NonStandardRagdollMapping, NonStandardAfterglow360Mapping, StandardShoulderMapping, StandardRightStickMapping } from './standard-gamepad-mapping.js'

const frenchVRStickDeadzone = 0.6
const frenchVRStickThreshold = 0.8

const OddFaceMapping = new GamepadFaceMapping(2, 0, 1, 3)
const OldPlumberFaceMapping = OddFaceMapping.variant({ direction: FaceDirections.rtl})
const OddDPadMapping = new GamepadDirectionsMapping(14, 16, 15, 13)
const HuiJiaDreamcastMapping = StardardGamepadMapping.variant( {
    dpad: new GamepadDirectionsMapping(13, 14, 12, 15),
    rightStick: undefined,
    shoulder: undefined,
    trigger: StandardShoulderMapping
})

const GameInputModels = [
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        'Xbox 360 Controller (XInput STANDARD GAMEPAD)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Gravis GamePad Pro USB  (Vendor: 0428 Product: 4001)',
        'Linux',
        GravisGamepadProSchema),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '0428-4001-Gravis GamePad Pro USB ',
        'Linux',
        GravisGamepadProSchema),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'GamePad Pro USB  (Vendor: 0428 Product: 4001)',
        'macOS',
        GravisGamepadProSchema),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '428-4001-GamePad Pro USB ',
        'macOS',
        GravisGamepadProSchema),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 02e0)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Microsoft Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b12)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)'
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        '0925-8866-SFC/USB Pad',
        'Windows',
        StandardPlumberGamepadMapping.variant({
            dpad: StandardLeftStickMapping,
            center: new GamepadCenterMapping(7),
            face: OldPlumberFaceMapping,
            leftStick: undefined,
            rightStick: undefined,
            trigger: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        'SFC/USB Pad (Vendor: 0925 Product: 8866)',
        'Windows',
        StandardPlumberGamepadMapping.variant({
            dpad: StandardLeftStickMapping,
            center: new GamepadCenterMapping(7),
            face: OldPlumberFaceMapping,
            leftStick: undefined,
            rightStick: undefined,
            trigger: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        'Xbox 360 Wireless Receiver (Vendor: 0000 Product: 0000)',
        'Linux',
        StardardGamepadMapping.variant({
            dpad: OddDPadMapping,
            center: new GamepadCenterMapping(8),
            face: OddFaceMapping
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        '0000-0000-Xbox 360 Wireless Receiver',
        'Linux',
        StardardGamepadMapping.variant({ dpad: OddDPadMapping })
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds4',
        'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)'
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds4',
        '054c-05c4-Wireless Controller',
        'Windows',
        StardardGamepadMapping.variant({
            dpad: OddDPadMapping,
            face: new GamepadFaceMapping(3, 2, 1, 0),
            rightStick: new GamepadDirectionsMapping(
                new AxisAsButton('-', 5),
                new AxisAsButton('+', 2),
                new AxisAsButton('+', 5),
                new AxisAsButton('-', 2)
            )
        })
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds5',
        'DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)'
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds5',
        'Sony Interactive Entertainment DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)'
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds5',
        '054c-0ce6-DualSense Wireless Controller',
        'Linux',
        NonStandardRagdollMapping
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds5',
        '054c-0ce6-Sony Interactive Entertainment DualSense Wireless Controller',
        'Linux',
        NonStandardRagdollMapping),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        '©Microsoft Corporation Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        'Performance Designed Products Afterglow Gamepad for Xbox 360 (STANDARD GAMEPAD Vendor: 0e6f Product: 0213)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        'Performance Designed Products Afterglow Gamepad for Xbox 360 (Vendor: 0e6f Product: 0213)',
        'Linux',
        NonStandardAfterglow360Mapping
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        '0e6f-0213-Afterglow Gamepad for Xbox 360',
        'Linux',
        NonStandardAfterglow360Mapping
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'dc',
        'HuiJia  USB GamePad (Vendor: 0e8f Product: 3013)',
        undefined,
        HuiJiaDreamcastMapping
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'dc',
        'USB GamePad (Vendor: 0e8f Product: 3013)',
        undefined,
        HuiJiaDreamcastMapping
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'ds3',
        'Sony PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)'
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'ds3',
        '054c-0268-Sony PLAYSTATION(R)3 Controller',
        'Linux',
        StardardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(4, 5, 6, 7),
            face: new GamepadFaceMapping(12, 13, 14, 15),
            center: new GamepadCenterMapping(3),
            shoulder: new GamepadLRMapping(10, 11),
            trigger: new GamepadLRMapping(8, 9)
        })
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds4',
        'Sony Computer Entertainment Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)'
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds4',
        '054c-05c4-Sony Computer Entertainment Wireless Controller',
        'Linux',
        StardardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(
                new AxisAsButton('-', 7),
                new AxisAsButton('+', 6),
                new AxisAsButton('+', 7),
                new AxisAsButton('-', 6)
            ),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            rightStick: new GamepadDirectionsMapping(
                new AxisAsButton('-', 4),
                new AxisAsButton('+', 3),
                new AxisAsButton('+', 4),
                new AxisAsButton('-', 3)
            )
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'joystick',
        'Mayflash Arcade Stick (Vendor: 0e8f Product: 0003)',
        'Windows',
        StardardGamepadMapping.variant({
            dpad: StandardLeftStickMapping,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'joystick',
        'PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)', /* Mayflash Arcade Stick */
        'macOS',
        StardardGamepadMapping.variant({
            dpad: StandardLeftStickMapping,
            leftStick: undefined,
            rightStick: undefined,
            face: new GamepadFaceMapping(7, 0, 6, 1),
            shoulder: new GamepadLRMapping(4, 2),
            trigger: new GamepadLRMapping(3, 5)
        })
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'joystick',
        'MY-POWER CO.,LTD. Mayflash Arcade Stick (STANDARD GAMEPAD Vendor: 0e8f Product: 0003)',
        'Linux',
        StardardGamepadMapping.variant({
            dpad: StandardRightStickMapping,
            leftStick: undefined,
            rightStick: undefined,
            face: new GamepadFaceMapping(2, 1, 3, 0),
            shoulder: new GamepadLRMapping(6, 7),
            trigger: new GamepadLRMapping(4, 5)
        })
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'joystick',
        '0e8f-0003-MY-POWER CO.,LTD. Mayflash Arcade Stick',
        'Linux',
        StardardGamepadMapping.variant({
            dpad: StandardLeftStickMapping,
            leftStick: undefined,
            rightStick: undefined
        })
    )
]
/*
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Logitech Logitech Dual Action (Vendor: 046d Product: c216)', // DirectInput (XInput uses 'standard' mapping)
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-6),
            new AxisAsButton(6),
            new AxisAsButton(-5),
            new AxisAsButton(5),
            StardardGamepadMapping.menu,
            2, 3, 1, 4,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.rightStickUp,
            StardardGamepadMapping.rightStickDown,
            StardardGamepadMapping.rightStickLeft,
            StardardGamepadMapping.rightStickRight,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Logitech Gamepad F310 (Vendor: 046d Product: c21d)',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-8),
            new AxisAsButton(8),
            new AxisAsButton(-7),
            new AxisAsButton(7),
            8,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            new AxisAsButton(-5),
            new AxisAsButton(5),
            new AxisAsButton(-4),
            new AxisAsButton(4),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            new AxisAsButton(3),
            new AxisAsButton(6)
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '046d-c21d-Logitech Gamepad F310', // XInput
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-8),
            new AxisAsButton(8),
            new AxisAsButton(-7),
            new AxisAsButton(7),
            8,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            new AxisAsButton(-5),
            new AxisAsButton(5),
            new AxisAsButton(-4),
            new AxisAsButton(4),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            new AxisAsButton(3),
            new AxisAsButton(6)
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '046d-c216-Logitech Logitech Dual Action', // DirectInput (XInput uses 'standard' mapping)
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-6),
            new AxisAsButton(6),
            new AxisAsButton(-5),
            new AxisAsButton(5),
            StardardGamepadMapping.menu,
            2, 3, 1, 4,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.rightStickUp,
            StardardGamepadMapping.rightStickDown,
            StardardGamepadMapping.rightStickLeft,
            StardardGamepadMapping.rightStickRight,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'joystick',
        'Logitech Logitech Extreme 3D Pro (Vendor: 046d Product: c215)',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-6, 0.3),
            new AxisAsButton(6, 0.3),
            new AxisAsButton(-5, 0.3),
            new AxisAsButton(5, 0.3),
            12,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            new AxisAsButton(-2, 0.3),
            new AxisAsButton(2, 0.3),
            new AxisAsButton(-1, 0.3),
            new AxisAsButton(1, 0.3),
            undefined,
            undefined,
            new AxisAsButton(-3, 0.3),
            new AxisAsButton(3, 0.2),
            5, 6, 9, 11
        )),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'joystick',
        '046d-c215-Logitech Logitech Extreme 3D Pro',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-6, 0.3),
            new AxisAsButton(6, 0.3),
            new AxisAsButton(-5, 0.3),
            new AxisAsButton(5, 0.3),
            12,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            new AxisAsButton(-2, 0.3),
            new AxisAsButton(2, 0.3),
            new AxisAsButton(-1, 0.3),
            new AxisAsButton(1, 0.3),
            undefined,
            undefined,
            new AxisAsButton(-3, 0.3),
            new AxisAsButton(3, 0.2),
            5, 6, 9, 11
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Microsoft® Microsoft® SideWinder® Game Pad USB (Vendor: 045e Product: 0007)',
        'Linux',
        new GamepadMapping(
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.menu,
            1, 2, 4, 5,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            6, 3,
            7, 8
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '045e-0007-Microsoft® Microsoft® SideWinder® Game Pad USB',
        'Linux',
        new GamepadMapping(
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.menu,
            1, 2, 4, 5,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            6, 3,
            7, 8
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'ASUS Gamepad',
        'Android',
        new GamepadMapping(
            undefined, undefined, undefined, undefined,
            12,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.rightStickUp,
            StardardGamepadMapping.rightStickDown,
            StardardGamepadMapping.rightStickLeft,
            StardardGamepadMapping.rightStickRight,
            7, 8,
            5, 6
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'NYKO PLAYPAD PRO',
        'Android',
        new GamepadMapping(
            new AxisAsButton(-8),
            new AxisAsButton(8),
            new AxisAsButton(-7),
            new AxisAsButton(7),
            StardardGamepadMapping.menu,
            2, 3, 1, 4,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            new AxisAsButton(-6),
            new AxisAsButton(6),
            new AxisAsButton(-3),
            new AxisAsButton(3),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Moga 2 HID',
        'Android',
        new GamepadMapping(
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.menu,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            undefined, undefined, undefined, undefined,
            7, 8,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Moga 2 HID (Vendor: 20d6 Product: 89e5)',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-8),
            new AxisAsButton(8),
            new AxisAsButton(-7),
            new AxisAsButton(7),
            7,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.rightStickUp,
            StardardGamepadMapping.rightStickDown,
            StardardGamepadMapping.rightStickLeft,
            StardardGamepadMapping.rightStickRight,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            new AxisAsButton(6),
            new AxisAsButton(5)
        )),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        '(null) usb gamepad            (Vendor: 0810 Product: e501)',
        'Linux',
        new GamepadMapping(
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.menu,
            2, 3, 1, 4,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        '0810-e501-usb gamepad           ',
        'Linux',
        new GamepadMapping(
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.menu,
            2, 3, 1, 4,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        'usb gamepad            (Vendor: 0810 Product: e501)',
        'macOS',
        new GamepadMapping(
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.menu,
            2, 3, 1, 4,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        '810-e501-usb gamepad           ',
        'macOS',
        new GamepadMapping(
            new AxisAsButton(-3),
            new AxisAsButton(3),
            new AxisAsButton(-2),
            new AxisAsButton(2),
            StardardGamepadMapping.menu,
            2, 3, 1, 4,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        '045e-0b12-Microsoft Xbox Series S|X Controller',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-8),
            new AxisAsButton(8),
            new AxisAsButton(-7),
            new AxisAsButton(7),
            8,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            new AxisAsButton(-5),
            new AxisAsButton(5),
            new AxisAsButton(-4),
            new AxisAsButton(4),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            new AxisAsButton(3),
            new AxisAsButton(6)
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        '045e-02e0-Xbox Wireless Controller',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-8),
            new AxisAsButton(8),
            new AxisAsButton(-7),
            new AxisAsButton(7),
            8,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            new AxisAsButton(-5),
            new AxisAsButton(5),
            new AxisAsButton(-4),
            new AxisAsButton(4),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            new AxisAsButton(3),
            new AxisAsButton(6)
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Performance Designed Products Afterglow Wired Controller for Xbox One (STANDARD GAMEPAD Vendor: 0e6f Product: 0139)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Performance Designed Products Afterglow Wired Controller for Xbox One (Vendor: 0e6f Product: 0139)',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-8),
            new AxisAsButton(8),
            new AxisAsButton(-7),
            new AxisAsButton(7),
            8,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            new AxisAsButton(-5),
            new AxisAsButton(5),
            new AxisAsButton(-4),
            new AxisAsButton(4),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            new AxisAsButton(3),
            new AxisAsButton(6)
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        '0e6f-0139-Afterglow Prismatic Wired Controller',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-8),
            new AxisAsButton(8),
            new AxisAsButton(-7),
            new AxisAsButton(7),
            8,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            new AxisAsButton(-5),
            new AxisAsButton(5),
            new AxisAsButton(-4),
            new AxisAsButton(4),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            new AxisAsButton(3),
            new AxisAsButton(6)
        )),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        'USB,2-axis 8-button gamepad   (STANDARD GAMEPAD Vendor: 0583 Product: 2060)',
        'macOS',
        new GamepadMapping(
            StardardGamepadMapping.dpadUp,
            StardardGamepadMapping.dpadDown,
            StardardGamepadMapping.dpadLeft,
            StardardGamepadMapping.dpadRight,
            StardardGamepadMapping.menu,
            2, 1, 4, 3,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        '0583-2060-USB,2-axis 8-button gamepad   ',
        'macOS',
        new GamepadMapping(
            StardardGamepadMapping.dpadUp,
            StardardGamepadMapping.dpadDown,
            StardardGamepadMapping.dpadLeft,
            StardardGamepadMapping.dpadRight,
            StardardGamepadMapping.menu,
            2, 1, 4, 3,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.Plumber, // it's a square and x /y are generic style, while a / b are nintendo style - FAMICOM
        'nintendo-generic',
        'BUFFALO BGC-FC801 USB Gamepad (Vendor: 0411 Product: 00c6)',
        'macOS',
        new GamepadMapping(
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            8,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.Plumber, // it's a square and x /y are generic style, while a / b are nintendo style - FAMICOM
        'nintendo-generic',
        '0411-00c6-BUFFALO BGC-FC801 USB Gamepad ',
        'macOS',
        new GamepadMapping(
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            8,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.PlumberRotatedRight,
        'joycon-r',
        '057e-2007-Nintendo Switch Right Joy-Con',
        'Linux',
        new GamepadMapping(
            undefined, undefined, undefined, undefined,
            9,
            2, 3, 1, 4,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            undefined, undefined, undefined, undefined,
            5, 7,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.PlumberRotatedRight,
        'joycon-r',
        'Nintendo Switch Right Joy-Con (Vendor: 057e Product: 2007)',
        'Linux',
        new GamepadMapping(
            undefined, undefined, undefined, undefined,
            9,
            2, 3, 1, 4,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            undefined, undefined, undefined, undefined,
            5, 7,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.PlumberRotatedRight,
        'joycon-r',
        'Wireless Gamepad (STANDARD GAMEPAD Vendor: 057e Product: 2007)',
        'Windows',
        new GamepadMapping(
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.menu,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.PlumberRotatedLeft,
        'joycon-l',
        '057e-2006-Nintendo Switch Left Joy-Con',
        'Linux',
        new GamepadMapping(
            undefined, undefined, undefined, undefined,
            6,
            10, 9, 8, 11,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            undefined, undefined, undefined, undefined,
            3, 5,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.PlumberRotatedLeft,
        'joycon-l',
        'Wireless Gamepad (STANDARD GAMEPAD Vendor: 057e Product: 2006)',
        'Windows',
        new GamepadMapping(
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.menu,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            undefined, undefined
        )),
    new GameInputModel(
        GameInputSchema.Plumber,
        'joycons',
        'Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)'),
    new GameInputModel(
        GameInputSchema.Plumber,
        'joycons',
        'Nintendo Switch Combined Joy-Cons (Vendor: 057e Product: 2008)',
        'Linux',
        new GamepadMapping(
            16, 18, 17, 15,
            11,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.rightStickUp,
            StardardGamepadMapping.rightStickDown,
            StardardGamepadMapping.rightStickLeft,
            StardardGamepadMapping.rightStickRight,
            6, 7, 8, 9
        )),
    new GameInputModel(
        GameInputSchema.Plumber,
        'joycons',
        '057e-2008-Nintendo Switch Combined Joy-Cons',
        'Linux',
        new GamepadMapping(
            16, 18, 17, 15,
            11,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            StardardGamepadMapping.button3,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.rightStickUp,
            StardardGamepadMapping.rightStickDown,
            StardardGamepadMapping.rightStickLeft,
            StardardGamepadMapping.rightStickRight,
            6, 7, 8, 9
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog, // should be numbers, see issue #16
        'generic',
        'USB  Joystick (Vendor: 1345 Product: 1030)',
        'macOS',
        new GamepadMapping(
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.menu,
            3, 2, 4, 1,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog, // should be numbers, see issue #16
        'generic',
        '1345-1030-USB  Joystick ',
        'macOS',
        new GamepadMapping(
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.menu,
            3, 2, 4, 1,
            undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'joystick',
        'Innovative Produtcs VR Pro 2000 USB Joystick (Vendor: 04b4 Product: 2774)',
        'Linux',
        new GamepadMapping(
            StardardGamepadMapping.dpadUp,
            StardardGamepadMapping.dpadDown,
            StardardGamepadMapping.dpadLeft,
            StardardGamepadMapping.dpadRight,
            4,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            / * button3 * / new AxisAsButton(-3, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(2, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(-2, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(1, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(-1, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(-6, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(6, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(-5, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(5, frenchVRStickThreshold, frenchVRStickDeadzone),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'joystick',
        '04b4-2774-Innovative Produtcs VR Pro 2000 USB Joystick',
        'Linux',
        new GamepadMapping(
            StardardGamepadMapping.dpadUp,
            StardardGamepadMapping.dpadDown,
            StardardGamepadMapping.dpadLeft,
            StardardGamepadMapping.dpadRight,
            4,
            StardardGamepadMapping.button0,
            StardardGamepadMapping.button1,
            StardardGamepadMapping.button2,
            / * button3 * / new AxisAsButton(-3, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(2, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(-2, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(1, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(-1, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(-6, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(6, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(-5, frenchVRStickThreshold, frenchVRStickDeadzone),
            new AxisAsButton(5, frenchVRStickThreshold, frenchVRStickDeadzone),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        '20d6-a711-Bensussen Deutsch & Associates,Inc.(BDA) Core (Plus) Wired Controller',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-6),
            new AxisAsButton(6),
            new AxisAsButton(-5),
            new AxisAsButton(5),
            StardardGamepadMapping.menu,
            3, 2, 4, 1,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.rightStickUp,
            StardardGamepadMapping.rightStickDown,
            StardardGamepadMapping.rightStickLeft,
            StardardGamepadMapping.rightStickRight,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        'Bensussen Deutsch & Associates,Inc.(BDA) Core (Plus) Wired Controller (Vendor: 20d6 Product: a711)',
        'Linux',
        new GamepadMapping(
            new AxisAsButton(-6),
            new AxisAsButton(6),
            new AxisAsButton(-5),
            new AxisAsButton(5),
            StardardGamepadMapping.menu,
            3, 2, 4, 1,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            StardardGamepadMapping.rightStickUp,
            StardardGamepadMapping.rightStickDown,
            StardardGamepadMapping.rightStickLeft,
            StardardGamepadMapping.rightStickRight,
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'nintendo-generic',
        'Core (Plus) Wired Controller (Vendor: 20d6 Product: a711)',
        'Windows',
        new GamepadMapping(
            undefined, undefined, undefined, undefined,
            StardardGamepadMapping.menu,
            3, 2, 4, 1,
            StardardGamepadMapping.leftStickUp,
            StardardGamepadMapping.leftStickDown,
            StardardGamepadMapping.leftStickLeft,
            StardardGamepadMapping.leftStickRight,
            new AxisAsButton(-6),
            new AxisAsButton(6),
            new AxisAsButton(-3),
            new AxisAsButton(3),
            StardardGamepadMapping.leftShoulder,
            StardardGamepadMapping.rightShoulder,
            StardardGamepadMapping.leftTrigger,
            StardardGamepadMapping.rightTrigger
        )
    )
]
*/

export default GameInputModels
export { GameInputModels }
