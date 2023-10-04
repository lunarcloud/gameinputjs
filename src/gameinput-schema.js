/**
 * Defines what each button is displayed as, what should be on the physical device for each button.
 */
class GameInputSchema {
    /**
     * The default values that can be overridden.
     */
    static Defaults = {
        dpadUp: '↑',
        dpadDown: '↓',
        dpadLeft: '←',
        dpadRight: '→',
        menu: '▶',
        button0: 'button0',
        button1: 'button1',
        button2: 'button2',
        button3: 'button3',
        leftStickUp: '↑',
        leftStickDown: '↓',
        leftStickLeft: '←',
        leftStickRight: '→',
        rightStickUp: '↑',
        rightStickDown: '↓',
        rightStickLeft: '←',
        rightStickRight: '→',
        leftShoulder: 'leftShoulder',
        rightShoulder: 'rightShoulder',
        leftTrigger: 'leftTrigger',
        rightTrigger: 'rightTrigger'
    }

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
     * @type {Map<import("./gamepad-buttons").GameInputButton, string>}
     */
    buttonNames = new Map()

    /**
     * Constructor.
     * @param {string} name schema/theme name
     * @param {Map|object} themebuttonNames list of overrides for button names to text
     */
    constructor (name, themebuttonNames) {
        this.name = name

        Object.keys(GameInputSchema.Defaults).forEach((/** @type {any} */key, _) =>
            this.buttonNames.set(key, themebuttonNames[key] ?? GameInputSchema.Defaults[key]))
    }
}

export { GameInputSchema }
