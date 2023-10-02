/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/standard-gamepad-mapping.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */
import {GamepadAPI} from './gamepad-api.js'
import {SchemaAxisButton} from './schema-axis-button.js'

/**
 * Standard mapping
 * @type {GamepadAPI}
 */
const StardardGamepadMapping = new GamepadAPI(
    13, 14, 15, 16,
    10,
    1,2,3,4,
    new SchemaAxisButton(-2),
    new SchemaAxisButton(2),
    new SchemaAxisButton(-1),
    new SchemaAxisButton(1),
    new SchemaAxisButton(-4),
    new SchemaAxisButton(4),
    new SchemaAxisButton(-3),
    new SchemaAxisButton(3),
    5,6,7,8
)

export default StardardGamepadMapping
export {StardardGamepadMapping}

/**
 * @preserve
 * @license-end
 */
