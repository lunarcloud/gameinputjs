/**
 * @typedef {number|import('./axis-as-button.js').AxisAsButton} SchemaButtonDef
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
 * @typedef {boolean} FaceDirection
 */

/**
 * @type {{ltr: boolean, rtl: boolean}}
 */
export const FaceDirections = {
    ltr: true,
    rtl: false
}

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

export class GamepadFaceMapping extends GamepadDirectionsMapping {
    /**
     * Direction of face button labels/usage (aka "Is Left-to-Right")
     * @type {FaceDirection}
     */
    direction

    /**
     * Button/Axis for "Z"
     * @type {SchemaButtonDef}
     */
    upperExtra

    /**
     * Button/Axis for "C"
     * @type {SchemaButtonDef}
     */
    lowerExtra

    /**
     * Constructor.
     * @param {SchemaButtonDef} up          north button
     * @param {SchemaButtonDef} right       east button
     * @param {SchemaButtonDef} down        south button
     * @param {SchemaButtonDef} left        west button
     * @param {FaceDirection}   direction   button label direction
     * @param {SchemaButtonDef} upperExtra  upper extra button (Z)
     * @param {SchemaButtonDef} lowerExtra  lower extra button (C)
     */
    constructor (up = undefined, right = undefined, down = undefined, left = undefined,
        direction = FaceDirections.ltr,
        upperExtra = undefined, lowerExtra = undefined) {
        super(up, right, down, left)
        this.direction = direction
        this.upperExtra = upperExtra
        this.lowerExtra = lowerExtra
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
        case 4: return this.lowerExtra
        case 5: return this.upperExtra
        default: return undefined
        }
    }

    /**
     * @typedef {{
     *  up?: SchemaButtonDef|undefined,
     *  right?: SchemaButtonDef|undefined,
     *  down?: SchemaButtonDef|undefined,
     *  left?: SchemaButtonDef|undefined,
     *  direction?: FaceDirection|undefined,
     *  upperExtra?: SchemaButtonDef|undefined,
     *  lowerExtra?: SchemaButtonDef|undefined
     * }} GamepadFaceMappingOverrides
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
     * @type {GamepadDirectionsMapping|undefined}
     */
    leftStick

    /**
     * Left Stick.
     * @type {GamepadDirectionsMapping|undefined}
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
     * @param {GamepadDirectionsMapping|undefined} leftStick Left analog stick
     * @param {GamepadDirectionsMapping|undefined} rightStick Right analog stick
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
     * @typedef {{
     *  dpad?: GamepadDirectionsMapping|undefined,
     *  face?: GamepadFaceMapping|undefined,
     *  center?: GamepadCenterMapping|undefined,
     *  shoulder?: GamepadLRMapping|undefined,
     *  trigger?: GamepadLRMapping|undefined,
     *  leftStick?: GamepadDirectionsMapping|undefined,
     *  rightStick?: GamepadDirectionsMapping|undefined
     * }} GamepadMappingOverrides
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
