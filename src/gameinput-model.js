import { GameInputSchema } from './gameinput-schema.js'
import { GamepadMapping } from './gamepad-mapping.js'
import { StardardGamepadMapping } from './standard-gamepad-mapping.js'

/**
 * @typedef {'nintendo-generic'|'xbox360'|'xboxone'|'dc'|'ds3'|'ds4'|'ds5'|'joystick'|'generic'} GamepadIconName
 */

/**
 * Game Input Model Definition
 */
class GameInputModel {
    /**
     * Define a GameInputModel.
     * @param {GameInputSchema} type                            type of the schema
     * @param {GamepadIconName} iconName                        icon to use
     * @param {string|undefined} id                             device id text
     * @param {import('./os-detect.js').OSName|undefined} os    for which OS ?
     * @param {GamepadMapping|undefined} schema                     gamepad api schema
     */
    constructor (type, iconName, id = undefined, os = undefined, schema = undefined) {
        this.type = type
        this.iconName = iconName
        this.id = id
        this.os = os
        this.schema = schema ?? StardardGamepadMapping
    }
}

export { GameInputModel }
