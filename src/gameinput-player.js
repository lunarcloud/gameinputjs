import { GameInputModel } from './gameinput-model.js'
import { GameInputSchema } from './gameinput-schema.js'
import { GameInput } from './gameinput.js'
import { GamepadMapping } from './gamepad-mapping.js'
import { GameInputButtons } from './gamepad-buttons.js'
import { AxisAsButton } from './axis-as-button.js'
import { Vector2 } from './vector2.js'
import { GameInputState } from './gameinput-state.js'

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
     * Current button values
     * @type {GameInputState}
     */
    state = new GameInputState()

    /**
     * @type {{
     *  type: GameInputSchema|undefined,
     *  model: GameInputModel|undefined,
     *  schema: GamepadMapping|undefined,
     *  state: GameInputState
     * }}
     */
    previous = {
        type: undefined,
        model: undefined,
        schema: undefined,
        state: new GameInputState()
    }

    /**
     * Actions to perform on button down.
     * @type {Map<import('./gamepad-buttons.js').GameInputButton, Array<Function>>}
     */
    buttonDownActions = new Map()

    /**
     * Actions to perform on button up.
     * @type {Map<import('./gamepad-buttons.js').GameInputButton, Array<Function>>}
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

        for (const i in GameInputButtons) {
            this.buttonDownActions.set(GameInputButtons[i], [])
            this.buttonUpActions.set(GameInputButtons[i], [])
        }
    }

    updatePrevious () {
        this.previous.type = this.type
        this.previous.model = this.model
        this.previous.schema = this.schema
        this.previous.state = this.state
        this.state = new GameInputState()
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
     * Rumble the player's gamepad.
     * @param {{ duration: number, strongMagnitude: number, weakMagnitude: number }} gamepadEffectParameters parameters for the rumble
     * @returns {Promise<string>} result promise
     */
    rumble (gamepadEffectParameters = { duration: 300, strongMagnitude: 0.5, weakMagnitude: 0.5 }) {
        return this.getGamepad()?.vibrationActuator?.playEffect('dual-rumble', gamepadEffectParameters)
    }

    /**
     * Activate 'Button down' actions for this player.
     * @param {import('./gamepad-buttons.js').GameInputButton} buttonName Name of button
     */
    buttonDown (buttonName) {
        this.#gameInput.buttonDown(this.index, buttonName)
        for (const action in this.buttonDownActions.get(buttonName))
            this.buttonDownActions.get(buttonName)[action]()
    }

    /**
     * Activate 'Button up' actions for this player.
     * @param {import('./gamepad-buttons.js').GameInputButton} buttonName Name of button
     */
    buttonUp (buttonName) {
        this.#gameInput.buttonUp(this.index, buttonName)
        for (const action in this.buttonUpActions.get(buttonName))
            this.buttonUpActions.get(buttonName)[action]()
    }

    /**
     * Add an action to "button down" events.
     * @param {import('./gamepad-buttons.js').GameInputButton} buttonName Name of button
     * @param {Function} action Action to add.
     */
    onButtonDown (buttonName, action) {
        if (buttonName in GameInputButtons === false)
            throw new Error('Must be buttonNames')
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')

        this.buttonDownActions.get(buttonName).push(action)
    }

    /**
     * Add an action to "button up" events.
     * @param {import('./gamepad-buttons.js').GameInputButton} buttonName Name of button
     * @param {Function} action Action to add.
     */
    onButtonUp (buttonName, action) {
        if (buttonName in GameInputButtons === false)
            throw new Error('Must be buttonNames')
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')

        this.buttonUpActions.get(buttonName).push(action)
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

        for (const direction in this.schema[`${stick}Stick`]) {
            const item = this.schema[`${stick}Stick`][direction]
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
     * @param   {import('./gamepad-buttons.js').GameInputButton|string}  buttonName  name of the button or axisValue
     * @param   {boolean} symbolsAsWords            whether or not to convert Ragdoll's "x □ o △" to "cross square circle triangle"
     * @returns {string}                            button text
     */
    getButtonText (buttonName, symbolsAsWords = false) {
        if (!this.model?.type)
            return ''

        const text = this.model.type.buttonNames.get(buttonName)

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
