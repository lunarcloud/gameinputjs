import { GameInputModel } from './gameinput-model.js'
import { GameInputSchema } from './gameinput-schema.js'
import { FaceDirections, GamepadAnalogStickMapping, GamepadCenterMapping, GamepadDirectionsMapping, GamepadFaceMapping, GamepadLRMapping } from './gamepad-mapping.js'
import { AxisAsButton } from './axis-as-button.js'
import { StandardCenterMapping, StandardGamepadMapping, StandardLeftStickMapping, StandardPlumberFaceMapping, StandardPlumberGamepadMapping } from './standard-gamepad-mapping.js'

const MagicSProN64AdapterMapping = StandardPlumberGamepadMapping.variant({
    dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 5), new AxisAsButton('+', 4), new AxisAsButton('+', 5), new AxisAsButton('-', 4)),
    face: new GamepadFaceMapping(undefined, undefined, 1, 2),
    rightStick: new GamepadAnalogStickMapping(
        new AxisAsButton('+', 3),
        new AxisAsButton('+', 2),
        new AxisAsButton('-', 3),
        new AxisAsButton('-', 2)
    )
})

const GameInputModels = [
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'dc',
        '0e8f-3013-HuiJia  USB GamePad',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(12, 13, 14, 15),
            center: new GamepadCenterMapping(9),
            shoulder: undefined,
            trigger: new GamepadLRMapping(new AxisAsButton('+', 2), new AxisAsButton('+', 3)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0)),
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'sega-generic',
        '0e8f-3010-HuiJia  USB GamePad',
        'Linux',
        StandardGamepadMapping.variant({
            face: new GamepadFaceMapping(4, 1, 0, 3),
            center: new GamepadCenterMapping(9),
            shoulder: new GamepadLRMapping(6, 2),
            trigger: new GamepadLRMapping(5, 7),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0)),
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'dc',
        'USB GamePad (Vendor: 0e8f Product: 3013)',
        'macOS',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(12, 13, 14, 15),
            center: StandardCenterMapping,
            shoulder: undefined,
            trigger: new GamepadLRMapping(4, 5),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'dc',
        'USB GamePad (Vendor: 0e8f Product: 3013)',
        'Windows',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(12, 13, 14, 15),
            center: StandardCenterMapping,
            shoulder: undefined,
            trigger: new GamepadLRMapping(4, 5),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: undefined
        })
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
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(13, 16, 14, 15),
            face: new GamepadFaceMapping(2, 1, 0, 3),
            center: StandardCenterMapping,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 11),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 12)
        })
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds4',
        '054c-05c4-Sony Computer Entertainment Wireless Controller',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6)),
            face: new GamepadFaceMapping(2, 1, 0, 3),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 11),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 12)
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
        '054c-05c4-Wireless Controller',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6)),
            face: new GamepadFaceMapping(2, 1, 0, 3),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 11),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 12)
        })
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds4',
        '054c-05c4-Wireless Controller',
        'Windows',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(14, 17, 15, 16),
            face: new GamepadFaceMapping(2, 1, 0, 3),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 11),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 12)
        })
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds4',
        'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)'
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds5',
        '054c-0ce6-DualSense Wireless Controller',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 8), new AxisAsButton('+', 7), new AxisAsButton('+', 8), new AxisAsButton('-', 7)),
            face: new GamepadFaceMapping(2, 1, 0, 3),
            center: StandardCenterMapping,
            trigger: new GamepadLRMapping(new AxisAsButton('+', 3), new AxisAsButton('+', 6)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1))
        })
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds5',
        '054c-0ce6-DualSense Wireless Controller',
        'Windows',
        StandardGamepadMapping.variant({
            dpad: undefined,
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            trigger: new GamepadLRMapping(new AxisAsButton('+', 3), new AxisAsButton('+', 4)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 10),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 5), new AxisAsButton('+', 2), new AxisAsButton('+', 5), new AxisAsButton('-', 2), 11)
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
        '054c-0ce6-Sony Interactive Entertainment DualSense Wireless Controller',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 8), new AxisAsButton('+', 7), new AxisAsButton('+', 8), new AxisAsButton('-', 7)),
            face: new GamepadFaceMapping(2, 1, 0, 3),
            center: StandardCenterMapping,
            trigger: new GamepadLRMapping(new AxisAsButton('+', 3), new AxisAsButton('+', 6)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1))
        })
    ),
    new GameInputModel(
        GameInputSchema.Ragdoll,
        'ds5',
        'Sony Interactive Entertainment DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '428-4001-GamePad Pro USB ',
        'macOS',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            leftStick: undefined,
            rightStick: new GamepadAnalogStickMapping(undefined, undefined, undefined, undefined)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'ASUS Gamepad',
        'Android',
        StandardGamepadMapping.variant({
            dpad: undefined,
            center: new GamepadCenterMapping(11),
            shoulder: new GamepadLRMapping(6, 7),
            trigger: new GamepadLRMapping(4, 5),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1))
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'GamePad Pro USB  (Vendor: 0428 Product: 4001)',
        'macOS',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            leftStick: undefined,
            rightStick: new GamepadAnalogStickMapping(undefined, undefined, undefined, undefined)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '0428-4001-Gravis GamePad Pro USB ',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            leftStick: undefined,
            rightStick: new GamepadAnalogStickMapping(undefined, undefined, undefined, undefined)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Gravis GamePad Pro USB  (Vendor: 0428 Product: 4001)',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            leftStick: undefined,
            rightStick: new GamepadAnalogStickMapping(undefined, undefined, undefined, undefined)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Logitech Dual Action',
        undefined,
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(11, 14, 12, 13),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            shoulder: undefined,
            trigger: undefined,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1))
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Logitech Gamepad F310 (STANDARD GAMEPAD Vendor: 046d Product: c21d)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Logitech Logitech Dual Action (STANDARD GAMEPAD Vendor: 046d Product: c216)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Logitech Dual Action (STANDARD GAMEPAD Vendor: 046d Product: c216)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '046d-c216-Logitech Dual Action'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '046d-c216-Logitech Logitech Dual Action',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 5), new AxisAsButton('+', 4), new AxisAsButton('+', 5), new AxisAsButton('-', 4)),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 10),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 3), new AxisAsButton('+', 2), new AxisAsButton('+', 3), new AxisAsButton('-', 2), 11)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '046d-c21d-Logitech Gamepad F310',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0)),
            center: new GamepadCenterMapping(7, 6),
            trigger: new GamepadLRMapping(new AxisAsButton('+', 2), new AxisAsButton('+', 5)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6), 9),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 10)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Logitech Rumblepad 2',
        undefined,
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(11, 14, 12, 13),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            shoulder: undefined,
            trigger: undefined,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1))
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '045e-0007-Microsoft® Microsoft® SideWinder® Game Pad USB',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(4, 1, 0, 3),
            center: StandardCenterMapping,
            shoulder: new GamepadLRMapping(5, 2),
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Microsoft® Microsoft® SideWinder® Game Pad USB (Vendor: 045e Product: 0007)',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(4, 1, 0, 3),
            center: StandardCenterMapping,
            shoulder: new GamepadLRMapping(5, 2),
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Moga 2 HID',
        'Android',
        StandardGamepadMapping.variant({
            dpad: undefined,
            center: StandardCenterMapping,
            shoulder: new GamepadLRMapping(6, 7),
            trigger: undefined,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'Moga 2 HID (Vendor: 20d6 Product: 89e5)',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 8), new AxisAsButton('+', 7), new AxisAsButton('+', 8), new AxisAsButton('-', 7)),
            center: new GamepadCenterMapping(6),
            trigger: new GamepadLRMapping(new AxisAsButton('+', 6), new AxisAsButton('+', 5)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1))
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'NYKO PLAYPAD PRO',
        'Android',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 8), new AxisAsButton('+', 7), new AxisAsButton('+', 8), new AxisAsButton('-', 7)),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1))
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        '1345-1030-USB  Joystick ',
        'macOS',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(0, 1, 2, 3),
            center: StandardCenterMapping,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'generic',
        'USB  Joystick (Vendor: 1345 Product: 1030)',
        'macOS',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(0, 1, 2, 3),
            center: StandardCenterMapping,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.PlumberRotatedLeft,
        'joycon-l',
        '057e-2006-Nintendo Switch Left Joy-Con',
        'Linux',
        StandardPlumberGamepadMapping.variant({
            dpad: undefined,
            face: new GamepadFaceMapping(10, 8, 9, 7),
            center: new GamepadCenterMapping(5),
            shoulder: new GamepadLRMapping(2, 4),
            trigger: undefined,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), new AxisAsButton('-', 1), 6),
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.PlumberRotatedLeft,
        'joycon-l',
        'Wireless Gamepad (STANDARD GAMEPAD Vendor: 057e Product: 2006)',
        'Windows',
        StandardPlumberGamepadMapping.variant({
            dpad: undefined,
            face: new GamepadFaceMapping(3, 1, 0, 2, FaceDirections.rtl),
            center: StandardCenterMapping,
            trigger: undefined,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 10),
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.PlumberRotatedRight,
        'joycon-r',
        '057e-2007-Nintendo Switch Right Joy-Con',
        'Linux',
        StandardPlumberGamepadMapping.variant({
            dpad: undefined,
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: new GamepadCenterMapping(8),
            shoulder: new GamepadLRMapping(4, 6),
            trigger: undefined,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 0), new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), 10),
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.PlumberRotatedRight,
        'joycon-r',
        'Nintendo Switch Right Joy-Con (Vendor: 057e Product: 2007)',
        'Linux',
        StandardPlumberGamepadMapping.variant({
            dpad: undefined,
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: new GamepadCenterMapping(8),
            shoulder: new GamepadLRMapping(4, 6),
            trigger: undefined,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1), 10),
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.PlumberRotatedRight,
        'joycon-r',
        'Wireless Gamepad (STANDARD GAMEPAD Vendor: 057e Product: 2007)',
        'Windows',
        StandardPlumberGamepadMapping.variant({
            dpad: undefined,
            face: new GamepadFaceMapping(3, 1, 0, 2, FaceDirections.rtl),
            center: StandardCenterMapping,
            trigger: undefined,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 10),
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'joycons',
        'Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)'
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'joycons',
        '057e-2008-Nintendo Switch Combined Joy-Cons',
        'Linux',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(14, 17, 15, 16),
            face: new GamepadFaceMapping(1, 3, 0, 2, FaceDirections.rtl),
            center: new GamepadCenterMapping(10, 9),
            shoulder: new GamepadLRMapping(5, 6),
            trigger: new GamepadLRMapping(7, 8),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 12),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 3), new AxisAsButton('+', 2), new AxisAsButton('+', 3), new AxisAsButton('-', 2), 13)
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'joycons',
        'Nintendo Switch Combined Joy-Cons (Vendor: 057e Product: 2008)',
        'Linux',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(14, 17, 15, 16),
            face: new GamepadFaceMapping(2, 1, 0, 3, FaceDirections.rtl),
            center: new GamepadCenterMapping(10, 9),
            shoulder: new GamepadLRMapping(5, 6),
            trigger: new GamepadLRMapping(7, 8),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 12),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 3), new AxisAsButton('+', 2), new AxisAsButton('+', 3), new AxisAsButton('-', 2), 13)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'joystick',
        '04b4-2774-Innovative Produtcs VR Pro 2000 USB Joystick',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(12, 15, 13, 14),
            face: new GamepadFaceMapping(new AxisAsButton('-', 3, -0.8, -0.6), 1, 0, 2),
            center: new GamepadCenterMapping(3),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('+', 2, 0.8, 0.6), new AxisAsButton('-', 1, -0.8, -0.6), new AxisAsButton('-', 2, -0.8, -0.6), new AxisAsButton('+', 1, 0.8, 0.6)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('+', 2, 0.8, 0.6), new AxisAsButton('-', 1, -0.8, -0.6), new AxisAsButton('-', 2, -0.8, -0.6), new AxisAsButton('+', 1, 0.8, 0.6))
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'joystick',
        'Innovative Produtcs VR Pro 2000 USB Joystick (Vendor: 04b4 Product: 2774)',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(12, 15, 13, 14),
            face: new GamepadFaceMapping(new AxisAsButton('-', 3, -0.8, -0.6), 1, 0, 2),
            center: new GamepadCenterMapping(3),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('+', 2, 0.8, 0.6), new AxisAsButton('-', 1, -0.8, -0.6), new AxisAsButton('-', 2, -0.8, -0.6), new AxisAsButton('+', 1, 0.8, 0.6)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('+', 2, 0.8, 0.6), new AxisAsButton('-', 1, -0.8, -0.6), new AxisAsButton('-', 2, -0.8, -0.6), new AxisAsButton('+', 1, 0.8, 0.6))
        })
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'joystick',
        '046d-c215-Logitech Logitech Extreme 3D Pro',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 6, -0.3), new AxisAsButton('+', 5, 0.3), new AxisAsButton('+', 6, 0.3), new AxisAsButton('-', 5, -0.3)),
            center: new GamepadCenterMapping(11),
            trigger: new GamepadLRMapping(8, 10),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2, -0.3), new AxisAsButton('+', 1, 0.3), new AxisAsButton('+', 2, 0.3), new AxisAsButton('-', 1, -0.3)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2, -0.3), new AxisAsButton('+', 1, 0.3), new AxisAsButton('+', 2, 0.3), new AxisAsButton('-', 1, -0.3))
        })
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'joystick',
        'Logitech Logitech Extreme 3D Pro (Vendor: 046d Product: c215)',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 6, -0.3), new AxisAsButton('+', 5, 0.3), new AxisAsButton('+', 6, 0.3), new AxisAsButton('-', 5, -0.3)),
            center: new GamepadCenterMapping(11),
            trigger: new GamepadLRMapping(8, 10),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2, -0.3), new AxisAsButton('+', 1, 0.3), new AxisAsButton('+', 2, 0.3), new AxisAsButton('-', 1, -0.3)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2, -0.3), new AxisAsButton('+', 1, 0.3), new AxisAsButton('+', 2, 0.3), new AxisAsButton('-', 1, -0.3))
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'joystick',
        'Mayflash Arcade Stick (Vendor: 0e8f Product: 0003)',
        'Windows',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            center: StandardCenterMapping,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'sega-generic',
        'SWITCH CO.,LTD. USB Gamepad  (Vendor: 0079 Product: 0011)',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: StandardLeftStickMapping,
            face: new GamepadFaceMapping(3, 2, 1, 0),
            shoulder: new GamepadLRMapping(6, 7),
            trigger: new GamepadLRMapping(5, 4),
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'joystick',
        '0e8f-0003-MY-POWER CO.,LTD. Mayflash Arcade Stick',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 3), new AxisAsButton('+', 2), new AxisAsButton('+', 3), new AxisAsButton('-', 2)),
            face: new GamepadFaceMapping(3, 1, 0, 2),
            shoulder: new GamepadLRMapping(4, 5),
            trigger: new GamepadLRMapping(6, 7),
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'joystick',
        'MY-POWER CO.,LTD. Mayflash Arcade Stick (STANDARD GAMEPAD Vendor: 0e8f Product: 0003)',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 3), new AxisAsButton('+', 2), new AxisAsButton('-', 3)),
            face: new GamepadFaceMapping(2, 1, 3, 0),
            shoulder: new GamepadLRMapping(6, 7),
            trigger: new GamepadLRMapping(4, 5),
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'ds3',
        'Afterglow Gamepad for PS3 (Vendor: 0e6f Product: 0111)',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 5), new AxisAsButton('+', 4), new AxisAsButton('+', 5), new AxisAsButton('-', 4)),
            face: new GamepadFaceMapping(3, 2, 1, 0)
        })
    ),
    new GameInputModel(
        GameInputSchema.RagdollOld,
        'ds3',
        '0e6f-0111-Afterglow Gamepad for PS3',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 5), new AxisAsButton('+', 4), new AxisAsButton('+', 5), new AxisAsButton('-', 4)),
            face: new GamepadFaceMapping(3, 2, 1, 0)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'joystick',
        'PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)',
        'macOS',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(7, 0, 6, 1),
            center: StandardCenterMapping,
            shoulder: new GamepadLRMapping(4, 2),
            trigger: new GamepadLRMapping(3, 5),
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'snes',
        '(null) usb gamepad            (Vendor: 0810 Product: e501)',
        'Linux',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(3, 2, 1, 0, FaceDirections.rtl),
            center: StandardCenterMapping,
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.PlumberTrident,
        'n64',
        'MAGIC-S PRO (Vendor: 20d6 Product: a710)',
        'Linux',
        MagicSProN64AdapterMapping
    ),
    new GameInputModel(
        GameInputSchema.PlumberTrident,
        'n64',
        'Controller (Vendor: 20d6 Product: a710)',
        'Linux',
        MagicSProN64AdapterMapping
    ),
    new GameInputModel(
        GameInputSchema.PlumberTrident,
        'n64',
        '20d6-a710-Controller',
        'Linux',
        MagicSProN64AdapterMapping
    ),
    new GameInputModel(
        GameInputSchema.PlumberTrident,
        'n64',
        '20d6-a710-MAGIC-S PRO',
        'Linux',
        MagicSProN64AdapterMapping
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'snes',
        '810-e501-usb gamepad           ',
        'macOS',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 3), new AxisAsButton('+', 2), new AxisAsButton('+', 3), new AxisAsButton('-', 2)),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'generic',
        '20d6-a711-Bensussen Deutsch & Associates,Inc.(BDA) Core (Plus) Wired Controller',
        'Linux',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 5), new AxisAsButton('+', 4), new AxisAsButton('+', 5), new AxisAsButton('-', 4)),
            face: StandardPlumberFaceMapping,
            center: StandardCenterMapping,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 10),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 3), new AxisAsButton('+', 2), new AxisAsButton('+', 3), new AxisAsButton('-', 2), 11)
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'generic',
        'Bensussen Deutsch & Associates,Inc.(BDA) Core (Plus) Wired Controller (Vendor: 20d6 Product: a711)',
        'Linux',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 5), new AxisAsButton('+', 4), new AxisAsButton('+', 5), new AxisAsButton('-', 4)),
            face: StandardPlumberFaceMapping,
            center: StandardCenterMapping,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 10),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 3), new AxisAsButton('+', 2), new AxisAsButton('+', 3), new AxisAsButton('-', 2), 11)
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'snes',
        '0411-00c6-BUFFALO BGC-FC801 USB Gamepad ',
        'macOS',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            center: new GamepadCenterMapping(7),
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'snes',
        'BUFFALO BGC-FC801 USB Gamepad (Vendor: 0411 Product: 00c6)',
        'macOS',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            center: new GamepadCenterMapping(7),
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'generic',
        'Core (Plus) Wired Controller (Vendor: 20d6 Product: a711)',
        'Windows',
        StandardPlumberGamepadMapping.variant({
            dpad: undefined,
            face: StandardPlumberFaceMapping,
            center: StandardCenterMapping,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 10),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 5), new AxisAsButton('+', 2), new AxisAsButton('+', 5), new AxisAsButton('-', 2), 11)
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'generic',
        '20d6-a711-Core (Plus) Wired Controller',
        'Windows',
        StandardPlumberGamepadMapping.variant({
            dpad: undefined,
            face: StandardPlumberFaceMapping,
            center: StandardCenterMapping,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 10),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 5), new AxisAsButton('+', 2), new AxisAsButton('+', 5), new AxisAsButton('-', 2), 11)
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'snes',
        '0925-8866-SFC/USB Pad',
        'Windows',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(2, 0, 1, 3),
            center: new GamepadCenterMapping(7),
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'snes',
        'SFC/USB Pad (Vendor: 0925 Product: 8866)',
        'Windows',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(2, 0, 1, 3),
            center: new GamepadCenterMapping(7),
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'snes',
        '0810-e501-usb gamepad           ',
        'Linux',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'snes',
        'usb gamepad            (Vendor: 0810 Product: e501)',
        'macOS',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            face: new GamepadFaceMapping(3, 2, 1, 0),
            center: StandardCenterMapping,
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'generic',
        '0583-2060-USB,2-axis 8-button gamepad   ',
        'macOS',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(12, 15, 13, 14),
            face: new GamepadFaceMapping(2, 0, 1, 3),
            center: StandardCenterMapping,
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Plumber,
        'generic',
        'USB,2-axis 8-button gamepad   (STANDARD GAMEPAD Vendor: 0583 Product: 2060)',
        'macOS',
        StandardPlumberGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(12, 15, 13, 14),
            face: new GamepadFaceMapping(2, 0, 1, 3),
            center: StandardCenterMapping,
            trigger: undefined,
            leftStick: undefined,
            rightStick: undefined
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        '©Microsoft Corporation Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        '0e6f-0213-Afterglow Gamepad for Xbox 360',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6)),
            center: new GamepadCenterMapping(7, 6),
            trigger: new GamepadLRMapping(new AxisAsButton('+', 2), new AxisAsButton('+', 5)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 9),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 10)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        'Performance Designed Products Afterglow Gamepad for Xbox 360 (STANDARD GAMEPAD Vendor: 0e6f Product: 0213)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        'Xbox 360 Controller (XInput STANDARD GAMEPAD)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        '0000-0000-Xbox 360 Wireless Receiver',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(15, 14, 16, 13),
            center: StandardCenterMapping,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1))
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xbox360',
        'Xbox 360 Wireless Receiver (Vendor: 0000 Product: 0000)',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(15, 14, 16, 13),
            face: new GamepadFaceMapping(2, 0, 1, 3),
            center: StandardCenterMapping,
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1)),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 2), new AxisAsButton('+', 1), new AxisAsButton('+', 2), new AxisAsButton('-', 1))
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        '0e6f-0139-Afterglow Prismatic Wired Controller',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6)),
            center: new GamepadCenterMapping(7, 6),
            trigger: new GamepadLRMapping(new AxisAsButton('+', 2), new AxisAsButton('+', 5)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 9),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 10)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Microsoft Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b12)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        '045e-0b12-Microsoft Xbox Series S|X Controller',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6)),
            center: new GamepadCenterMapping(7, 6),
            trigger: new GamepadLRMapping(new AxisAsButton('+', 2), new AxisAsButton('+', 5)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 9),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 10)
        })
    ),
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
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6)),
            center: new GamepadCenterMapping(7, 6),
            trigger: new GamepadLRMapping(new AxisAsButton('+', 2), new AxisAsButton('+', 5)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 9),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 10)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        '045e-0b13-Xbox Wireless Controller',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6)),
            face: new GamepadFaceMapping(4, 1, 0, 3),
            center: new GamepadCenterMapping(11, 10),
            shoulder: new GamepadLRMapping(6, 7),
            trigger: new GamepadLRMapping(new AxisAsButton('+', 5), new AxisAsButton('+', 4)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 13),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 3), new AxisAsButton('+', 2), new AxisAsButton('+', 3), new AxisAsButton('-', 2), 14)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        '045e-02ea-Microsoft X-Box One S pad',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6)),
            center: new GamepadCenterMapping(7, 6),
            shoulder: new GamepadLRMapping(4, 5),
            trigger: new GamepadLRMapping(new AxisAsButton('+', 2), new AxisAsButton('+', 5)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 9),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 4), new AxisAsButton('+', 3), new AxisAsButton('+', 4), new AxisAsButton('-', 3), 10)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        '045e-0b20-Xbox Wireless Controller',
        'Linux',
        StandardGamepadMapping.variant({
            dpad: new GamepadDirectionsMapping(new AxisAsButton('-', 7), new AxisAsButton('+', 6), new AxisAsButton('+', 7), new AxisAsButton('-', 6)),
            face: new GamepadFaceMapping(4, 1, 0, 3),
            center: new GamepadCenterMapping(11, 10),
            shoulder: new GamepadLRMapping(6, 7),
            trigger: new GamepadLRMapping(new AxisAsButton('+', 5), new AxisAsButton('+', 4)),
            leftStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 1), new AxisAsButton('+', 0), new AxisAsButton('+', 1), new AxisAsButton('-', 0), 13),
            rightStick: new GamepadAnalogStickMapping(new AxisAsButton('-', 3), new AxisAsButton('+', 2), new AxisAsButton('+', 3), new AxisAsButton('-', 2), 14)
        })
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Microsoft Controller (STANDARD GAMEPAD Vendor: 045e Product: 02ea)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 02e0)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b20)'
    ),
    new GameInputModel(
        GameInputSchema.Hedgehog,
        'xboxone',
        'HID-compliant game controller (STANDARD GAMEPAD Vendor: 045e Product: 0b20)'
    )
]

export default GameInputModels
export { GameInputModels }
