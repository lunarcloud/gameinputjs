import GameInputModel from './gameinput-model.js'
import GameInputSchema from './gameinput-schema.js'
import GamepadAPI from './gamepad-api.js'
import { GamepadSchemaNames } from './gamepad-schema-names.js'
import SchemaAxisButton from './schema-axis-button.js'
import Vector2 from './vector2.js'

/**
 * Normalize a value.
 * @param {number} val  value
 * @param {number} min  minimum
 * @param {number} max  maximum
 * @returns {number}    normalized value
 */
function normalize (val, min, max) {
    return (val - min) / (max - min)
}

/**
 * Game Input Player.
 */
export default class GameInputPlayer {
    /**
     * @type {import('./gameinput.js').GameInput}
     */
    #gameInput

    /**
     * @type {GameInputSchema?}
     */
    type = undefined

    /**
     * @type {GameInputModel?}
     */
    model = undefined

    /**
     * @type {GamepadAPI?}
     */
    schema = undefined

    /**
     * @type {GameInputSchema?}
     */
    theme = undefined

    /**
     * @type {object?}
     */
    state = undefined

    /**
     * @type {object?}
     */
    analog = undefined

    /**
     * @type {{type: GameInputSchema?, model: GameInputModel?, schema: GamepadAPI?, state: object?, analog: object?}}
     */
    previous = {
        type: undefined,
        model: undefined,
        schema: undefined,
        state: undefined,
        analog: undefined
    }

    /**
     * Actions to perform on button down.
     * @type {Object.<import('./gamepad-schema-names.js').GamepadSchemaName,Function>}
     */
    buttonDownActions = {}

    /**
     * Actions to perform on button up.
     * @type {Object.<import('./gamepad-schema-names.js').GamepadSchemaName,Function>}
     */
    buttonUpActions = {}

    constructor (gameInput, number) {
        this.#gameInput = gameInput
        this.number = number
        this.index = number - 1

        for (const i in GamepadSchemaNames) {
            this.buttonDownActions[GamepadSchemaNames[i]] = []
            this.buttonUpActions[GamepadSchemaNames[i]] = []
        }
    }

    /**
     * Set player to a specific model.
     * @param {GameInputModel?} model Model to set
     */
    setModel (model) {
        this.type = model?.type
        this.model = model
        this.schema = model?.schema
        this.theme = model?.theme
    }

    /**
     * Activate 'Button down' actions for this player.
     * @param {import('./gamepad-schema-names.js').GamepadSchemaName} schemaName Name of button
     */
    buttonDown (schemaName) {
        this.#gameInput.buttonDown(this.index, schemaName)
        for (const action in this.buttonDownActions[schemaName])
            this.buttonDownActions[schemaName][action]()
    }

    /**
     * Activate 'Button up' actions for this player.
     * @param {import('./gamepad-schema-names.js').GamepadSchemaName} schemaName Name of button
     */
    buttonUp (schemaName) {
        this.#gameInput.buttonUp(this.index, schemaName)
        for (const action in this.buttonUpActions[schemaName])
            this.buttonUpActions[schemaName][action]()
    }

    /**
     * Add an action to "button down" events.
     * @param {import('./gamepad-schema-names.js').GamepadSchemaName} schemaName Name of button
     * @param {Function} action Action to add.
     */
    onButtonDown (schemaName, action) {
        if (schemaName in GamepadSchemaNames === false)
            throw new Error('Must be SchemaNames')
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')

        this.buttonDownActions[schemaName].push(action)
    }

    /**
     * Add an action to "button up" events.
     * @param {import('./gamepad-schema-names.js').GamepadSchemaName} schemaName Name of button
     * @param {Function} action Action to add.
     */
    onButtonUp (schemaName, action) {
        if (schemaName in GamepadSchemaNames === false)
            throw new Error('Must be SchemaNames')
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')

        this.buttonUpActions[schemaName].push(action)
    }

    /**
     * Get vector for stick
     * @param {'l'|'r'} stick Stick side
     * @returns {Vector2} stick vector
     */
    getStickVector (stick) {
        if (stick !== 'l' && stick !== 'r')
            throw new Error('Must be l or r')

        let x = 0
        let y = 0

        if (this.schema[stick + '_up'] instanceof SchemaAxisButton) {
            if (this.schema[stick + '_up'].direction === 'negative') {
                y -= this.analog[stick + '_up'] < this.schema[stick + '_up'].deadZone ? Math.abs(this.analog[stick + '_up']) : 0
            } else {
                y -= this.analog[stick + '_up'] > this.schema[stick + '_up'].deadZone ? Math.abs(this.analog[stick + '_up']) : 0
            }
        } else {
            y -= 0.7
        }

        if (this.schema[stick + '_down'] instanceof SchemaAxisButton) {
            if (this.schema[stick + '_down'].direction === 'negative') {
                y += this.analog[stick + '_down'] < this.schema[stick + '_down'].deadZone ? Math.abs(this.analog[stick + '_down']) : 0
            } else {
                y += this.analog[stick + '_down'] > this.schema[stick + '_down'].deadZone ? Math.abs(this.analog[stick + '_down']) : 0
            }
        } else {
            x += 0.7
        }

        if (this.schema[stick + '_left'] instanceof SchemaAxisButton) {
            if (this.schema[stick + '_left'].direction === 'negative') {
                x -= this.analog[stick + '_left'] < this.schema[stick + '_left'].deadZone ? Math.abs(this.analog[stick + '_left']) : 0
            } else {
                x -= this.analog[stick + '_left'] > this.schema[stick + '_left'].deadZone ? Math.abs(this.analog[stick + '_left']) : 0
            }
        } else {
            x -= 0.7
        }

        if (this.schema[stick + '_right'] instanceof SchemaAxisButton) {
            if (this.schema[stick + '_right'].direction === 'negative') {
                x += this.analog[stick + '_right'] < this.schema[stick + '_right'].deadZone ? Math.abs(this.analog[stick + '_right']) : 0
            } else {
                x += this.analog[stick + '_right'] > this.schema[stick + '_right'].deadZone ? Math.abs(this.analog[stick + '_right']) : 0
            }
        } else {
            x += 0.7
        }

        return new Vector2(x, y)
    }

    /**
     * Get normalized vector for stick
     * @param {'l'|'r'} stick Stick side
     * @returns {Vector2} normalized stick vector
     */
    getNormalizedStickVector (stick) {
        const stickInput = this.getStickVector(stick)
        let radialDeadZone = 0

        for (const direction in ['up', 'down', 'left', 'right']) {
            if (this.schema[stick + '_' + direction] instanceof SchemaAxisButton) {
                if (this.schema[stick + '_' + direction].deadZone > radialDeadZone) {
                    radialDeadZone = this.schema[stick + '_' + direction].deadZone
                }
            }
        }

        if (stickInput.magnitude < radialDeadZone) {
            return new Vector2(0, 0)
        } else {
            return stickInput.normalize().scale((stickInput.magnitude() - radialDeadZone) / (1 - radialDeadZone))
        }
    }

    /**
     * Get normalized value for trigger
     * @param {'l'|'r'} trigger Trigger side
     * @returns {number} normalized trigger value
     */
    getNormalizedTriggerValue (trigger) {
        if (trigger !== 'l' && trigger !== 'r')
            throw new Error('Must be l or r')
        trigger += '_trigger'

        if (typeof (this.schema[trigger]) === 'number') {
            return this.state[trigger] ? 1 : 0
        }
        // else  this.schema[trigger] instanceof SchemaAxisButton
        return normalize(
        /* val */ this.state[trigger],
            /* min */ this.schema[trigger].deadZone,
            /* max */ 1
        )
    }

    /**
     * Gets the button text.
     * @param   {string}    schemaName      name of the button or axisValue
     * @param   {boolean}   symbolsAsWords  whether or not to convert Ragdoll's "x □ o △" to "cross square circle triangle"
     * @returns {string}    button text
     */
    getButtonText (schemaName, symbolsAsWords) {
        if (!this.model?.type)
            return ''

        const text = this.model.type.schemaNames[schemaName]

        if (symbolsAsWords !== true)
            return text

        switch (text) {
            case '▶':
                return 'start'
            case 'x':
                return 'cross'
            case 'o':
                return 'circle'
            case '□':
                return 'square'
            case '△':
                return 'triangle'
            default:
                return text
        }
    }
};

export { GameInputPlayer }
