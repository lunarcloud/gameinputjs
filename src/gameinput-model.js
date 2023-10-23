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
    static GamepadIdInfoRegex = /([0-9a-fA-F]{1,4})-([0-9a-fA-F]{1,4})-(.*)|(.*)\((?:STANDARD GAMEPAD)*\s*Vendor:\s*([0-9a-fA-F]{1,4})\s*Product:\s([0-9a-fA-F]{1,4})\)/

    /**
     * Define a GameInputModel.
     * @param {GameInputSchema} schema                          schema to use
     * @param {GamepadIconName} iconName                        icon to use
     * @param {string|undefined} id                             device id text
     * @param {import('./os-detect.js').OSName|undefined} os    for which OS ?
     * @param {GamepadMapping|undefined} mapping                gamepad api mapping
     */
    constructor (schema, iconName, id = undefined, os = undefined, mapping = undefined) {
        this.schema = schema
        this.iconName = iconName
        this.id = id
        this.os = os
        this.mapping = mapping ?? StandardGamepadMapping
        this.IsStandardMapping = this.mapping === StandardGamepadMapping

        const idInfo = id?.match(GameInputModel.GamepadIdInfoRegex)
        if (idInfo) {
            this.VendorId = (idInfo[1] || idInfo[5]).padStart(4, '0')
            this.ProductId = (idInfo[2] || idInfo[6]).padStart(4, '0')
            this.ProductName = (idInfo[3] || idInfo[4]).trim()
        }
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
        this.mapping = schema ?? OldStandardGamepadMapping
        this.IsStandardMapping = this.mapping === OldStandardGamepadMapping
    }
}

export { GameInputModel, OldGameInputModel }
