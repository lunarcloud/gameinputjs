/**
 * @typedef {number|import('./axis-as-button.js').AxisAsButton} SchemaButtonDef
 */

/**
 * Gamepad Button Configuration
 * @class GamepadMapping
 */
class GamepadMapping {
    /**
     *  Constructor
     * @param {SchemaButtonDef|undefined} dpadUp            Dpad Up Definition
     * @param {SchemaButtonDef|undefined} dpadDown          Dpad Down Definition
     * @param {SchemaButtonDef|undefined} dpadLeft          Dpad Left Definition
     * @param {SchemaButtonDef|undefined} dpadRight         Dpad Right Definition
     * @param {SchemaButtonDef|undefined} menu              Menu Button
     * @param {SchemaButtonDef|undefined} button0           Face Button 0 Definition
     * @param {SchemaButtonDef|undefined} button1           Face Button 1 Definition
     * @param {SchemaButtonDef|undefined} button2           Face Button 2 Definition
     * @param {SchemaButtonDef|undefined} button3           Face Button 3 Definition
     * @param {SchemaButtonDef|undefined} leftStickUp       Left Stick Up Definition
     * @param {SchemaButtonDef|undefined} leftStickDown     Left Stick Down Definition
     * @param {SchemaButtonDef|undefined} leftStickLeft     Left Stick Left Definition
     * @param {SchemaButtonDef|undefined} leftStickRight    Left Stick Right Definition
     * @param {SchemaButtonDef|undefined} rightStickUp      Right Stick Up Definition
     * @param {SchemaButtonDef|undefined} rightStickDown    Right Stick Down Definition
     * @param {SchemaButtonDef|undefined} rightStickLeft    Right Stick Left Definition
     * @param {SchemaButtonDef|undefined} rightStickRight   Right Stick Right Definition
     * @param {SchemaButtonDef|undefined} leftShoulder      Left Shoulder Button Definition
     * @param {SchemaButtonDef|undefined} rightShoulder     Right Shoulder Button Definition
     * @param {SchemaButtonDef|undefined} leftTrigger       Left Trigger Definition
     * @param {SchemaButtonDef|undefined} rightTrigger      Right Trigger Definition
     */
    constructor (
        dpadUp = undefined,
        dpadDown = undefined,
        dpadLeft = undefined,
        dpadRight = undefined,
        menu = undefined,
        button0 = undefined,
        button1 = undefined,
        button2 = undefined,
        button3 = undefined,
        leftStickUp = undefined,
        leftStickDown = undefined,
        leftStickLeft = undefined,
        leftStickRight = undefined,
        rightStickUp = undefined,
        rightStickDown = undefined,
        rightStickLeft = undefined,
        rightStickRight = undefined,
        leftShoulder = undefined,
        rightShoulder = undefined,
        leftTrigger = undefined,
        rightTrigger = undefined
    ) {
        this.dpadUp = dpadUp
        this.dpadDown = dpadDown
        this.dpadLeft = dpadLeft
        this.dpadRight = dpadRight
        this.menu = menu
        this.button0 = button0
        this.button1 = button1
        this.button2 = button2
        this.button3 = button3
        this.leftStickUp = leftStickUp
        this.leftStickDown = leftStickDown
        this.leftStickLeft = leftStickLeft
        this.leftStickRight = leftStickRight
        this.rightStickUp = rightStickUp
        this.rightStickDown = rightStickDown
        this.rightStickLeft = rightStickLeft
        this.rightStickRight = rightStickRight
        this.leftShoulder = leftShoulder
        this.rightShoulder = rightShoulder
        this.leftTrigger = leftTrigger
        this.rightTrigger = rightTrigger
    }

    /**
     * Look up def by button name.
     * @param {import('./gamepad-buttons.js').GameInputButton} key button name.
     * @returns {string} button definition
     */
    lookup (key) {
        for (const i in this)
            if (this[i] === key)
                return i
        throw new Error('key not found!')
    }
}

export { GamepadMapping }
