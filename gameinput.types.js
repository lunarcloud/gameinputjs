/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/gameinput.types.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */

export class Vector2 {
    constructor(x, y) {
        this.x = (x === undefined) ? 0 : x;
        this.y = (y === undefined) ? 0 : y;
    }
    set(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }
    subtract(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }
    scale(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    dot(vector) {
        return (this.x * vector.x + this.y + vector.y);
    }
    moveTowards(vector, t) {
        // Linearly interpolates between vectors A and B by t.
        // t = 0 returns A, t = 1 returns B
        t = Math.min(t, 1); // still allow negative t
        var diff = vector.subtract(this);
        return this.add(diff.scale(t));
    }
    magnitude() {
        return Math.sqrt(this.magnitudeSqr());
    }
    magnitudeSqr() {
        return (this.x * this.x + this.y * this.y);
    }
    distance(vector) {
        return Math.sqrt(this.distanceSqr(vector));
    }
    distanceSqr(vector) {
        var deltaX = this.x - vector.x;
        var deltaY = this.y - vector.y;
        return (deltaX * deltaX + deltaY * deltaY);
    }
    normalize() {
        var mag = this.magnitude();
        var vector = this.clone();
        if (Math.abs(mag) < 1e-9) {
            vector.x = 0;
            vector.y = 0;
        } else {
            vector.x /= mag;
            vector.y /= mag;
        }
        return vector;
    }
    angle() {
        return Math.atan2(this.y, this.x);
    }
    rotate(alpha) {
        var cos = Math.cos(alpha);
        var sin = Math.sin(alpha);
        var vector = new Vector2();
        vector.x = this.x * cos - this.y * sin;
        vector.y = this.x * sin + this.y * cos;
        return vector;
    }
    toPrecision(precision) {
        var vector = this.clone();
        vector.x = vector.x.toFixed(precision);
        vector.y = vector.y.toFixed(precision);
        return vector;
    }
    toString() {
        var vector = this.toPrecision(1);
        return ("[" + vector.x + "; " + vector.y + "]");
    }
}

export class GameInputTheme {
    name = ""

    constructor (name)
    {
        this.name = name;
    }
}

/**
 * @typedef {'Android'|'iOS'|'Windows'|'macOS'|'Linux'} OSName
 */

/**
 * @typedef {'nintendo-generic'|'xbox360'|'xboxone'|'dc'|'ds3'|'ds4'|'ds5'|'joystick'|'generic'} GamepadIconName
 */

/**
 * Game Input Model Definition
 */
export class GameInputModel {

    /**
     * Define a GameInputModel.
     * @param {GameInputSchemaType} type
     * @param {GamepadIconName} iconName
     * @param {string} id
     * @param {OSName} os
     * @param {GenericSchema} schema
     */
    constructor (type, iconName, id, os, schema)
    {
        this.type = type;
        this.iconName = iconName;
        this.id = id;
        this.os = os;
        this.schema = schema;
    }
}

/**
 * @typedef {number|SchemaButton|SchemaAxisButton} SchemaButtonDef
 */

/**
 * Schema Button
 */
export class SchemaButton {
    constructor (index)
    {
        this.index = index;
    }
}

/**
 * Schema Axis-As-Button
 */
export class SchemaAxisButton {
    constructor (indexAndDirection, threshold, deadZone)
    {
        this.index = Math.abs(indexAndDirection);
        this.direction = indexAndDirection < 0 ? "negative" : "positive";
        if ( typeof(threshold) === "undefined" ) threshold = 0.5;
        this.threshold = (this.direction === "positive" ? 1 : -1 ) * Math.abs(threshold);
        if ( typeof(deadZone) === "undefined" ) deadZone = 0;
        this.deadZone = (this.direction === "positive" ? 1 : -1 ) * Math.abs(deadZone);
    }
}


export class GenericSchema {
    constructor(name,
        d_up, d_down, d_left, d_right,
        menu, button0, button1, button2, button3,
        l_up, l_down, l_left, l_right,
        r_up, r_down, r_left, r_right,
        l_button, r_button, l_trigger, r_trigger) {
            this.name = name;
            this.d_up = d_up;
            this.d_down = d_down;
            this.d_left = d_left;
            this.d_right = d_right;
            this.menu = menu;
            this.button0 = button0;
            this.button1 = button1;
            this.button2 = button2;
            this.button3 = button3;
            this.l_up = l_up;
            this.l_down = l_down;
            this.l_left = l_left;
            this.l_right = l_right;
            this.r_up = r_up;
            this.r_down = r_down;
            this.r_left = r_left;
            this.r_right = r_right;
            this.l_button = l_button;
            this.r_button = r_button;
            this.l_trigger = l_trigger;
            this.r_trigger = r_trigger;
    }
    lookup(key) {
        var schema = this;
        for (var i in schema) {
            if (schema[i] instanceof SchemaKey) {
                if (key == schema[i].index) return i;
            }
            else if (schema[i] == key) return i;
        }
    }
}

export class GamepadAPI extends GenericSchema {

    static Stardard = new GamepadAPI(
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

    /**
     *  Constructor
     * @param {string|undefined} name Name of Schema
     * @param {SchemaButtonDef} d_up
     * @param {SchemaButtonDef} d_down
     * @param {SchemaButtonDef} d_left
     * @param {SchemaButtonDef} d_right
     * @param {SchemaButtonDef} menu
     * @param {SchemaButtonDef} button0
     * @param {SchemaButtonDef} button1
     * @param {SchemaButtonDef} button2
     * @param {SchemaButtonDef} button3
     * @param {SchemaButtonDef} l_up
     * @param {SchemaButtonDef} l_down
     * @param {SchemaButtonDef} l_left
     * @param {SchemaButtonDef} l_right
     * @param {SchemaButtonDef} r_up
     * @param {SchemaButtonDef} r_down
     * @param {SchemaButtonDef} r_left
     * @param {SchemaButtonDef} r_right
     * @param {SchemaButtonDef} l_button
     * @param {SchemaButtonDef} r_button
     * @param {SchemaButtonDef} l_trigger
     * @param {SchemaButtonDef} r_trigger
     */
    constructor(name,
        d_up, d_down, d_left, d_right,
        menu, button0, button1, button2, button3,
        l_up, l_down, l_left, l_right,
        r_up, r_down, r_left, r_right,
        l_button, r_button, l_trigger, r_trigger)
    {
        for (var i in arguments) {
            if (i == 0) continue; // name

            if (typeof (arguments[i]) === "number") arguments[i] = new SchemaButton(arguments[i]);
        }

        super(name, d_up, d_down, d_left, d_right,
            menu, button0, button1, button2, button3,
            l_up, l_down, l_left, l_right,
            r_up, r_down, r_left, r_right,
            l_button, r_button, l_trigger, r_trigger);
    }
}

export class GameInputSchemaType {

    static Hedgehog = new GameInputSchemaType("Hedgehog", new GameInputTheme("HedgeHog"), {
            button0     :   "A",
            button1     :   "B",
            button2     :   "X",
            button3     :   "Y",
            l_button    :   "LB",
            r_button    :   "RB",
            l_trigger   :   "LT",
            r_trigger   :   "RT"
    });

    static Plumber = new GameInputSchemaType("Plumber", new GameInputTheme("Plumber"), {
            button0     :   "A",
            button1     :   "B",
            button2     :   "X",
            button3     :   "Y",
            l_button    :   "LB",
            r_button    :   "RB",
            l_trigger   :   "LT",
            r_trigger   :   "RT"
    });

    static Ragdoll = new GameInputSchemaType("Ragdoll", new GameInputTheme("Ragdoll"), {
            button0     :   "x",
            button1     :   "o",
            button2     :   "□",
            button3     :   "△",
            l_button    :   "L1",
            r_button    :   "R1",
            l_trigger   :   "L2",
            r_trigger   :   "R2"
    });

    static Ragdoll4 = new GameInputSchemaType("Ragdoll", new GameInputTheme("Ragdoll"), {
            menu        :   "options",
            button0     :   "x",
            button1     :   "o",
            button2     :   "□",
            button3     :   "△",
            l_button    :   "L1",
            r_button    :   "R1",
            l_trigger   :   "L2",
            r_trigger   :   "R2"
    });

    constructor(name, theme, themeSchemaNames) {
        this.name = name;
        this.theme = theme;

        this.schemaNames = {
            d_up: "↑",
            d_down: "↓",
            d_left: "←",
            d_right: "→",
            menu: "▶",
            button0: "button0",
            button1: "button1",
            button2: "button2",
            button3: "button3",
            l_up: "↑",
            l_down: "↓",
            l_left: "←",
            l_right: "→",
            r_up: "↑",
            r_down: "↓",
            r_left: "←",
            r_right: "→",
            l_button: "l_button",
            r_button: "r_button",
            l_trigger: "l_trigger",
            r_trigger: "r_trigger"
        };
        for (var i in themeSchemaNames) {
            if (i in this.schemaNames) this.schemaNames[i] = themeSchemaNames[i];
        }
    }

};


/**
 * @preserve
 * @license-end
 */
