import { StardardGamepadMapping } from './standard-gamepad-mapping.js'

/**
 * @typedef {'nintendo-generic'|'xbox360'|'xboxone'|'dc'|'ds3'|'ds4'|'ds5'|'joystick'|'generic'} GamepadIconName
 */

/**
 * Game Input Model Definition
 */
export default class GameInputModel {
    /**
     * Define a GameInputModel.
     * @param {GameInputSchema} type
     * @param {GamepadIconName} iconName
     * @param {string} id
     * @param {import('./os-detect.js').OSName} os
     * @param {GamepadAPI} schema
     */
    constructor (type, iconName, id, os, schema) {
        this.type = type
        this.iconName = iconName
        this.id = id
        this.os = os
        this.schema = schema ?? StardardGamepadMapping
    }
}

export { GameInputModel }
