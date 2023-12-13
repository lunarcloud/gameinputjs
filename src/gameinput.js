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

        Specific: GameInputModels // imported
    }

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
    Players = [
        new GameInputPlayer(this, 1),
        new GameInputPlayer(this, 2),
        new GameInputPlayer(this, 3),
        new GameInputPlayer(this, 4)
    ]

    /**
     * Connection info
     */
    Connection = {
        /**
         * Mapping of player to gamepad index
         */
        GamePadMapping: {
            0: 0,
            1: 1,
            2: 2,
            3: 3
        },
        /**
         * Cache of actual gamepads.
         * @type {Array<Gamepad>}
         */
        Gamepads: [undefined, undefined, undefined, undefined]
    }

    /**
     * Whether to display debug logs.
     * @type {boolean}
     */
    debug = true

    /**
     * Whether are actively updating.
     * @type {boolean}
     */
    #updateActive = true

    /**
     * Whether we've received the first button press.
     * @type {Array<boolean>}
     */
    #firstPress = [undefined, undefined, undefined, undefined]

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

        this.startUpdateLoop()

        // Start watching for gamepads joining and leaving
        if (GameInput.canUseGamepadAPI()) {
            if (this.debug)
                console.debug('Gamepad connection loop beginning')
            this.connectionWatchLoop()

            const gameInput = this
            // warning, these are very unreliable!
            window.addEventListener('gamepadconnected', function (e) {
                if (gameInput.debug)
                    console.debug('Gamepad connected at index %d: %s. %d buttons, %d axes.',
                        e.gamepad.index, e.gamepad.id,
                        e.gamepad.buttons.length, e.gamepad.axes.length)
            }, false)

            window.addEventListener('gamepaddisconnected', function (e) {
                if (gameInput.debug)
                    console.debug('Gamepad disconnected from index %d: %s',
                        e.gamepad.index, e.gamepad.id)
            }, false)
        }
    }

    /**
     * Add action to "reinitialized" events.
     * @param {Function} action Action to add.
     * @returns {GameInput}     self, for chaining statements.
     */
    onReinitialize (action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')
        this.reinitializeActions.push(action)
        return this
    }

    /**
     * Add an action to "button down" events.
     * @param {ButtonActionFunc} action Action to add.
     * @returns {GameInput}     self, for chaining statements.
     */
    onButtonDown (action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')
        this.buttonDownActions.push(action)
        return this
    }

    /**
     * Add an action to "button down" events.
     * @param {ButtonActionFunc} action Action to add.
     * @returns {GameInput}     self, for chaining statements.
     */
    onButtonUp (action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')
        this.buttonUpActions.push(action)
        return this
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
        if (index < 0 || index > 3)
            throw new Error('Index out of the 0-3 range!')
        return this.Players[this.Connection.GamePadMapping[index]]
    }

    /**
     * Get gamepad for a player.
     * @param {number} player player index
     * @returns {Gamepad} Player's gamepad
     */
    getGamepad (player) {
        if (player < 0 || player > 3)
            throw new Error('Index out of the 0-3 range!')
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
    };

    /**
     * Perform the next update and loop.
     */
    #nextUpdateLoop () {
        if (this.#updateActive === false)
            return

        this.update()
        requestAnimationFrame(() => this.#nextUpdateLoop()) // way too slow!
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

                    if (buttonDef instanceof AxisAsButton) {
                        state.value = currentGamepad.axes[buttonDef.index]
                        state.active = (state.value >= buttonDef.threshold && buttonDef.direction === 'positive') ||
                                        (state.value <= buttonDef.threshold && buttonDef.direction === 'negative')
                    } else {
                        state.active = currentGamepad.buttons[buttonDef]?.pressed ?? false
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

        requestAnimationFrame(() => this.connectionWatchLoop())
    }

    /**
     * Setup gamepads info.
     */
    reinitialize () {
        // clear gamepad information
        for (const player of this.Players)
            player.setModel(undefined)

        if (GameInput.canUseGamepadAPI()) {
            this.Connection.Gamepads = navigator.getGamepads()

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

                        if (this.Connection.Gamepads[i] instanceof Gamepad && typeof (player.model) === 'undefined') {
                            if (this.debug) {
                                if (this.Connection.Gamepads[i].mapping === 'standard') {
                                    console.debug('Gamepad not detected, detected "stardard" mapping: "' + this.Connection.Gamepads[i].id + '"')
                                } else {
                                    console.debug('Gamepad not detected, forcing "stardard" mapping: "' + this.Connection.Gamepads[i].id + '"')
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
