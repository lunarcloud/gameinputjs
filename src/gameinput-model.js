/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/gameinput-model.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */
import {StardardGamepadMapping} from './standard-gamepad-mapping.js'

/**
 * @typedef {'Android'|'iOS'|'Windows'|'macOS'|'Linux'|'Other'} OSName
 */

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
     * @param {OSName} os
     * @param {GamepadAPI} schema
     */
    constructor (type, iconName, id, os, schema)
    {
        this.type = type;
        this.iconName = iconName;
        this.id = id;
        this.os = os;
        this.schema = schema ?? StardardGamepadMapping;
    }
}

export {GameInputModel}

/**
 * @preserve
 * @license-end
 */
