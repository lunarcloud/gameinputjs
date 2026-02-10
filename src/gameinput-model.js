import { GameInputSchema } from './gameinput-schema.js'
import { GamepadMapping } from './gamepad-mapping.js'
import { StandardGamepadMapping } from './standard-gamepad-mapping.js'

/**
 * @typedef {'snes'|'n64'|'joycon-l'|'joycon-r'|'joycons'|'xbox360'|'xboxone'|'dc'|'ds3'|'ds4'|'ds5'|'joystick'|'sega-generic'|'generic'} GamepadIconName
 */

/**
 * Game Input Model Definition
 */
class GameInputModel {
    static GamepadIdInfoRegex = /([0-9a-fA-F]{1,4})-([0-9a-fA-F]{1,4})-(.*)|(.*)\((STANDARD GAMEPAD)?\s*Vendor:\s*([0-9a-fA-F]{1,4})\s*Product:\s([0-9a-fA-F]{1,4})\)/

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
            this.VendorId = (idInfo[1] || idInfo[6]).padStart(4, '0')
            this.ProductId = (idInfo[2] || idInfo[7]).padStart(4, '0')
            this.ProductName = (idInfo[3] || idInfo[4]).trim()
            this.IsStandardGamepad = !!idInfo[5]
        }
    }

    /**
     * Check if this model matches the given gamepad ID.
     * @param {string} gamepadId The gamepad ID to match against
     * @returns {boolean} True if this model matches the gamepad ID
     */
    matches (gamepadId) {
        if (!this.id) return false
        return this.id === gamepadId
    }

    /**
     * Check if this model's vendor ID matches the given gamepad ID.
     * @param {string} gamepadId The gamepad ID to extract vendor from and match
     * @returns {boolean} True if vendor IDs match
     */
    matchesVendor (gamepadId) {
        if (!this.VendorId) return false
        const idInfo = gamepadId?.match(GameInputModel.GamepadIdInfoRegex)
        if (!idInfo) return false
        const vendorId = (idInfo[1] || idInfo[6]).padStart(4, '0')
        return this.VendorId.toLowerCase() === vendorId.toLowerCase()
    }
}

export { GameInputModel }
