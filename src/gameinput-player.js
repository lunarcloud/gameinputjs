import { GamepadSchemaNames } from './gamepad-schema-names.js'

/**
 *
 * @param val
 * @param min
 * @param max
 */
function normalize (val, min, max) {
    return (val - min) / (max - min)
}

/**
 * Game Input Player.
 */
export default class GameInputPlayer {
    #gameInput

    constructor (gameInput, number) {
        this.#gameInput = gameInput
        this.number = number
        this.index = number - 1

        this.type
        this.model
        this.schema
        this.theme
        this.state
        this.analog

        this.previous = {
            type: undefined,
            model: undefined,
            schema: undefined,
            state: undefined,
            analog: undefined
        }

        this.buttonDownActions = {}
        this.buttonUpActions = {}

        for (const i in GamepadSchemaNames) {
            this.buttonDownActions[GamepadSchemaNames[i]] = []
            this.buttonUpActions[GamepadSchemaNames[i]] = []
        }
    }

    buttonDown (schemaName) {
        this.#gameInput.buttonDown(this.index, schemaName)
        for (const action in this.buttonDownActions[schemaName])
            this.buttonDownActions[schemaName][action]()
    }

    buttonUp (schemaName) {
        this.#gameInput.buttonUp(this.index, schemaName)
        for (const action in this.buttonUpActions[schemaName])
            this.buttonUpActions[schemaName][action]()
    }

    onButtonDown (schemaName, action) {
        if (schemaName in GamepadSchemaNames === false) throw 'Must be SchemaNames'
        if (typeof (action) !== 'function') throw 'Action must be a function'

        this.buttonDownActions[schemaName].push(action)
    }

    onButtonUp (schemaName, action) {
        if (schemaName in GamepadSchemaNames === false) throw 'Must be SchemaNames'
        if (typeof (action) !== 'function') throw 'Action must be a function'

        this.buttonUpActions[schemaName].push(action)
    }

    getStickVector (stick) {
        if (stick != 'l' && stick != 'r') throw 'Must be l or r'

        let x = 0
        let y = 0

        if (this.schema[stick + '_up'] instanceof SchemaAxisButton) {
            if (this.schema[stick + '_up'].direction == 'negative') {
                y -= this.analog[stick + '_up'] < this.schema[stick + '_up'].deadZone ? Math.abs(this.analog[stick + '_up']) : 0
            } else {
                y -= this.analog[stick + '_up'] > this.schema[stick + '_up'].deadZone ? Math.abs(this.analog[stick + '_up']) : 0
            }
        } else {
            y -= 0.7
        }

        if (this.schema[stick + '_down'] instanceof SchemaAxisButton) {
            if (this.schema[stick + '_down'].direction == 'negative') {
                y += this.analog[stick + '_down'] < this.schema[stick + '_down'].deadZone ? Math.abs(this.analog[stick + '_down']) : 0
            } else {
                y += this.analog[stick + '_down'] > this.schema[stick + '_down'].deadZone ? Math.abs(this.analog[stick + '_down']) : 0
            }
        } else {
            x += 0.7
        }

        if (this.schema[stick + '_left'] instanceof SchemaAxisButton) {
            if (this.schema[stick + '_left'].direction == 'negative') {
                x -= this.analog[stick + '_left'] < this.schema[stick + '_left'].deadZone ? Math.abs(this.analog[stick + '_left']) : 0
            } else {
                x -= this.analog[stick + '_left'] > this.schema[stick + '_left'].deadZone ? Math.abs(this.analog[stick + '_left']) : 0
            }
        } else {
            x -= 0.7
        }

        if (this.schema[stick + '_right'] instanceof SchemaAxisButton) {
            if (this.schema[stick + '_right'].direction == 'negative') {
                x += this.analog[stick + '_right'] < this.schema[stick + '_right'].deadZone ? Math.abs(this.analog[stick + '_right']) : 0
            } else {
                x += this.analog[stick + '_right'] > this.schema[stick + '_right'].deadZone ? Math.abs(this.analog[stick + '_right']) : 0
            }
        } else {
            x += 0.7
        }

        return new Vector2(x, y)
    }

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

    getNormalizedTriggerValue (trigger) {
        if (trigger != 'l' && trigger != 'r') throw 'Must be l or r'
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
     * @description    Gets the button text
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
