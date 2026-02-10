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

    // Regex capture group indices for Firefox format (VID-PID-name)
    static FIREFOX_VID_INDEX = 1
    static FIREFOX_PID_INDEX = 2
    static FIREFOX_NAME_INDEX = 3

    // Regex capture group indices for Chromium format (name (Vendor: VID Product: PID))
    static CHROMIUM_NAME_INDEX = 4
    static CHROMIUM_STANDARD_INDEX = 5
    static CHROMIUM_VID_INDEX = 6
    static CHROMIUM_PID_INDEX = 7

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
            this.VendorId = (idInfo[GameInputModel.FIREFOX_VID_INDEX] || idInfo[GameInputModel.CHROMIUM_VID_INDEX]).padStart(4, '0')
            this.ProductId = (idInfo[GameInputModel.FIREFOX_PID_INDEX] || idInfo[GameInputModel.CHROMIUM_PID_INDEX]).padStart(4, '0')
            this.ProductName = (idInfo[GameInputModel.FIREFOX_NAME_INDEX] || idInfo[GameInputModel.CHROMIUM_NAME_INDEX]).trim()
            this.IsStandardGamepad = !!idInfo[GameInputModel.CHROMIUM_STANDARD_INDEX]
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
        const vendorId = (idInfo[GameInputModel.FIREFOX_VID_INDEX] || idInfo[GameInputModel.CHROMIUM_VID_INDEX]).padStart(4, '0')
        return this.VendorId.toLowerCase() === vendorId.toLowerCase()
    }
}

export { GameInputModel }
