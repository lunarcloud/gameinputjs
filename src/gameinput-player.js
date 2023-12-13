import { GameInputModel } from './gameinput-model.js'
import { GameInputSchema } from './gameinput-schema.js'
import { GameInput } from './gameinput.js'
import { GamepadMapping } from './gamepad-mapping.js'
import { AxisAsButton } from './axis-as-button.js'
import { Vector2 } from './vector2.js'
import { GameInputState } from './gameinput-state.js'

/**
 * Game Input Player.
 */
export class GameInputPlayer {
    /**
     * @type {GameInput}
     */
    #gameInput

    /**
     * @type {GameInputSchema|undefined}
     */
    schema = undefined

    /**
     * @type {GameInputModel|undefined}
     */
    model = undefined

    /**
     * @type {GamepadMapping|undefined}
     */
    mapping = undefined

    /**
     * Current button values
     * @type {GameInputState}
     */
    state = new GameInputState()

    /**
     * @type {{
     *  schema: GameInputSchema|undefined,
     *  model: GameInputModel|undefined,
     *  mapping: GamepadMapping|undefined,
     *  state: GameInputState
     * }}
     */
    previous = {
        schema: undefined,
        model: undefined,
        mapping: undefined,
        state: new GameInputState()
    }

    /**
     * Actions to perform on button down.
     * @type {Map<string, Array<Function>>}
     */
    buttonDownActions = new Map()

    /**
     * Actions to perform on button up.
     * @type {Map<string, Array<Function>>}
     */
    buttonUpActions = new Map()

    /**
     * Constuctor.
     * @param {import('./gameinput.js').GameInput} gameInput Game Input manager
     * @param {number} number Player number (1-based)
     */
    constructor (gameInput, number) {
        this.#gameInput = gameInput
        this.number = number
        this.index = number - 1

        for (const section in GamepadMapping)
            for (const buttonName in GamepadMapping[section]) {
                this.buttonDownActions.set(`${section}.${buttonName}`, [])
                this.buttonUpActions.set(`${section}.${buttonName}`, [])
            }
    }

    updatePrevious () {
        this.previous.schema = this.schema
        this.previous.model = this.model
        this.previous.mapping = this.mapping
        this.previous.state = this.state
        this.state = new GameInputState()
    }

    /**
     * Set player to a specific model.
     * @param {GameInputModel|undefined} model Model to set
     */
    setModel (model) {
        this.schema = model?.schema
        this.model = model
        this.mapping = model?.mapping
    }

    /**
     * Get the player's current gamepad.
     * @returns {Gamepad} the gamepad.
     */
    getGamepad () {
        return this.#gameInput.getGamepad(this.index)
    }

    /**
     * Gets if this player's gamepad has rumble.
     * @returns {boolean} whether it has rumble support
     */
    hasRumble () {
        return !!this.getGamepad()?.vibrationActuator
    }

    /**
     * @typedef {Object} GamepadEffectParams
     * @property {number} [startDelay]      delay time before effect
     * @property {number} [duration]        active time of effect
     * @property {number} [strongMagnitude] strong rumble motor magnitude
     * @property {number} [weakMagnitude]   weak rumble motor magnitude
     */

    /**
     * Rumble the player's gamepad.
     * @param {GamepadEffectParams} gamepadEffectParameters parameters for the rumble
     * @returns {Promise<string>} result promise
     */
    rumble (gamepadEffectParameters = {}) {
        Object.assign({ startDelay: 0, duration: 300, strongMagnitude: 0.5, weakMagnitude: 0.5 }, gamepadEffectParameters)
        const vibrator = this.getGamepad()?.vibrationActuator
        // @ts-ignore
        return vibrator?.playEffect(vibrator?.type ?? 'dual-rumble', gamepadEffectParameters)
    }

    /**
     * Activate 'Button down' actions for this player.
     * @param {import('./gameinput-schema.js').GameInputSchemaSectionName} sectionName  Name of the section
     * @param {import('./gameinput-schema.js').GameInputSchemaButtonName} buttonName   Name of button
     */
    buttonDown (sectionName, buttonName) {
        this.#gameInput.buttonDown(this.index, sectionName, buttonName)
        const actionList = this.buttonDownActions.get(`${sectionName}.${buttonName}`)
        if (actionList)
            for (const action of actionList) action()
    }

    /**
     * Activate 'Button up' actions for this player.
     * @param {import('./gameinput-schema.js').GameInputSchemaSectionName} sectionName  Name of the section
     * @param {import('./gameinput-schema.js').GameInputSchemaButtonName} buttonName   Name of button
     */
    buttonUp (sectionName, buttonName) {
        this.#gameInput.buttonUp(this.index, sectionName, buttonName)
        const actionList = this.buttonUpActions.get(`${sectionName}.${buttonName}`)
        if (actionList)
            for (const action of actionList) action()
    }

    /**
     * Add an action to "button down" events.
     * @param {import('./gameinput-schema.js').GameInputSchemaSectionName} sectionName  Name of the section
     * @param {import('./gameinput-schema.js').GameInputSchemaButtonName} buttonName   Name of button
     * @param {Function} action Action to add.
     */
    onButtonDown (sectionName, buttonName, action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')

        if (!this.buttonDownActions.has(`${sectionName}.${buttonName}`))
            this.buttonDownActions.set(`${sectionName}.${buttonName}`, [])

        this.buttonDownActions.get(`${sectionName}.${buttonName}`).push(action)
    }

    /**
     * Add an action to "button up" events.
     * @param {import('./gameinput-schema.js').GameInputSchemaSectionName} sectionName  Name of the section
     * @param {import('./gameinput-schema.js').GameInputSchemaButtonName} buttonName   Name of button
     * @param {Function} action Action to add.
     */
    onButtonUp (sectionName, buttonName, action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')

        if (!this.buttonUpActions.has(`${sectionName}.${buttonName}`))
            this.buttonUpActions.set(`${sectionName}.${buttonName}`, [])

        this.buttonUpActions.get(`${sectionName}.${buttonName}`).push(action)
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

        let state = this.state[`${stick}Stick`].up
        if (state.item instanceof AxisAsButton) {
            if (state.item.direction === 'negative') {
                vector.y -= state.value < state.item.deadZone ? state.value : 0
            } else {
                vector.y -= state.value > state.item.deadZone ? Math.abs(state.value) : 0
            }
        } else {
            vector.y -= 0.7
        }

        state = this.state[`${stick}Stick`].down
        if (state.item instanceof AxisAsButton) {
            if (state.item.direction === 'negative') {
                vector.y += state.value < state.item.deadZone ? Math.abs(state.value) : 0
            } else {
                vector.y += state.value > state.item.deadZone ? Math.abs(state.value) : 0
            }
        } else {
            vector.y += 0.7
        }

        state = this.state[`${stick}Stick`].left
        if (state.item instanceof AxisAsButton) {
            if (state.item.direction === 'negative') {
                vector.x -= state.value < state.item.deadZone ? Math.abs(state.value) : 0
            } else {
                vector.x -= state.value > state.item.deadZone ? Math.abs(state.value) : 0
            }
        } else {
            vector.x -= 0.7
        }

        state = this.state[`${stick}Stick`].right
        if (state.item instanceof AxisAsButton) {
            if (state.item.direction === 'negative') {
                vector.x += state.value < state.item.deadZone ? Math.abs(state.value) : 0
            } else {
                vector.x += state.value > state.item.deadZone ? Math.abs(state.value) : 0
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

        for (const direction in this.mapping[`${stick}Stick`]) {
            const item = this.mapping[`${stick}Stick`][direction]
            if (item instanceof AxisAsButton) {
                if (item.deadZone > radialDeadZone) {
                    radialDeadZone = item.deadZone
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

        const item = this.state.trigger[trigger]

        if (typeof (item.value) === 'number')
            return item.active ? 1 : 0
        else if (item.item instanceof AxisAsButton)
            return this.#normalize(
                item.value,
                item.item.deadZone,
                1
            )
        throw new Error('item type issue')
    }

    /**
     * Gets the button text.
     * @param   {import('./gameinput-schema.js').GameInputSchemaSectionName}  sectionName        name of the section
     * @param   {import('./gameinput-schema.js').GameInputSchemaButtonName}  buttonName        name of the button or axisValue
     * @param   {boolean} symbolsAsWords    whether or not to convert Ragdoll's "▶ x □ o △" to "start cross square circle triangle"
     * @returns {string}                    button text
     */
    getButtonText (sectionName, buttonName, symbolsAsWords = false) {
        if (!this.model?.schema)
            return ''

        /** @type {string} */
        const text = this.model.schema[sectionName]?.[buttonName]

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
