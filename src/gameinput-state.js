import { OrdinalButtonName } from './gameinput-schema.js'
import { FaceDirections } from './gamepad-mapping.js'

export class GameInputItemState {
    /**
     * The item whose state we're tracking.
     * @type {import("./gamepad-mapping.js").SchemaButtonDef}
     */
    item

    /**
     * Current analog value.
     * @type {number}
     */
    value

    /**
     * Current digital value.
     * @type {boolean}
     */
    active

    /**
     * Constructor.
     * @param {import("./gamepad-mapping.js").SchemaButtonDef} item the state's reference item.
     */
    constructor (item) {
        this.item = item
    }
}

export class GameInputLRState {
    /**
     * Button/Axis for "left"
     * @type {GameInputItemState}
     */
    left

    /**
     * Button/Axis for "right"
     * @type {GameInputItemState}
     */
    right

    /**
     * Constructor, define directions from ltr.
     * @param {GameInputItemState} left    left button
     * @param {GameInputItemState} right   right button
     */
    constructor (left = undefined, right = undefined) {
        this.left = left
        this.right = right
    }
}

export class GameInputCenterState {
    /**
     * Button/Axis for "start/options/menu"
     * @type {GameInputItemState}
     */
    menu

    /**
     * Button/Axis for "select/back"
     * @type {GameInputItemState}
     */
    select

    /**
     * Constructor, define directions from ltr.
     * @param {GameInputItemState} menu    start/options/menu button
     * @param {GameInputItemState} select  select/back button
     */
    constructor (menu = undefined, select = undefined) {
        this.menu = menu
        this.select = select
    }
}

export class GameInputDirectionsState extends GameInputLRState {
    /**
     * Button/Axis for "up"
     * @type {GameInputItemState}
     */
    up

    /**
     * Button/Axis for "down"
     * @type {GameInputItemState}
     */
    down

    /**
     * Constructor, define directions in clockwise order.
     * @param {GameInputItemState} up      north button
     * @param {GameInputItemState} right   east button
     * @param {GameInputItemState} down    south button
     * @param {GameInputItemState} left    west button
     */
    constructor (up = undefined, right = undefined, down = undefined, left = undefined) {
        super(left, right)
        this.up = up
        this.down = down
    }
}

export class GameInputFaceState extends GameInputDirectionsState {
    /**
     * Direction of face button labels/usage (aka "Is Left-to-Right")
     * @type {import("./gamepad-mapping.js").FaceDirection}
     */
    direction

    /**
     * Constructor.
     * @param {GameInputItemState} up          north button
     * @param {GameInputItemState} right       east button
     * @param {GameInputItemState} down        south button
     * @param {GameInputItemState} left        west button
     * @param {import("./gamepad-mapping.js").FaceDirection}   direction   button label direction
     */
    constructor (up = undefined, right = undefined, down = undefined, left = undefined,
        direction = FaceDirections.ltr) {
        super(up, right, down, left)
        this.direction = direction
    }

    /**
     * Get button by ordinal priority.
     * @param {number} value button ordinal (0 for primary/accept, 1 for secondary/cancel, etc)
     * @returns {GameInputItemState} button mapping.
     */
    ordinal (value) {
        return this[OrdinalButtonName(value, this.direction)]
    }

    /**
     * @typedef {Object} GameInputFaceStateOverrides
     * @property {GameInputItemState|undefined} [up] up override
     * @property {GameInputItemState|undefined} [right] right override
     * @property {GameInputItemState|undefined} [down] down override
     * @property {GameInputItemState|undefined} [left] left override
     * @property {import("./gamepad-mapping.js").FaceDirection|undefined} [direction] direction override
     */

    /**
     * Return a fresh clone to modify.
     * @param {GameInputFaceStateOverrides} overrides   Properties to override
     * @returns {GameInputFaceState}                    new copy with changes
     */
    variant (overrides) {
        return Object.assign(Object.assign(new GameInputFaceState(), this), overrides)
    }
}

export class GameInputState {
    /**
     * Directional Pad.
     * @type {GameInputDirectionsState|undefined}
     */
    dpad

    /**
     * Left Stick.
     * @type {GameInputDirectionsState|undefined}
     */
    leftStick

    /**
     * Left Stick.
     * @type {GameInputDirectionsState|undefined}
     */
    rightStick

    /**
     * Main 4 face buttons.
     * @type {GameInputFaceState}
     */
    face

    /**
     * Shoulder buttons.
     * @type {GameInputLRState|undefined}
     */
    shoulder

    /**
     * Triggers.
     * @type {GameInputLRState|undefined}
     */
    trigger

    /**
     * Buttons in the center of the gamepad.
     * @type {GameInputCenterState}
     */
    center

    /**
     *
     * @param {GameInputDirectionsState} dpad Direction Pad
     * @param {GameInputFaceState} face Face Buttons
     * @param {GameInputCenterState} center Start/Select Buttons
     * @param {GameInputLRState} shoulder Shoulder Buttons
     * @param {GameInputLRState} trigger Triggers
     * @param {GameInputDirectionsState} leftStick Left analog stick
     * @param {GameInputDirectionsState} rightStick Right analog stick
     */
    constructor (
        dpad = new GameInputDirectionsState(),
        face = new GameInputFaceState(),
        center = new GameInputCenterState(),
        shoulder = new GameInputLRState(),
        trigger = new GameInputLRState(),
        leftStick = new GameInputDirectionsState(),
        rightStick = new GameInputDirectionsState()
    ) {
        this.dpad = dpad
        this.face = face
        this.center = center
        this.shoulder = shoulder
        this.trigger = trigger
        this.leftStick = leftStick
        this.rightStick = rightStick
    }

    /**
     * @typedef {Object} GameInputStateOverrides
     * @property {GameInputDirectionsState|undefined} [dpad] dpad override
     * @property {GameInputFaceState|undefined} [face] face override
     * @property {GameInputCenterState|undefined} [center] center override
     * @property {GameInputLRState|undefined} [shoulder] shoulder override
     * @property {GameInputLRState|undefined} [trigger] trigger override
     * @property {GameInputDirectionsState|undefined} [leftStick] leftStick override
     * @property {GameInputDirectionsState|undefined} [rightStick] rightStick override
     */

    /**
     * Return a fresh clone to modify.
     * @param {?GameInputStateOverrides} overrides           Properties to override
     * @param {?GameInputFaceStateOverrides} faceOverrides   Properties on face to override
     * @returns {GameInputState}                            new copy with changes
     */
    variant (overrides = {}, faceOverrides = undefined) {
        overrides ??= {} // in case "undefined" is provided
        if (faceOverrides)
            overrides.face = this.face.variant(faceOverrides)
        const newValue = Object.assign(Object.assign(new GameInputState(), this), overrides)
        return newValue
    }
}
