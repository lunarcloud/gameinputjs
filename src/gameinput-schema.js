import { GamepadButtons } from './gamepad-buttons.js'

/**
 * Defines what each button is displayed as, what should be on the physical device for each button.
 */
class GameInputSchema {
    /**
     * The default values that can be overridden.
     * @type {Map<GamepadButton, string>}
     */
    static Defaults = new Map([
        [GamepadButtons.dpadUp, '↑'],
        [GamepadButtons.dpadDown, '↓'],
        [GamepadButtons.dpadLeft, '←'],
        [GamepadButtons.dpadRight, '→'],
        [GamepadButtons.menu, '▶'],
        [GamepadButtons.button0, 'button0'],
        [GamepadButtons.button1, 'button1'],
        [GamepadButtons.button2, 'button2'],
        [GamepadButtons.button3, 'button3'],
        [GamepadButtons.leftStickUp, '↑'],
        [GamepadButtons.leftStickDown, '↓'],
        [GamepadButtons.leftStickLeft, '←'],
        [GamepadButtons.leftStickRight, '→'],
        [GamepadButtons.rightStickUp, '↑'],
        [GamepadButtons.rightStickDown, '↓'],
        [GamepadButtons.rightStickLeft, '←'],
        [GamepadButtons.rightStickRight, '→'],
        [GamepadButtons.leftShoulder, 'leftShoulder'],
        [GamepadButtons.rightShoulder, 'rightShoulder'],
        [GamepadButtons.leftTrigger, 'leftTrigger'],
        [GamepadButtons.rightTrigger, 'rightTrigger']
    ])

    /**
     * Sega/Xbox style
     */
    static Hedgehog = new GameInputSchema('Hedgehog', {
        button0: 'A',
        button1: 'B',
        button2: 'X',
        button3: 'Y',
        leftShoulder: 'LB',
        rightShoulder: 'RB',
        leftTrigger: 'LT',
        rightTrigger: 'RT'
    })

    /**
     * Nintendo style
     */
    static Plumber = new GameInputSchema('Plumber', {
        button0: 'A',
        button1: 'B',
        button2: 'X',
        button3: 'Y',
        leftShoulder: 'LB',
        rightShoulder: 'RB',
        leftTrigger: 'LT',
        rightTrigger: 'RT'
    })

    /**
     * Older Sony style
     */
    static RagdollOld = new GameInputSchema('Ragdoll', {
        button0: 'x',
        button1: 'o',
        button2: '□',
        button3: '△',
        leftShoulder: 'L1',
        rightShoulder: 'R1',
        leftTrigger: 'L2',
        rightTrigger: 'R2'
    })

    /**
     * Newer Sony style
     */
    static Ragdoll = new GameInputSchema('Ragdoll', {
        menu: 'options',
        button0: 'x',
        button1: 'o',
        button2: '□',
        button3: '△',
        leftShoulder: 'L1',
        rightShoulder: 'R1',
        leftTrigger: 'L2',
        rightTrigger: 'R2'
    })

    /**
     * Schema name
     */
    name = ''

    /**
     * Button/Axes names-to-text
     * @type {Map<GamepadButton, string>}
     */
    buttonNames = new Map()

    /**
     * Constructor.
     * @param {string} name schema/theme name
     * @param {Map|object} themebuttonNames list of overrides for button names to text
     */
    constructor (name, themebuttonNames) {
        this.name = name

        // defaults
        GameInputSchema.Defaults.forEach((value, key, _) => this.buttonNames.set(key, value))

        // override
        if (themebuttonNames instanceof Map)
            themebuttonNames.forEach((value, key, _) => this.buttonNames.set(key, value))
        else
            Object.keys(themebuttonNames).forEach((/** @type {any} */key, _) =>
                this.buttonNames.set(key, themebuttonNames[key]))
    }
}

export { GameInputSchema }
