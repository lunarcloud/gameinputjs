/**
 * @module
 */

import { GamepadMapping } from './gamepad-mapping.js'
import { GameInputModel } from './gameinput-model.js'
import { GameInputSchema, GameInputSchemaSectionNames, GameInputSchemaButtonNames } from './gameinput-schema.js'
import { AxisAsButton } from './axis-as-button.js'
import { GameInputModels } from './gameinput-models.js'
import { GameInputPlayer } from './gameinput-player.js'
import { Vector2 } from './vector2.js'
import { DetectedOS } from './os-detect.js'
import { GameInputOptions } from './gameinput-options.js'
import { GameInputItemState, GameInputState } from './gameinput-state.js'

/**
 * Game Input System
 * @class GameInput
 * @description    System for using a gamepad control scheme for games
 */
class GameInput {
    /**
     * Gamepad Models.
     */
    static Models = {
        UnknownStandardMapping: new GameInputModel(
            GameInputSchema.Hedgehog,
            'generic'),

        Generic: [
            new GameInputModel(
                GameInputSchema.Hedgehog,
                'xboxone',
                'XInput'
            ),
            new GameInputModel(
                GameInputSchema.Hedgehog,
                'xboxone',
                'xinput'
            ),
            new GameInputModel(
                GameInputSchema.Hedgehog,
                'xbox360',
                'XBox 360'
            ),
            new GameInputModel(
                GameInputSchema.Hedgehog,
                'generic',
                'STANDARD GAMEPAD'
            )
        ],

        VendorThemes: [
            // Nintendo devices (vendor ID 057e) get 'Plumber' theme
            // Product ID 0000 is a placeholder - only the vendor ID is used for matching
            new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057e-0000-Nintendo Device'
            ),
            // Microsoft Xbox devices (vendor ID 045e) get 'Hedgehog' theme
            // Product ID 0000 is a placeholder - only the vendor ID is used for matching
            new GameInputModel(
                GameInputSchema.Hedgehog,
                'xboxone',
                '045e-0000-Microsoft Device'
            )
        ],

        Specific: GameInputModels // imported
    }

    /**
     * Maximum number of players/gamepads to support.
     * @type {number}
     */
    #maxPlayers = 4

    /**
     * Get just ASCII text.
     * @param {string} text input text
     * @returns {string} input minus non-ASCII
     */
    static toASCII (text) {
        return text.replace(/[^\x00-\x7F]/g, '') /* eslint-disable-line no-control-regex */
    }

    /**
     * Get if the browser supports the Gamepad API
     * @returns {boolean} if the browser supports the Gamepad API
     */
    static canUseGamepadAPI () {
        return 'getGamepads' in navigator
    }

    /**
     * The players.
     * @type {Array<GameInputPlayer>}
     */
    Players = []

    /**
     * Connection info
     */
    Connection = {
        /**
         * Mapping of player to gamepad index
         */
        GamePadMapping: {},
        /**
         * Cache of actual gamepads.
         * @type {Array<Gamepad>}
         */
        Gamepads: []
    }

    /**
     * Whether to display debug logs.
     * @type {boolean}
     */
    debug = true

    /**
     * Whether we are actively updating.
     * @type {boolean}
     */
    #updateActive = true

    /**
     * Request animation frame ID for update loop.
     * @type {number|undefined}
     */
    #updateLoopFrameId = undefined

    /**
     * Request animation frame ID for connection watch loop.
     * @type {number|undefined}
     */
    #connectionWatchLoopFrameId = undefined

    /**
     * Gamepad connected event handler.
     * @type {((this: Window, ev: GamepadEvent) => any)|undefined}
     */
    #gamepadConnectedHandler = undefined

    /**
     * Gamepad disconnected event handler.
     * @type {((this: Window, ev: GamepadEvent) => any)|undefined}
     */
    #gamepadDisconnectedHandler = undefined

    /**
     * Whether we've received the first button press.
     * @type {Array<boolean>}
     */
    #firstPress = []

    /**
     * Callback providing player index and button name.
     * @typedef {function(number, import('./gameinput-schema.js').GameInputSchemaSectionName, string):void} ButtonActionFunc
     */

    /**
     * Actions to perform on button down.
     * @type {Array<ButtonActionFunc>}
     */
    buttonDownActions = []

    /**
     * Actions to perform on button up.
     * @type {Array<ButtonActionFunc>}
     */
    buttonUpActions = []

    /**
     * Last known gamepads count.
     * @type {number}
     */
    lastCheckedNumberOfGamepads = -1

    /**
     * Actions to perform after players reshuffled.
     * @type {Array<Function>}
     */
    reinitializeActions = []

    /**
     * Constructor.
     * @param {GameInputOptions} options    constructor options
     */
    constructor (options = undefined) {
        this.debug = options?.debugStatements || false

        // Auto-detect max players from browser's gamepad API, with fallback to configured value or 4
        const detectedMax = GameInput.canUseGamepadAPI() ? navigator.getGamepads().length : 0
        this.#maxPlayers = Math.max(options?.maxPlayers ?? 4, detectedMax, 4)

        // Initialize dynamic arrays based on maxPlayers
        this.#initializePlayerArrays(this.#maxPlayers)

        this.startUpdateLoop()

        // Start watching for gamepads joining and leaving
        if (GameInput.canUseGamepadAPI()) {
            if (this.debug)
                console.debug('Gamepad connection loop beginning')
            this.connectionWatchLoop()

            const gameInput = this
            // WARNING: gamepadconnected/gamepaddisconnected events are unreliable across browsers
            // and may not fire consistently. We use polling (connectionWatchLoop) as the primary
            // detection mechanism, with these events only for informational logging.
            this.#gamepadConnectedHandler = function (e) {
                if (gameInput.debug)
                    console.debug('Gamepad connected at index %d: %s. %d buttons, %d axes.',
                        e.gamepad.index, e.gamepad.id,
                        e.gamepad.buttons.length, e.gamepad.axes.length)
            }
            window.addEventListener('gamepadconnected', this.#gamepadConnectedHandler, false)

            this.#gamepadDisconnectedHandler = function (e) {
                if (gameInput.debug)
                    console.debug('Gamepad disconnected from index %d: %s',
                        e.gamepad.index, e.gamepad.id)
            }
            window.addEventListener('gamepaddisconnected', this.#gamepadDisconnectedHandler, false)
        }
    }

    /**
     * Initialize or expand player arrays to support a given number of players.
     * @param {number} count - Number of players to support
     */
    #initializePlayerArrays (count) {
        const currentLength = this.Players.length

        if (count > currentLength) {
            // Expand arrays to support more players
            for (let i = currentLength; i < count; i++) {
                this.Players.push(new GameInputPlayer(this, i + 1))
                this.#firstPress.push(false)
                this.Connection.Gamepads.push(undefined)
                this.Connection.GamePadMapping[i] = i
            }
            this.#maxPlayers = count
        } else if (currentLength === 0) {
            // Initial setup
            this.Players = Array.from(
                { length: count },
                (_, i) => new GameInputPlayer(this, i + 1)
            )
            this.#firstPress = Array(count).fill(false)
            this.Connection.Gamepads = Array(count).fill(undefined)
            for (let i = 0; i < count; i++) {
                this.Connection.GamePadMapping[i] = i
            }
        }
    }

    /**
     * Add action to "reinitialized" events.
     * @param {Function} action Action to add.
     * @returns {Function}      Unsubscribe function to remove this action.
     */
    onReinitialize (action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')
        this.reinitializeActions.push(action)
        return () => {
            const idx = this.reinitializeActions.indexOf(action)
            if (idx !== -1) this.reinitializeActions.splice(idx, 1)
        }
    }

    /**
     * Add an action to "button down" events.
     * @param {ButtonActionFunc} action Action to add.
     * @returns {Function}      Unsubscribe function to remove this action.
     */
    onButtonDown (action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')
        this.buttonDownActions.push(action)
        return () => {
            const idx = this.buttonDownActions.indexOf(action)
            if (idx !== -1) this.buttonDownActions.splice(idx, 1)
        }
    }

    /**
     * Add an action to "button down" events.
     * @param {ButtonActionFunc} action Action to add.
     * @returns {Function}      Unsubscribe function to remove this action.
     */
    onButtonUp (action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')
        this.buttonUpActions.push(action)
        return () => {
            const idx = this.buttonUpActions.indexOf(action)
            if (idx !== -1) this.buttonUpActions.splice(idx, 1)
        }
    }

    /**
     * Activate "button down" events for a particular player.
     * @param {number} player       Player to add action for.
     * @param {import('./gameinput-schema.js').GameInputSchemaSectionName} sectionName  Name of the section
     * @param {import('./gameinput-schema.js').GameInputSchemaButtonName} buttonName   Name of button
     * @returns {GameInput}     self, for chaining statements.
     */
    buttonDown (player, sectionName, buttonName) {
        for (const action in this.buttonDownActions)
            if (typeof (this.buttonDownActions[action]) === 'function')
                this.buttonDownActions[action](player, sectionName, buttonName)
        return this
    }

    /**
     * Activate "button up" events for a particular player.
     * @param {number} player       Player to add action for.
     * @param {import('./gameinput-schema.js').GameInputSchemaSectionName} sectionName  Name of the section
     * @param {import('./gameinput-schema.js').GameInputSchemaButtonName} buttonName   Name of button
     * @returns {GameInput}     self, for chaining statements.
     */
    buttonUp (player, sectionName, buttonName) {
        for (const action in this.buttonUpActions)
            if (typeof (this.buttonUpActions[action]) === 'function')
                this.buttonUpActions[action](player, sectionName, buttonName)
        return this
    }

    /**
     * Get player for gamepad number.
     * @param {number} index gamepad index
     * @returns {GameInputPlayer} Player
     */
    getPlayer (index) {
        if (index < 0 || index >= this.#maxPlayers)
            throw new Error(`Index out of the 0-${this.#maxPlayers - 1} range!`)
        return this.Players[this.Connection.GamePadMapping[index]]
    }

    /**
     * Get gamepad for a player.
     * @param {number} player player index
     * @returns {Gamepad} Player's gamepad
     */
    getGamepad (player) {
        if (player < 0 || player >= this.#maxPlayers)
            throw new Error(`Index out of the 0-${this.#maxPlayers - 1} range!`)
        return this.Connection.Gamepads[this.Connection.GamePadMapping[player]]
    }

    /**
     * Start the update loop.
     */
    startUpdateLoop () {
        this.#updateActive = true
        this.#nextUpdateLoop()
    };

    /**
     * Stop the update loop.
     */
    stopUpdateLoop () {
        this.#updateActive = false
        if (this.#updateLoopFrameId !== undefined) {
            cancelAnimationFrame(this.#updateLoopFrameId)
            this.#updateLoopFrameId = undefined
        }
    };

    /**
     * Clean up and destroy this GameInput instance.
     * Stops all loops, removes all event listeners, and clears all references.
     * This should be called when the GameInput instance is no longer needed to prevent memory leaks.
     * @returns {void}
     */
    destroy () {
        // Stop the update loop
        this.stopUpdateLoop()

        // Stop the connection watch loop
        if (this.#connectionWatchLoopFrameId !== undefined) {
            cancelAnimationFrame(this.#connectionWatchLoopFrameId)
            this.#connectionWatchLoopFrameId = undefined
        }

        // Remove window event listeners
        if (this.#gamepadConnectedHandler) {
            window.removeEventListener('gamepadconnected', this.#gamepadConnectedHandler, false)
            this.#gamepadConnectedHandler = undefined
        }
        if (this.#gamepadDisconnectedHandler) {
            window.removeEventListener('gamepaddisconnected', this.#gamepadDisconnectedHandler, false)
            this.#gamepadDisconnectedHandler = undefined
        }

        // Clear all event listener arrays
        this.buttonDownActions = []
        this.buttonUpActions = []
        this.reinitializeActions = []

        // Clear player references
        for (const player of this.Players) {
            player.setModel(undefined)
        }

        // Clear connection references
        this.Connection.Gamepads = Array(this.#maxPlayers).fill(undefined)
    }

    /**
     * Perform the next update and loop.
     */
    #nextUpdateLoop () {
        if (this.#updateActive === false)
            return

        this.update()
        // Note: requestAnimationFrame is throttled to ~60fps which may be slower than
        // gamepad polling rate. For higher-frequency polling, consider using a custom interval.
        this.#updateLoopFrameId = requestAnimationFrame(() => this.#nextUpdateLoop())
    }

    /**
     * Gamepad state update.
     */
    update () {
        if (!GameInput.canUseGamepadAPI())
            return

        this.Connection.Gamepads = navigator.getGamepads()

        for (let i = 0; i < this.Connection.Gamepads.length; i++) {
            const player = this.Players[i]
            const currentGamepad = this.Connection.Gamepads[this.Connection.GamePadMapping[i]]

            player.updatePrevious()

            if (typeof (currentGamepad) === 'undefined' || currentGamepad === null || !player.model)
                continue

            for (const sectionName in GameInputSchemaSectionNames) {
                for (const itemName in GameInputSchemaButtonNames) {
                    /** @type {import('./gamepad-mapping.js').SchemaButtonDef} */
                    const buttonDef = player.mapping[sectionName]?.[itemName]
                    if (buttonDef === undefined) continue

                    /** @type {GameInputItemState} */
                    if (!player.state[sectionName][itemName]) {
                        player.state[sectionName][itemName] = new GameInputItemState(buttonDef)
                    }
                    const state = player.state[sectionName][itemName]

                    // Check if buttonDef is an axis-based button (AxisAsButton or CombinedAxisToButton)
                    // We use duck typing (checking for 'test' method) instead of instanceof because
                    // it's more robust and avoids TypeScript type checking issues with the class hierarchy
                    if (typeof buttonDef === 'object' && buttonDef !== null && typeof buttonDef.test === 'function') {
                        state.value = currentGamepad.axes[buttonDef.index]
                        state.active = buttonDef.test(state.value)
                    } else {
                        // buttonDef is a number (button index)
                        state.active = currentGamepad.buttons[/** @type {number} */ (buttonDef)]?.pressed ?? false
                        state.value = state.active ? 1 : 0
                    }
                }
            }
        }

        // Button down / up
        for (const player of this.Players) {
            for (const sectionName in player.state) {
                for (const itemName in player.state[sectionName]) {
                    if (!this.#firstPress[player.index]) {
                        this.#firstPress[player.index] = true
                        return
                    }

                    if (player.previous.state[sectionName][itemName]?.active === false &&
                        player.state[sectionName][itemName]?.active === true) {
                        // @ts-ignore
                        player.buttonDown(sectionName, itemName)
                    } else if (player.previous.state[sectionName][itemName]?.active === true &&
                        player.state[sectionName][itemName]?.active === false) {
                        // @ts-ignore
                        player.buttonUp(sectionName, itemName)
                    }
                }
            }
        }
    }

    /**
     * Get the number of gamepads.
     * @returns {number} count of gamepads
     */
    static gamepadsCount () {
        return navigator.getGamepads().filter(Boolean).length
    }

    /**
     * Loop that looks for gamepad updates
     */
    connectionWatchLoop () {
        const currentNumberOfGamepads = GameInput.gamepadsCount()

        if (this.lastCheckedNumberOfGamepads !== currentNumberOfGamepads) {
            if (this.debug)
                console.debug('Now have ' + currentNumberOfGamepads + ' gamepad(s).')

            this.lastCheckedNumberOfGamepads = currentNumberOfGamepads
            this.reinitialize()
        }

        this.#connectionWatchLoopFrameId = requestAnimationFrame(() => this.connectionWatchLoop())
    }

    /**
     * Setup gamepads info.
     */
    reinitialize () {
        if (GameInput.canUseGamepadAPI()) {
            const gamepads = navigator.getGamepads()

            // Dynamically expand player arrays if more gamepads are detected
            if (gamepads.length > this.#maxPlayers) {
                this.#initializePlayerArrays(gamepads.length)
            }

            this.Connection.Gamepads = gamepads
        }

        // clear gamepad information
        for (const player of this.Players)
            player.setModel(undefined)

        if (GameInput.canUseGamepadAPI()) {
            for (let i = 0; i < this.Players.length; i++)
                if (this.Connection.Gamepads.filter(Boolean).length === 0)
                    this.#firstPress[i] = false

            for (const i in this.Connection.Gamepads) {
                if (this.Connection.Gamepads[i] instanceof Gamepad) {
                    const player = this.Players[i]

                    // Translate into Type -  Players order is gamepad order
                    for (const gamepad of GameInput.Models.Specific) {
                        if (GameInput.toASCII(gamepad.id) === GameInput.toASCII(this.Connection.Gamepads[i].id) && [DetectedOS, undefined].includes(gamepad.os)) {
                            player.setModel(gamepad)

                            if (this.debug) {
                                console.debug('Gamepad of type ' + player.schema.name + ' configured')
                            }
                            break
                        }
                    }

                    if (typeof (player.model) === 'undefined') {
                        for (const gamepad of GameInput.Models.Generic) {
                            if (this.Connection.Gamepads[i].id.match(gamepad.id) !== null) {
                                player.setModel(gamepad)
                                if (this.debug) {
                                    console.debug('Gamepad of type ' + player.schema.name + ' configured')
                                }
                            }
                        }

                        // Try vendor-based theme matching if still not found
                        if (typeof (player.model) === 'undefined') {
                            for (const vendorTheme of GameInput.Models.VendorThemes) {
                                if (vendorTheme.matchesVendor(this.Connection.Gamepads[i].id)) {
                                    player.setModel(vendorTheme)
                                    if (this.debug) {
                                        console.debug('Gamepad matched vendor theme ' + player.schema.name + ' for vendor ' + vendorTheme.VendorId)
                                    }
                                    break
                                }
                            }
                        }

                        if (this.Connection.Gamepads[i] instanceof Gamepad && typeof (player.model) === 'undefined') {
                            if (this.debug) {
                                if (this.Connection.Gamepads[i].mapping === 'standard') {
                                    console.debug('Gamepad not detected, detected "standard" mapping: "' + this.Connection.Gamepads[i].id + '"')
                                } else {
                                    console.debug('Gamepad not detected, forcing "standard" mapping: "' + this.Connection.Gamepads[i].id + '"')
                                }
                            }

                            player.setModel(GameInput.Models.UnknownStandardMapping)

                            if (this.debug) {
                                console.debug('Gamepad of type ' + player.schema.name + ' configured')
                            }
                        }
                    }

                    // blank state to start
                    player.state = new GameInputState()

                    // setup Previous as current
                    player.updatePrevious()
                }
            }
        } else if (this.debug) {
            console.debug('This browser does not support the Gamepad API')
        }

        // Pause Game or similar
        setTimeout(
            () => this.reinitializeActions.forEach(action => action()),
            100
        )
    }
}

/**
 * Export everything but GameInputModels (because it's inside GameInput already)
 */
export {
    GameInput, GamepadMapping, GameInputModel, GameInputSchema, AxisAsButton,
    GameInputPlayer, Vector2, DetectedOS, GameInputSchemaSectionNames, GameInputSchemaButtonNames
}
