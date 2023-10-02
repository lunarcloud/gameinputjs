/**
 * @typedef {number|SchemaAxisButton} SchemaButtonDef
 */

export default class GamepadAPI {
    /**
     *  Constructor
     * @param {string|undefined} name Name of Schema
     * @param {SchemaButtonDef} d_up
     * @param {SchemaButtonDef} d_down
     * @param {SchemaButtonDef} d_left
     * @param {SchemaButtonDef} d_right
     * @param {SchemaButtonDef} menu
     * @param {SchemaButtonDef} button0
     * @param {SchemaButtonDef} button1
     * @param {SchemaButtonDef} button2
     * @param {SchemaButtonDef} button3
     * @param {SchemaButtonDef} l_up
     * @param {SchemaButtonDef} l_down
     * @param {SchemaButtonDef} l_left
     * @param {SchemaButtonDef} l_right
     * @param {SchemaButtonDef} r_up
     * @param {SchemaButtonDef} r_down
     * @param {SchemaButtonDef} r_left
     * @param {SchemaButtonDef} r_right
     * @param {SchemaButtonDef} l_button
     * @param {SchemaButtonDef} r_button
     * @param {SchemaButtonDef} l_trigger
     * @param {SchemaButtonDef} r_trigger
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
     * @param {string} key button name.
     * @returns SchemaButtonDef
     */
    lookup (key) {
        for (const i in this)
            if (this[i] == key) 
                return i
    }
}

export { GamepadAPI }
