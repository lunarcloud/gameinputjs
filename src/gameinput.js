import { GamepadMapping } from './gamepad-mapping.js'
import { GameInputModel } from './gameinput-model.js'
import { GameInputSchema } from './gameinput-schema.js'
import { AxisAsButton } from './axis-as-button.js'
import { GameInputModels } from './gameinput-models.js'
import { GameInputPlayer } from './gameinput-player.js'
import { GamepadMappingKeys } from './gamepad-mapping-keys.js'
import { Vector2 } from './vector2.js'
import { DetectedOS, DetectedBrowser } from './os-detect.js'
import { StardardGamepadMapping } from './standard-gamepad-mapping.js'
/**
 * @module GameInput
 */

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
                'xbox360',
                'XInput'
            ),
            new GameInputModel(
                GameInputSchema.Hedgehog,
                'xbox360',
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
                'Logitech Rumblepad 2',
                undefined,
                new GamepadMapping(
                    12, 13, 14, 15,
                    10,
                    2, 3, 1, 4,
                    new AxisAsButton(-2),
                    new AxisAsButton(2),
                    new AxisAsButton(-1),
                    new AxisAsButton(1),
                    new AxisAsButton(-4),
                    new AxisAsButton(4),
                    new AxisAsButton(-3),
                    new AxisAsButton(3)//,
                    // TODO leftShoulder,
                    // TODO rightShoulder,
                    // TODO leftTrigger,
                    // TODO rightTrigger
                )),
            new GameInputModel(
                GameInputSchema.Hedgehog,
                'generic',
                'Logitech Dual Action',
                undefined,
                new GamepadMapping(
                    12, 13, 14, 15,
                    10,
                    2, 3, 1, 4,
                    new AxisAsButton(-2),
                    new AxisAsButton(2),
                    new AxisAsButton(-1),
                    new AxisAsButton(1),
                    new AxisAsButton(-4),
                    new AxisAsButton(4),
                    new AxisAsButton(-3),
                    new AxisAsButton(3)//,
                    // TODO leftShoulder,
                    // TODO rightShoulder,
                    // TODO leftTrigger,
                    // TODO rightTrigger
                )),
            new GameInputModel(
                GameInputSchema.Hedgehog,
                'generic',
                'STANDARD GAMEPAD',
                undefined,
                StardardGamepadMapping
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

    Connection = {
        GamePadMapping: {
            0: 0,
            1: 1,
            2: 2,
            3: 3
        },
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
     */
    firstPress = false

    /**
     * Actions to perform on button down.
     * @type {Array<Function>}
     */
    buttonDownActions = []

    /**
     * Actions to perform on button up.
     * @type {Array<Function>}
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
    reshufflePlayersActions = []

    /**
     * Constructor.
     */
    constructor () {
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
     * Add an action to "reshuffle players" events.
     * @param {Function} action Action to add.
     */
    onReshufflePlayers (action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')
        this.reshufflePlayersActions.push(action)
    }

    /**
     * Add an action to "button down" events.
     * @param {Function} action Action to add.
     */
    onButtonDown (action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')
        this.buttonDownActions.push(action)
    }

    /**
     * Add an action to "button down" events.
     * @param {Function} action Action to add.
     */
    onButtonUp (action) {
        if (typeof (action) !== 'function')
            throw new Error('Action must be a function')
        this.buttonUpActions.push(action)
    }

    /**
     * Activate "button down" events for a particular player.
     * @param {number} player       Player to add action for.
     * @param {import('./gamepad-mapping-keys.js').GamepadMappingKey} schemaName   Button Name
     */
    buttonDown (player, schemaName) {
        for (const action in this.buttonDownActions)
            if (typeof (this.buttonDownActions[action]) === 'function')
                this.buttonDownActions[action](player, schemaName)
    }

    /**
     * Activate "button up" events for a particular player.
     * @param {number} player       Player to add action for.
     * @param {import('./gamepad-mapping-keys.js').GamepadMappingKey} schemaName   Button Name
     */
    buttonUp (player, schemaName) {
        for (const action in this.buttonUpActions)
            if (typeof (this.buttonUpActions[action]) === 'function')
                this.buttonUpActions[action](player, schemaName)
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
            this.Players[i].previous.state = this.Players[i].state
            this.Players[i].state = {}
            this.Players[i].previous.analog = this.Players[i].analog
            this.Players[i].analog = {}

            const currentGamepad = this.Connection.Gamepads[i]
            const currentSchema = this.Players[i].schema

            if (typeof (currentGamepad) === 'undefined' || currentGamepad === null) continue

            for (const j in currentSchema) {
                if (typeof (currentSchema[j]) === 'undefined') {
                    // skip
                } else if (typeof (currentGamepad.buttons[currentSchema[j] - 1]) === 'undefined') {
                    const negativeAxis = currentSchema[j].threshold < 0

                    const axisValue = this.Players[i].analog[j] = currentGamepad.axes[currentSchema[j].index - 1]

                    this.Players[i].state[j] = (negativeAxis && axisValue < currentSchema[j].threshold) || (!negativeAxis && axisValue > currentSchema[j].threshold)
                } else {
                    this.Players[i].state[j] = currentGamepad.buttons[currentSchema[j] - 1].pressed

                    this.Players[i].analog[j] = this.Players[i].state[j] ? 1 : 0
                }
            }
        }

        // Keydown / Keyup
        for (let i = 0; i < this.Players.length; i++) {
            for (const j in this.Players[i].state) {
                if (!this.firstPress) {
                    this.firstPress = true
                    return
                }

                if (this.Players[i].previous.state[j] === false &&
                    this.Players[i].state[j] === true) {
                    // @ts-ignore
                    this.Players[i].buttonDown(j)
                } else if (this.Players[i].previous.state[j] === true &&
                    this.Players[i].state[j] === false) {
                    // @ts-ignore
                    this.Players[i].buttonUp(j)
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
            this.initialGamePadSetup()
        }

        requestAnimationFrame(() => this.connectionWatchLoop())
    }

    /**
     * Setup gamepads info.
     */
    initialGamePadSetup () {
        // clear gamepad information
        for (let i = 0; i < this.Players.length; i++) {
            this.Players[i].setModel(undefined)
        }

        if (GameInput.canUseGamepadAPI()) {
            this.Connection.Gamepads = navigator.getGamepads()

            if (this.Connection.Gamepads.filter(Boolean).length === 0) {
                this.firstPress = false
            }

            for (const i in this.Connection.Gamepads) {
                if (this.Connection.Gamepads[i] instanceof Gamepad) {
                    // Translate into Type -  Players order is gamepad order
                    for (const gamepad of GameInput.Models.Specific) {
                        if (GameInput.toASCII(gamepad.id) === GameInput.toASCII(this.Connection.Gamepads[i].id) &&
                            DetectedOS === gamepad.os) {
                            this.Players[i].setModel(gamepad)

                            if (this.debug) {
                                console.debug('Gamepad of type ' + this.Players[i].type.name + ' configured')
                            }
                            break
                        }
                    }

                    if (typeof (this.Players[i].model) === 'undefined') {
                        for (const gamepad of GameInput.Models.Generic) {
                            if (this.Connection.Gamepads[i].id.match(gamepad.id) !== null) {
                                this.Players[i].setModel(gamepad)
                                if (this.debug) {
                                    console.debug('Gamepad of type ' + this.Players[i].type.name + ' configured')
                                }
                            }
                        }

                        if (this.Connection.Gamepads[i] instanceof Gamepad && typeof (this.Players[i].model) === 'undefined') {
                            if (this.debug) {
                                if (this.Connection.Gamepads[i].mapping === 'standard') {
                                    console.debug('Gamepad not detected, detected "stardard" mapping: "' + this.Connection.Gamepads[i].id + '"')
                                } else {
                                    console.debug('Gamepad not detected, forcing "stardard" mapping: "' + this.Connection.Gamepads[i].id + '"')
                                }
                            }

                            this.Players[i].setModel(GameInput.Models.UnknownStandardMapping)

                            if (this.debug) {
                                console.debug('Gamepad of type ' + this.Players[i].type.name + ' configured')
                            }
                        }
                    }

                    // blank state to start
                    this.Players[i].state = {}
                    this.Players[i].analog = {}

                    // setup Previous as current
                    this.Players[i].previous.type = this.Players[i].type
                    this.Players[i].previous.model = this.Players[i].model
                    this.Players[i].previous.schema = this.Players[i].schema
                    this.Players[i].previous.state = this.Players[i].state
                    this.Players[i].previous.analog = this.Players[i].analog
                }
            }
        } else if (this.debug) {
            console.debug('This browser does not support the Gamepad API')
        }

        // Pause Game or similar
        for (let i = 0; i < this.reshufflePlayersActions.length; i++) {
            if (typeof (this.reshufflePlayersActions[i]) === 'function')
                this.reshufflePlayersActions[i]()
        }
    }
}

/**
 * Export everything but GameInputModels (because it's inside GameInput already)
 */
export {
    GameInput, GamepadMapping, GameInputModel, GameInputSchema, AxisAsButton,
    GameInputPlayer, GamepadMappingKeys, Vector2, DetectedOS, DetectedBrowser
}
