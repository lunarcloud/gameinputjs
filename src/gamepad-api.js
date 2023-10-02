/**
 * @typedef {number|import('./schema-axis-button.js').SchemaAxisButton} SchemaButtonDef
 */

export default class GamepadAPI {
    /**
     *  Constructor
     * @param {SchemaButtonDef} d_up        Dpad Up Definition
     * @param {SchemaButtonDef} d_down      Dpad Down Definition
     * @param {SchemaButtonDef} d_left      Dpad Left Definition
     * @param {SchemaButtonDef} d_right     Dpad Right Definition
     * @param {SchemaButtonDef} menu        Menu Button
     * @param {SchemaButtonDef} button0     Face Button 0 Definition
     * @param {SchemaButtonDef} button1     Face Button 1 Definition
     * @param {SchemaButtonDef} button2     Face Button 2 Definition
     * @param {SchemaButtonDef} button3     Face Button 3 Definition
     * @param {SchemaButtonDef} l_up        Left Stick Up Definition
     * @param {SchemaButtonDef} l_down      Left Stick Down Definition
     * @param {SchemaButtonDef} l_left      Left Stick Left Definition
     * @param {SchemaButtonDef} l_right     Left Stick Right Definition
     * @param {SchemaButtonDef} r_up        Right Stick Up Definition
     * @param {SchemaButtonDef} r_down      Right Stick Down Definition
     * @param {SchemaButtonDef} r_left      Right Stick Left Definition
     * @param {SchemaButtonDef} r_right     Right Stick Right Definition
     * @param {SchemaButtonDef} l_button    Left Shoulder Button Definition
     * @param {SchemaButtonDef} r_button    Right Shoulder Button Definition
     * @param {SchemaButtonDef} l_trigger   Left Trigger Definition
     * @param {SchemaButtonDef} r_trigger   Right Trigger Definition
     */
    constructor (
        d_up, d_down, d_left, d_right,
        menu, button0, button1, button2, button3,
        l_up, l_down, l_left, l_right,
        r_up, r_down, r_left, r_right,
        l_button, r_button, l_trigger, r_trigger) {
        this.d_up = d_up
        this.d_down = d_down
        this.d_left = d_left
        this.d_right = d_right
        this.menu = menu
        this.button0 = button0
        this.button1 = button1
        this.button2 = button2
        this.button3 = button3
        this.l_up = l_up
        this.l_down = l_down
        this.l_left = l_left
        this.l_right = l_right
        this.r_up = r_up
        this.r_down = r_down
        this.r_left = r_left
        this.r_right = r_right
        this.l_button = l_button
        this.r_button = r_button
        this.l_trigger = l_trigger
        this.r_trigger = r_trigger
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
    }
}

export { GamepadAPI }
