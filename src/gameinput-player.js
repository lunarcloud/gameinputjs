import { GameInputModel } from './gameinput-model.js'
import { GameInputSchema } from './gameinput-schema.js'
import { GameInput } from './gameinput.js'
import { GamepadMapping } from './gamepad-mapping.js'
import { GamepadMappingKeys } from './gamepad-mapping-keys.js'
import { AxisAsButton } from './axis-as-button.js'
import { Vector2 } from './vector2.js'

/**
 * Game Input Player.
 */
class GameInputPlayer {
    /**
     * @type {GameInput}
     */
    #gameInput

    /**
     * @type {GameInputSchema|undefined}
     */
    type = undefined

    /**
     * @type {GameInputModel|undefined}
     */
    model = undefined

    /**
     * @type {GamepadMapping|undefined}
     */
    schema = undefined

    /**
     * @type {GameInputSchema|undefined}
     */
    theme = undefined

    /**
     * @type {Object.<import('./gamepad-mapping-keys.js').GamepadMappingKey,boolean>|undefined}
     */
    state = undefined

    /**
     * @type {object|undefined}
     */
    analog = undefined

    /**
     * @type {{
     *  type: GameInputSchema|undefined,
     *  model: GameInputModel|undefined,
     *  schema: GamepadMapping|undefined,
     *  state: object|undefined,
     *  analog: object|undefined
     * }}
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
     */
    buttonDownActions = {}

    /**
     * Actions to perform on button up.
     */
    buttonUpActions = {}

    /**
     * Constuctor.
     * @param {import('./gameinput.js').GameInput} gameInput Game Input manager
     * @param {number} number Player number (1-based)
     */
    constructor (gameInput, number) {
        this.#gameInput = gameInput
        this.number = number
        this.index = number - 1

        for (const i in GamepadMappingKeys) {
            this.buttonDownActions[GamepadMappingKeys[i]] = []
            this.buttonUpActions[GamepadMappingKeys[i]] = []
        }
    }

    /**
     * Set player to a specific model.
     * @param {GameInputModel|undefined} model Model to set
     */
    setModel (model) {
        this.type = model?.type
        this.model = model
        this.schema = model?.schema
    }

    /**
     * Activate 'Button down' actions for this player.
     * @param {import('./gamepad-mapping-keys.js').GamepadMappingKey} schemaName Name of button
     */
    buttonDown (schemaName) {
        this.#gameInput.buttonDown(this.index, schemaName)
        for (const action in this.buttonDownActions[schemaName])
            this.buttonDownActions[schemaName][action]()
    }

    /**
     * Activate 'Button up' actions for this player.
     * @param {import('./gamepad-mapping-keys.js').GamepadMappingKey} schemaName Name of button
     */
    buttonUp (schemaName) {
        this.#gameInput.buttonUp(this.index, schemaName)
        for (const action in this.buttonUpActions[schemaName])
            this.buttonUpActions[schemaName][action]()
    }

    /**
     * Add an action to "button down" events.
     * @param {import('./gamepad-mapping-keys.js').GamepadMappingKey} schemaName Name of button
     * @param {Function} action Action to add.
     */
    onButtonDown (schemaName, action) {
        if (schemaName in GamepadMappingKeys === false)
            throw new Error('Must be SchemaNames')
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')

        this.buttonDownActions[schemaName].push(action)
    }

    /**
     * Add an action to "button up" events.
     * @param {import('./gamepad-mapping-keys.js').GamepadMappingKey} schemaName Name of button
     * @param {Function} action Action to add.
     */
    onButtonUp (schemaName, action) {
        if (schemaName in GamepadMappingKeys === false)
            throw new Error('Must be SchemaNames')
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')

        this.buttonUpActions[schemaName].push(action)
    }

    /**
     * Get vector for stick
     * @param {'left'|'right'} stick Stick side
     * @returns {Vector2} stick vector
     */
    getStickVector (stick) {
        if (stick !== 'left' && stick !== 'right')
            throw new Error('Must be left or right')

        const vector = new Vector2(0, 0)

        let item = stick + 'StickUp'
        if (this.schema[item] instanceof AxisAsButton) {
            if (this.schema[item].direction === 'negative') {
                vector.y -= this.analog[item] < this.schema[item].deadZone ? Math.abs(this.analog[item]) : 0
            } else {
                vector.y -= this.analog[item] > this.schema[item].deadZone ? Math.abs(this.analog[item]) : 0
            }
        } else {
            vector.y -= 0.7
        }

        item = stick + 'StickDown'
        if (this.schema[item] instanceof AxisAsButton) {
            if (this.schema[item].direction === 'negative') {
                vector.y += this.analog[item] < this.schema[item].deadZone ? Math.abs(this.analog[item]) : 0
            } else {
                vector.y += this.analog[item] > this.schema[item].deadZone ? Math.abs(this.analog[item]) : 0
            }
        } else {
            vector.y += 0.7
        }

        item = stick + 'StickLeft'
        if (this.schema[item] instanceof AxisAsButton) {
            if (this.schema[item].direction === 'negative') {
                vector.x -= this.analog[item] < this.schema[item].deadZone ? Math.abs(this.analog[item]) : 0
            } else {
                vector.x -= this.analog[item] > this.schema[item].deadZone ? Math.abs(this.analog[item]) : 0
            }
        } else {
            vector.x -= 0.7
        }

        item = stick + 'StickRight'
        if (this.schema[item] instanceof AxisAsButton) {
            if (this.schema[item].direction === 'negative') {
                vector.x += this.analog[item] < this.schema[item].deadZone ? Math.abs(this.analog[item]) : 0
            } else {
                vector.x += this.analog[item] > this.schema[item].deadZone ? Math.abs(this.analog[item]) : 0
            }
        } else {
            vector.x += 0.7
        }

        return vector
    }

    /**
     * Get normalized vector for stick
     * @param {'left'|'right'} stick Stick side
     * @returns {Vector2} normalized stick vector
     */
    getNormalizedStickVector (stick) {
        const stickInput = this.getStickVector(stick)
        let radialDeadZone = 0

        for (const direction in ['Up', 'Down', 'Left', 'Right']) {
            if (this.schema[stick + 'Stick' + direction] instanceof AxisAsButton) {
                if (this.schema[stick + 'Stick' + direction].deadZone > radialDeadZone) {
                    radialDeadZone = this.schema[stick + 'Stick' + direction].deadZone
                }
            }
        }

        if (stickInput.magnitude() < radialDeadZone) {
            return new Vector2(0, 0)
        } else {
            return stickInput.normalize().scale((stickInput.magnitude() - radialDeadZone) / (1 - radialDeadZone))
        }
    }

    /**
     * Normalize a value.
     * @param {number} val  value
     * @param {number} min  minimum
     * @param {number} max  maximum
     * @returns {number}    normalized value
     */
    #normalize (val, min, max) {
        return (val - min) / (max - min)
    }

    /**
     * Get normalized value for trigger
     * @param {'left'|'right'} trigger Trigger side
     * @returns {number} normalized trigger value
     */
    getNormalizedTriggerValue (trigger) {
        if (trigger !== 'left' && trigger !== 'right')
            throw new Error('Must be left or right')
        trigger += 'Trigger'

        if (typeof (this.schema[trigger]) === 'number') {
            return this.state[trigger] ? 1 : 0
        }
        // else  this.schema[trigger] instanceof AxisAsButton
        return this.#normalize(
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
