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
     * Runtime deadzone overrides per axis.
     * Keys are in format: 'leftStick.x', 'leftStick.y', 'rightStick.x', 'rightStick.y', 'trigger.left', 'trigger.right'
     * @type {Map<string, number>}
     */
    #deadzoneOverrides = new Map()

    /**
     * Default deadzone for all axes (if no specific override is set).
     * @type {number|undefined}
     */
    #defaultDeadzone = undefined

    /**
     * Constructor.
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
        gamepadEffectParameters = Object.assign({ startDelay: 0, duration: 300, strongMagnitude: 0.5, weakMagnitude: 0.5 }, gamepadEffectParameters)
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
            const runtimeDeadzone = this.#getRuntimeDeadzone(stick, 'y')
            // Runtime deadzones are unsigned, so apply the sign from the direction
            const effectiveDeadzone = runtimeDeadzone !== undefined
                ? (state.item.direction === 'negative' ? -1 : 1) * runtimeDeadzone
                : state.item.deadZone
            const normalized = this.#normalizeAxisWithDeadzone(
                state.value,
                effectiveDeadzone,
                state.item.direction === 'negative' ? -1 : 1
            )
            vector.y -= state.item.direction === 'negative' ? normalized : Math.abs(normalized)
        } else {
            vector.y -= 0.7
        }

        state = this.state[`${stick}Stick`].down
        if (state.item instanceof AxisAsButton) {
            const runtimeDeadzone = this.#getRuntimeDeadzone(stick, 'y')
            const effectiveDeadzone = runtimeDeadzone !== undefined
                ? (state.item.direction === 'negative' ? -1 : 1) * runtimeDeadzone
                : state.item.deadZone
            const normalized = this.#normalizeAxisWithDeadzone(
                state.value,
                effectiveDeadzone,
                state.item.direction === 'negative' ? -1 : 1
            )
            vector.y += Math.abs(normalized)
        } else {
            vector.y += 0.7
        }

        state = this.state[`${stick}Stick`].left
        if (state.item instanceof AxisAsButton) {
            const runtimeDeadzone = this.#getRuntimeDeadzone(stick, 'x')
            const effectiveDeadzone = runtimeDeadzone !== undefined
                ? (state.item.direction === 'negative' ? -1 : 1) * runtimeDeadzone
                : state.item.deadZone
            const normalized = this.#normalizeAxisWithDeadzone(
                state.value,
                effectiveDeadzone,
                state.item.direction === 'negative' ? -1 : 1
            )
            vector.x -= Math.abs(normalized)
        } else {
            vector.x -= 0.7
        }

        state = this.state[`${stick}Stick`].right
        if (state.item instanceof AxisAsButton) {
            const runtimeDeadzone = this.#getRuntimeDeadzone(stick, 'x')
            const effectiveDeadzone = runtimeDeadzone !== undefined
                ? (state.item.direction === 'negative' ? -1 : 1) * runtimeDeadzone
                : state.item.deadZone
            const normalized = this.#normalizeAxisWithDeadzone(
                state.value,
                effectiveDeadzone,
                state.item.direction === 'negative' ? -1 : 1
            )
            vector.x += Math.abs(normalized)
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
                // Get runtime deadzone if available
                let effectiveDeadzone = Math.abs(item.deadZone)

                // Check for runtime override based on direction
                if (direction === 'up' || direction === 'down') {
                    const runtimeDeadzone = this.#getRuntimeDeadzone(stick, 'y')
                    if (runtimeDeadzone !== undefined) {
                        effectiveDeadzone = runtimeDeadzone
                    }
                } else if (direction === 'left' || direction === 'right') {
                    const runtimeDeadzone = this.#getRuntimeDeadzone(stick, 'x')
                    if (runtimeDeadzone !== undefined) {
                        effectiveDeadzone = runtimeDeadzone
                    }
                }

                if (effectiveDeadzone > radialDeadZone) {
                    radialDeadZone = effectiveDeadzone
                }
            }
        }

        if (stickInput.magnitude() < radialDeadZone) {
            return new Vector2(0, 0)
        } else {
            // Normalize to unit vector and scale by deadzone-adjusted magnitude
            // Formula matches reference: (d - dead) / (1 - dead), clamped to [0, 1]
            const scaledMagnitude = Math.min((stickInput.magnitude() - radialDeadZone) / (1 - radialDeadZone), 1)
            return stickInput.normalize().scale(scaledMagnitude)
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
     * Normalize an axis value with deadzone.
     * @param {number} value - The raw axis value
     * @param {number} deadzone - The signed deadzone threshold
     * @param {number} max - The maximum value (typically 1.0 or -1.0)
     * @returns {number} The normalized value with deadzone applied
     */
    #normalizeAxisWithDeadzone (value, deadzone, max) {
        const absValue = Math.abs(value)
        const absDeadzone = Math.abs(deadzone)
        const absMax = Math.abs(max)

        // If within deadzone, return 0
        if (absValue <= absDeadzone) {
            return 0
        }

        // Normalize to [0, absMax] range after deadzone
        // Formula: (value - deadzone) / (max - deadzone)
        const normalized = (absValue - absDeadzone) / (absMax - absDeadzone)

        // Clamp to [0, 1] to ensure we don't exceed bounds
        const clamped = Math.min(normalized, 1)

        return value < 0 ? -clamped : clamped
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
        else if (item.item instanceof AxisAsButton) {
            // Get runtime deadzone if available
            const runtimeDeadzone = this.#deadzoneOverrides.get(`trigger.${trigger}`) ?? this.#defaultDeadzone
            const effectiveDeadzone = runtimeDeadzone ?? item.item.deadZone

            return this.#normalize(
                item.value,
                effectiveDeadzone,
                1
            )
        }
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

    /**
     * Set deadzone for an axis or stick.
     * @param {string} path - Path to axis (e.g., 'leftStick', 'leftStick.x', 'leftStick.y', 'rightStick', 'rightStick.x', 'rightStick.y', 'trigger.left', 'trigger.right')
     * @param {number} value - Deadzone value (0.0 to 1.0)
     * @throws {Error} If path is invalid or value is out of range
     */
    setDeadzone (path, value) {
        if (typeof value !== 'number' || value < 0 || value > 1) {
            throw new Error('Deadzone value must be a number between 0 and 1')
        }

        // Parse the path
        const parts = path.split('.')

        if (parts.length === 1) {
            // Setting deadzone for entire stick (e.g., 'leftStick' or 'rightStick')
            if (parts[0] === 'leftStick' || parts[0] === 'rightStick') {
                // Set for all 4 directions (x, y, up, down, left, right)
                this.#deadzoneOverrides.set(`${parts[0]}.x`, value)
                this.#deadzoneOverrides.set(`${parts[0]}.y`, value)
            } else if (parts[0] === 'trigger') {
                // Setting for both triggers
                this.#deadzoneOverrides.set('trigger.left', value)
                this.#deadzoneOverrides.set('trigger.right', value)
            } else {
                throw new Error(`Invalid path: ${path}. Expected 'leftStick', 'rightStick', or 'trigger'`)
            }
        } else if (parts.length === 2) {
            // Setting deadzone for specific axis (e.g., 'leftStick.x', 'trigger.left')
            const [section, axis] = parts

            if ((section === 'leftStick' || section === 'rightStick') && (axis === 'x' || axis === 'y')) {
                this.#deadzoneOverrides.set(path, value)
            } else if (section === 'trigger' && (axis === 'left' || axis === 'right')) {
                this.#deadzoneOverrides.set(path, value)
            } else {
                throw new Error(`Invalid path: ${path}. Expected format like 'leftStick.x', 'leftStick.y', 'rightStick.x', 'rightStick.y', 'trigger.left', or 'trigger.right'`)
            }
        } else {
            throw new Error(`Invalid path: ${path}`)
        }
    }

    /**
     * Get the current deadzone for an axis or stick.
     * @param {string} path - Path to axis (e.g., 'leftStick', 'leftStick.x', 'rightStick.y', 'trigger.left')
     * @returns {number|undefined} Current deadzone value, or undefined if not set
     */
    getDeadzone (path) {
        const parts = path.split('.')

        if (parts.length === 1) {
            // Getting deadzone for entire stick
            if (parts[0] === 'leftStick' || parts[0] === 'rightStick') {
                // Return x-axis deadzone as representative (they should be the same if set at stick level)
                return this.#deadzoneOverrides.get(`${parts[0]}.x`) ?? this.#defaultDeadzone
            } else if (parts[0] === 'trigger') {
                // Return left trigger deadzone as representative
                return this.#deadzoneOverrides.get('trigger.left') ?? this.#defaultDeadzone
            }
        } else if (parts.length === 2) {
            // Getting deadzone for specific axis
            return this.#deadzoneOverrides.get(path) ?? this.#defaultDeadzone
        }

        return undefined
    }

    /**
     * Reset deadzone overrides for an axis or stick.
     * @param {string} [path] - Path to axis. If not provided, resets all overrides.
     */
    resetDeadzone (path) {
        if (!path) {
            // Reset all overrides
            this.#deadzoneOverrides.clear()
            this.#defaultDeadzone = undefined
            return
        }

        const parts = path.split('.')

        if (parts.length === 1) {
            // Reset entire stick
            if (parts[0] === 'leftStick' || parts[0] === 'rightStick') {
                this.#deadzoneOverrides.delete(`${parts[0]}.x`)
                this.#deadzoneOverrides.delete(`${parts[0]}.y`)
            } else if (parts[0] === 'trigger') {
                this.#deadzoneOverrides.delete('trigger.left')
                this.#deadzoneOverrides.delete('trigger.right')
            }
        } else if (parts.length === 2) {
            // Reset specific axis
            this.#deadzoneOverrides.delete(path)
        }
    }

    /**
     * Get runtime deadzone for a specific axis button item.
     * @param {'left'|'right'} stick - Stick side
     * @param {'x'|'y'} axis - Axis name
     * @returns {number|undefined} Runtime deadzone override, or undefined if not set
     */
    #getRuntimeDeadzone (stick, axis) {
        const path = `${stick}Stick.${axis}`
        return this.#deadzoneOverrides.get(path) ?? this.#defaultDeadzone
    }
};
