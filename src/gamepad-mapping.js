/**
 * @typedef {number|import('./axis-as-button.js').AxisAsButton|import('./combined-axis-as-button.js').CombinedAxisToButton} SchemaButtonDef
 */

/**
 * Mapping Of Schema Buttons to "left" and "right" directions
 */
export class GamepadLRMapping {
    /**
     * Button/Axis for "left"
     * @type {SchemaButtonDef}
     */
    left

    /**
     * Button/Axis for "right"
     * @type {SchemaButtonDef}
     */
    right

    /**
     * Constructor, define directions from ltr.
     * @param {SchemaButtonDef} left    left button
     * @param {SchemaButtonDef} right   right button
     */
    constructor (left = undefined, right = undefined) {
        this.left = left
        this.right = right
    }
}

/**
 * Mapping Of Schema Buttons to "select/back" and "start/options/menu" center buttons
 */
export class GamepadCenterMapping {
    /**
     * Button/Axis for "start/options/menu"
     * @type {SchemaButtonDef}
     */
    menu

    /**
     * Button/Axis for "select/back"
     * @type {SchemaButtonDef}
     */
    back

    /**
     * Constructor, define directions from ltr.
     * @param {SchemaButtonDef} menu    start/options/menu button
     * @param {SchemaButtonDef} back  select/back button
     */
    constructor (menu = undefined, back = undefined) {
        this.menu = menu
        this.back = back
    }
}

/**
 * @typedef {boolean} FaceDirection  true= left-to-right, false=right-to-left
 * @summary is LTR?
 */

/**
 * @type {{ltr: boolean, rtl: boolean}}
 */
export const FaceDirections = {
    ltr: true,
    rtl: false
}

/**
 * Used later to let Playstation prior to PS5 use RTL direction for Japan
 */
export const IsJapan = navigator.language.toLowerCase() === 'ja-jp' ||
                        Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Tokyo'

/**
 * Mapping Of Schema Buttons for the 4 cardinal directions
 */
export class GamepadDirectionsMapping extends GamepadLRMapping {
    /**
     * Button/Axis for "up"
     * @type {SchemaButtonDef}
     */
    up

    /**
     * Button/Axis for "down"
     * @type {SchemaButtonDef}
     */
    down

    /**
     * Constructor, define directions in clockwise order.
     * @param {SchemaButtonDef} up      north button
     * @param {SchemaButtonDef} right   east button
     * @param {SchemaButtonDef} down    south button
     * @param {SchemaButtonDef} left    west button
     */
    constructor (up = undefined, right = undefined, down = undefined, left = undefined) {
        super(left, right)
        this.up = up
        this.down = down
    }
}
/**
 * Mapping Of an Analog Stick: directions plus click
 */
export class GamepadAnalogStickMapping extends GamepadDirectionsMapping {
    /**
     * Button/Axis for "stick click"
     * @type {SchemaButtonDef}
     */
    click

    /**
     * Constructor, define directions in clockwise order.
     * @param {SchemaButtonDef} up      north button
     * @param {SchemaButtonDef} right   east button
     * @param {SchemaButtonDef} down    south button
     * @param {SchemaButtonDef} left    west button
     * @param {SchemaButtonDef} click   click stick in
     */
    constructor (up = undefined, right = undefined, down = undefined, left = undefined, click = undefined) {
        super(up, right, down, left)
        this.click = click
    }
}

export class GamepadFaceMapping extends GamepadDirectionsMapping {
    /**
     * Direction of face button labels/usage (aka "Is Left-to-Right")
     * @type {FaceDirection}
     */
    direction

    /**
     * Constructor.
     * @param {SchemaButtonDef} up          north button
     * @param {SchemaButtonDef} right       east button
     * @param {SchemaButtonDef} down        south button
     * @param {SchemaButtonDef} left        west button
     * @param {FaceDirection}   direction   button label direction
     */
    constructor (up = undefined, right = undefined, down = undefined, left = undefined,
        direction = FaceDirections.ltr) {
        super(up, right, down, left)
        this.direction = direction
    }

    /**
     * Get button by ordinal priority.
     * @param {number} value button ordinal (0 for primary/accept, 1 for secondary/cancel, etc)
     * @returns {SchemaButtonDef} button mapping.
     */
    ordinal (value) {
        const ltr = this.direction === FaceDirections.ltr
        switch (value) {
        case 0: return ltr ? this.down : this.right
        case 1: return ltr ? this.right : this.down
        case 2: return ltr ? this.left : this.up
        case 3: return ltr ? this.up : this.left
        default: return undefined
        }
    }

    /**
     * @typedef {Object} GamepadFaceMappingOverrides
     * @property {SchemaButtonDef|undefined} [up] up override
     * @property {SchemaButtonDef|undefined} [right] right override
     * @property {SchemaButtonDef|undefined} [down] down override
     * @property {SchemaButtonDef|undefined} [left] left override
     * @property {FaceDirection|undefined} [direction] direction override
     */

    /**
     * Return a fresh clone to modify.
     * @param {GamepadFaceMappingOverrides} overrides   Properties to override
     * @returns {GamepadFaceMapping}                    new copy with changes
     */
    variant (overrides) {
        return Object.assign(Object.assign(new GamepadFaceMapping(), this), overrides)
    }
}

/**
 * Gamepad Button Configuration
 * @class GamepadMapping
 */
export class GamepadMapping {
    /**
     * Directional Pad.
     * @type {GamepadDirectionsMapping|undefined}
     */
    dpad

    /**
     * Left Stick.
     * @type {GamepadAnalogStickMapping|undefined}
     */
    leftStick

    /**
     * Left Stick.
     * @type {GamepadAnalogStickMapping|undefined}
     */
    rightStick

    /**
     * Main 4 face buttons.
     * @type {GamepadFaceMapping}
     */
    face

    /**
     * Shoulder buttons.
     * @type {GamepadLRMapping|undefined}
     */
    shoulder

    /**
     * Triggers.
     * @type {GamepadLRMapping|undefined}
     */
    trigger

    /**
     * Buttons in the center of the gamepad.
     * @type {GamepadCenterMapping}
     */
    center

    /**
     *
     * @param {GamepadDirectionsMapping|undefined} dpad Direction Pad
     * @param {GamepadFaceMapping|undefined} face Face Buttons
     * @param {GamepadCenterMapping|undefined} center Start/Select Buttons
     * @param {GamepadLRMapping|undefined} shoulder Shoulder Buttons
     * @param {GamepadLRMapping|undefined} trigger Triggers
     * @param {GamepadAnalogStickMapping|undefined} leftStick Left analog stick
     * @param {GamepadAnalogStickMapping|undefined} rightStick Right analog stick
     */
    constructor (dpad = undefined, face = undefined, center = undefined, shoulder = undefined, trigger = undefined, leftStick = undefined, rightStick = undefined) {
        this.dpad = dpad
        this.face = face
        this.center = center
        this.shoulder = shoulder
        this.trigger = trigger
        this.leftStick = leftStick
        this.rightStick = rightStick
    }

    /**
     * @typedef {Object} GamepadMappingOverrides
     * @property {GamepadDirectionsMapping|undefined} [dpad] dpad override
     * @property {GamepadFaceMapping|undefined} [face] face override
     * @property {GamepadCenterMapping|undefined} [center] center override
     * @property {GamepadLRMapping|undefined} [shoulder] shoulder override
     * @property {GamepadLRMapping|undefined} [trigger] trigger override
     * @property {GamepadAnalogStickMapping|undefined} [leftStick] leftStick override
     * @property {GamepadAnalogStickMapping|undefined} [rightStick] rightStick override
     */

    /**
     * Return a fresh clone to modify.
     * @param {GamepadMappingOverrides|undefined} overrides           Properties to override
     * @param {GamepadFaceMappingOverrides|undefined} faceOverrides   Properties on face to override
     * @returns {GamepadMapping}                            new copy with changes
     */
    variant (overrides = {}, faceOverrides = undefined) {
        overrides ??= {} // in case "undefined" is provided
        if (faceOverrides)
            overrides.face = this.face.variant(faceOverrides)
        const newValue = Object.assign(Object.assign(new GamepadMapping(), this), overrides)
        return newValue
    }
}
