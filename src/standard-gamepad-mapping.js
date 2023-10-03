import { GamepadAPI } from './gamepad-api.js'
import { SchemaAxisButton } from './schema-axis-button.js'

/**
 * Standard mapping
 * @type {GamepadAPI}
 */
const StardardGamepadMapping = new GamepadAPI(
    13, 14, 15, 16,
    10,
    1, 2, 3, 4,
    new SchemaAxisButton(-2),
    new SchemaAxisButton(2),
    new SchemaAxisButton(-1),
    new SchemaAxisButton(1),
    new SchemaAxisButton(-4),
    new SchemaAxisButton(4),
    new SchemaAxisButton(-3),
    new SchemaAxisButton(3),
    5, 6, 7, 8
)

export default StardardGamepadMapping
export { StardardGamepadMapping }
