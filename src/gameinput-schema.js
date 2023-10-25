/**
 * @typedef {{ up: GameInputSchemaButtonName, down: GameInputSchemaButtonName, left: GameInputSchemaButtonName, right: GameInputSchemaButtonName }} GameInputSchemaDirectionNames
 */

/**
 * @typedef {{ up: GameInputSchemaButtonName, down: GameInputSchemaButtonName, left: GameInputSchemaButtonName, right: GameInputSchemaButtonName, click: GameInputSchemaButtonName }} GameInputSchemaStickNames
 */

/**
 * @typedef {{ left: GameInputSchemaButtonName, right: GameInputSchemaButtonName }} GameInputSchemaLRNames
 */

/**
 * @typedef {{ menu: GameInputSchemaButtonName, back: GameInputSchemaButtonName }} GameInputSchemaCenterNames
 */

/**
 * @typedef {string|'dpad'|'center'|'face'|'leftStick'|'rightStick'|'shoulder'|'trigger'} GameInputSchemaSectionName
 */

/**
 * @typedef {string|'up'|'down'|'left'|'right'|'menu'|'back'|'click'} GameInputSchemaButtonName
 */

/**
 * Possible Section Names
 * @type {{dpad: GameInputSchemaSectionName, center: GameInputSchemaSectionName, face: GameInputSchemaSectionName, leftStick: GameInputSchemaSectionName, rightStick: GameInputSchemaSectionName, shoulder: GameInputSchemaSectionName, trigger: GameInputSchemaSectionName, }}
 */
export const GameInputSchemaSectionNames = {
    dpad: 'dpad',
    center: 'center',
    face: 'face',
    leftStick: 'leftStick',
    rightStick: 'rightStick',
    shoulder: 'shoulder',
    trigger: 'trigger'
}

/**
 * Possible Button Names Within sections
 * @type {{ up: GameInputSchemaButtonName, down: GameInputSchemaButtonName, left: GameInputSchemaButtonName, right: GameInputSchemaButtonName, menu: GameInputSchemaButtonName, back: GameInputSchemaButtonName, click: GameInputSchemaButtonName }}
 */
export const GameInputSchemaButtonNames = {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right',
    menu: 'menu',
    back: 'back',
    click: 'click'
}

/**
 * @typedef {{
 *     dpad?: GameInputSchemaDirectionNames,
 *     center?: { menu: string, back?: string },
 *     face?:  GameInputSchemaDirectionNames,
 *     leftStick?:  GameInputSchemaStickNames,
 *     rightStick?:  GameInputSchemaStickNames,
 *     shoulder?: GameInputSchemaLRNames,
 *     trigger?: GameInputSchemaLRNames
 * }} GameInputSchemaOverrides
 */

/**
 * Defines what each button is displayed as, what should be on the physical device for each button.
 */
export class GameInputSchema {
    /**
     * Dpad Schema names
     * @type {GameInputSchemaDirectionNames}
     */
    dpad

    /**
     * Face Button Schema names
     * @type {GameInputSchemaDirectionNames}
     */
    face

    /**
     * Left Stick Schema names
     * @type {GameInputSchemaStickNames}
     */
    leftStick

    /**
     * Right Stick Schema names
     * @type {GameInputSchemaStickNames}
     */
    rightStick

    /**
     * Center Button Schema names
     * @type {GameInputSchemaCenterNames}
     */
    center

    /**
     * Shoulder Button Schema names
     * @type {GameInputSchemaLRNames}
     */
    shoulder

    /**
     * Trigger Schema names
     * @type {GameInputSchemaLRNames}
     */
    trigger

    /**
     * The default values that can be overridden.
     * @type {GameInputSchemaOverrides}
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
            right: '→',
            click: 'click'
        },
        rightStick: {
            up: '↑',
            down: '↓',
            left: '←',
            right: '→',
            click: 'click'
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
     * Nintendo64 style
     */
    static PlumberTrident = new GameInputSchema('Plumber', {
        face: {
            up: '',
            down: 'A',
            left: 'B',
            right: ''
        },
        center: {
            menu: 'start',
            back: ''
        },
        shoulder: {
            left: 'L',
            right: 'R'
        },
        trigger: {
            left: 'Z',
            right: ''
        }
    })

    /**
     * Nintendo Gamecube style
     */
    static PlumberCube = new GameInputSchema('Plumber', {
        face: {
            up: 'Y',
            down: 'A',
            left: 'B',
            right: 'X'
        },
        center: {
            menu: 'start',
            back: ''
        },
        shoulder: {
            left: '',
            right: 'Z'
        },
        trigger: {
            left: 'L',
            right: 'R'
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
        },
        leftStick: {
            up: '↑',
            down: '↓',
            left: '←',
            right: '→',
            click: 'L3'
        },
        rightStick: {
            up: '↑',
            down: '↓',
            left: '←',
            right: '→',
            click: 'R3'
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
        },
        leftStick: {
            up: '↑',
            down: '↓',
            left: '←',
            right: '→',
            click: 'L3'
        },
        rightStick: {
            up: '↑',
            down: '↓',
            left: '←',
            right: '→',
            click: 'R3'
        }
    })

    /**
     * Schema name
     */
    name = ''

    /**
     * Constructor.
     * @param {string} name         schema/theme name
     * @param {GameInputSchemaOverrides} overrides    list of overrides for button names to text
     */
    constructor (name, overrides) {
        this.name = name
        Object.assign(this, Object.assign(GameInputSchema.Defaults, overrides))
    }
}
