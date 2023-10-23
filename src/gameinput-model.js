import { GameInputSchema } from './gameinput-schema.js'
import { GamepadMapping } from './gamepad-mapping.js'
import { OldGamepadMapping } from './old-gamepad-mapping.js'
import { StandardGamepadMapping } from './standard-gamepad-mapping.js'
import { OldStandardGamepadMapping } from './old-standard-gamepad-mapping.js'

/**
 * @typedef {'nintendo-generic'|'joycon-l'|'joycon-r'|'joycons'|'xbox360'|'xboxone'|'dc'|'ds3'|'ds4'|'ds5'|'joystick'|'generic'} GamepadIconName
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
        this.schema = schema ?? StandardGamepadMapping
    }
}

/**
 * Game Input Model Definition TODO remove
 */
class OldGameInputModel extends GameInputModel {
    /**
     * Define a GameInputModel.
     * @param {GameInputSchema} type                            type of the schema
     * @param {GamepadIconName} iconName                        icon to use
     * @param {string|undefined} id                             device id text
     * @param {import('./os-detect.js').OSName|undefined} os    for which OS ?
     * @param {OldGamepadMapping|undefined} schema              gamepad api schema
     */
    constructor (type, iconName, id = undefined, os = undefined, schema = undefined) {
        super(type, iconName, id, os)
        this.schema = schema ?? OldStandardGamepadMapping
    }
}

export { GameInputModel, OldGameInputModel }
