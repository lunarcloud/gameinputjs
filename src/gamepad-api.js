/**
 * @typedef {number|import('./schema-axis-button.js').SchemaAxisButton} SchemaButtonDef
 */

export default class GamepadAPI {
    /**
     *  Constructor
     * @param {SchemaButtonDef} dpadUp        Dpad Up Definition
     * @param {SchemaButtonDef} dpadDown      Dpad Down Definition
     * @param {SchemaButtonDef} dpadLeft      Dpad Left Definition
     * @param {SchemaButtonDef} dpadRight     Dpad Right Definition
     * @param {SchemaButtonDef} menu        Menu Button
     * @param {SchemaButtonDef} button0     Face Button 0 Definition
     * @param {SchemaButtonDef} button1     Face Button 1 Definition
     * @param {SchemaButtonDef} button2     Face Button 2 Definition
     * @param {SchemaButtonDef} button3     Face Button 3 Definition
     * @param {SchemaButtonDef} leftStickUp        Left Stick Up Definition
     * @param {SchemaButtonDef} leftStickDown      Left Stick Down Definition
     * @param {SchemaButtonDef} leftStickLeft      Left Stick Left Definition
     * @param {SchemaButtonDef} leftStickRight     Left Stick Right Definition
     * @param {SchemaButtonDef} rightStickUp        Right Stick Up Definition
     * @param {SchemaButtonDef} rightStickDown      Right Stick Down Definition
     * @param {SchemaButtonDef} rightStickLeft      Right Stick Left Definition
     * @param {SchemaButtonDef} rightStickRight     Right Stick Right Definition
     * @param {SchemaButtonDef} leftShoulder    Left Shoulder Button Definition
     * @param {SchemaButtonDef} rightShoulder    Right Shoulder Button Definition
     * @param {SchemaButtonDef} leftTrigger   Left Trigger Definition
     * @param {SchemaButtonDef} rightTrigger   Right Trigger Definition
     */
    constructor (
        dpadUp, dpadDown, dpadLeft, dpadRight,
        menu, button0, button1, button2, button3,
        leftStickUp, leftStickDown, leftStickLeft, leftStickRight,
        rightStickUp, rightStickDown, rightStickLeft, rightStickRight,
        leftShoulder, rightShoulder, leftTrigger, rightTrigger) {
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
     * @param {import('./gamepad-schema-names.js').GamepadSchemaName} key button name.
     * @returns {SchemaButtonDef} button definition
     */
    lookup (key) {
        for (const i in this)
            if (this[i] === key)
                return i
        throw new Error('key not found!')
    }
}

export { GamepadAPI }
