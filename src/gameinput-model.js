import GameInputSchema from './gameinput-schema.js'
import GamepadAPI from './gamepad-api.js'
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
     * @param {GameInputSchema} type                    type of the schema
     * @param {GamepadIconName} iconName                icon to use
     * @param {string} id                               device id text
     * @param {import('./os-detect.js').OSName?} os     for which OS ?
     * @param {GamepadAPI} schema                       gamepad api schema
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
