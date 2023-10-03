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
     */
    schemaNames = {}

    /**
     * Constructor.
     * @param {string} name schema/theme name
     * @param {object} themeSchemaNames list of overrides for button names to text
     */
    constructor (name, themeSchemaNames) {
        this.name = name

        for (const i in GameInputSchema.Defaults) {
            this.schemaNames[i] = themeSchemaNames[i] ?? GameInputSchema.Defaults[i]
        }
    }
}

export { GameInputSchema }
