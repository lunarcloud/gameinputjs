/**
 * GameInput Constructor Options.
 */
class GameInputOptions {
    /**
     * Whether to print debug statements from the library.
     * @type {boolean}
     */
    debugStatements = false

    /**
     * Maximum number of players/gamepads to support.
     * Defaults to 4 for backward compatibility.
     * Modern browsers can support more via navigator.getGamepads().
     * @type {number}
     */
    maxPlayers = 4
}

export { GameInputOptions }
