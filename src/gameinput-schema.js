/**
 * Defines what each button is displayed as, what should be on the physical device for each button.
 */
class GameInputSchema {
    /**
     * The default values that can be overridden.
     */
    static Defaults = {
        dpad: {
            up: '↑',
            down: '↓',
            left: '←',
            right: '→'
        },
        center: {
            menu: '▶',
            back: 'back'
        },
        face: {
            up: '3',
            down: '0',
            left: '2',
            right: '1'
        },
        leftStick: {
            up: '↑',
            down: '↓',
            left: '←',
            right: '→'
        },
        rightStick: {
            up: '↑',
            down: '↓',
            left: '←',
            right: '→'
        },
        shoulder: {
            left: 'LB',
            right: 'RB'
        },
        trigger: {
            left: 'LT',
            right: 'RT'
        }
    }

    /**
     * Sega/Xbox style
     */
    static Hedgehog = new GameInputSchema('Hedgehog', {
        face: {
            up: 'Y',
            down: 'A',
            left: 'X',
            right: 'B'
        },
        shoulder: {
            left: 'LB',
            right: 'RB'
        },
        trigger: {
            left: 'LT',
            right: 'RT'
        }
    })

    /**
     * Nintendo style
     */
    static Plumber = new GameInputSchema('Plumber', {
        face: {
            up: 'X',
            down: 'B',
            left: 'Y',
            right: 'A'
        },
        center: {
            menu: '+',
            back: '-'
        },
        shoulder: {
            left: 'L',
            right: 'R'
        },
        trigger: {
            left: 'ZL',
            right: 'ZR'
        }
    })

    /**
     * Nintendo style (Horizontal Right Joy-Con)
     */
    static PlumberRotatedRight = new GameInputSchema('Plumber', {
        face: {
            up: 'Y',
            down: 'A',
            left: 'B',
            right: 'X'
        },
        center: {
            menu: '+'
        },
        shoulder: {
            left: 'SL',
            right: 'SR'
        },
        trigger: {
            left: 'ZL',
            right: 'ZR'
        }
    })

    /**
     * Nintendo style (Horizontal Left Joy-Con)
     */
    static PlumberRotatedLeft = new GameInputSchema('Plumber', {
        face: {
            up: '↑',
            down: '↓',
            left: '←',
            right: '→'
        },
        center: {
            menu: '-'
        },
        shoulder: {
            left: 'SL',
            right: 'SR'
        },
        trigger: {
            left: 'ZL',
            right: 'ZR'
        }
    })

    /**
     * Older Sony style
     */
    static RagdollOld = new GameInputSchema('Ragdoll', {
        face: {
            up: '△',
            down: 'x',
            left: '□',
            right: 'o'
        },
        center: {
            menu: 'start',
            back: 'select'
        },
        shoulder: {
            left: 'L1',
            right: 'R1'
        },
        trigger: {
            left: 'L2',
            right: 'R2'
        }
    })

    /**
     * Newer Sony style
     */
    static Ragdoll = new GameInputSchema('Ragdoll', {
        face: {
            up: '△',
            down: 'x',
            left: '□',
            right: 'o'
        },
        center: {
            menu: 'options',
            back: 'share'
        },
        shoulder: {
            left: 'L1',
            right: 'R1'
        },
        trigger: {
            left: 'L2',
            right: 'R2'
        }
    })

    /**
     * Schema name
     */
    name = ''

    /**
     * Constructor.
     * @param {string} name         schema/theme name
     * @param {object} overrides    list of overrides for button names to text
     */
    constructor (name, overrides) {
        this.name = name
        Object.assign(this, Object.assign(GameInputSchema.Defaults, overrides))
    }
}

export { GameInputSchema }
