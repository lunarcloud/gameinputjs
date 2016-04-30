/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/gameinput.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */

/**
 * GameInput
 * @brief   Game Input System
 * @desc    System for using a gamepad or keyboard control scheme for games
 */
var GameInput;
var gi = {};

// encapsulate
(function(){
    "use strict";

    gi.debug = true; // disable to remove console output
    gi.handleKeyboard = true; // disable to deal with keyboard on your own

    /* Helper function */
    function toASCII(text) { return text.replace(/[^\x00-\x7F]/g, ""); }

    gi.Schema = {};

    gi.Schema.Names = {
        d_up        :   "d_up",
        d_down      :   "d_down",
        d_left      :   "d_left",
        d_right     :   "d_right",
        menu        :   "menu",
        button0     :   "button0",
        button1     :   "button1",
        button2     :   "button2",
        button3     :   "button3",
        l_up        :   "l_up",
        l_down      :   "l_down",
        l_left      :   "l_left",
        l_right     :   "l_right",
        r_up        :   "r_up",
        r_down      :   "r_down",
        r_left      :   "r_left",
        r_right     :   "r_right",
        l_button    :   "l_button",
        r_button    :   "r_button",
        l_trigger   :   "l_trigger",
        r_trigger   :   "r_trigger"
    };

    gi.os = "Other";
    gi.firstPress = false;

    gi.canUseGamepadAPI = function()
    {
        return "getGamepads" in navigator;
    }

    gi.buttonDownActions = [];
    gi.buttonUpActions = [];

    gi.onButtonDown = function(action) {
        if (typeof(action) !== "function") throw "Action must be a function";
        gi.buttonDownActions.push(action);
    };

    gi.onButtonUp = function(action) {
        if (typeof(action) !== "function") throw "Action must be a function";
        gi.buttonUpActions.push(action);
    };

    gi.buttonDown = function(player, schemaName) {
        for ( var action in gi.buttonDownActions) gi.buttonDownActions[action](player, schemaName);
    }

    gi.buttonUp = function(player, schemaName) {
        for ( var action in gi.buttonUpActions) gi.buttonUpActions[action](player, schemaName);
    }

    gi.Player = function(number)
    {
        this.number = number;
        this.index = number - 1;

        this.type;
        this.model;
        this.schema;
        this.theme;
        this.state;

        this.previous = {
            type: undefined,
            model: undefined,
            schema: undefined,
            state: undefined,
        };

        this.buttonDownActions = {};
        this.buttonUpActions = {};

        for (var i in gi.Schema.Names)
        {
            this.buttonDownActions[ gi.Schema.Names[i] ] = [];
            this.buttonUpActions[ gi.Schema.Names[i] ] = [];
        }
    }

    gi.Player.prototype.buttonDown = function(schemaName)
    {
        gi.buttonDown(this.index, schemaName);
        for ( var action in this.buttonDownActions[schemaName])
            this.buttonDownActions[schemaName][action]();
    }

    gi.Player.prototype.buttonUp = function(schemaName)
    {
        gi.buttonUp(this.index, schemaName);
        for ( var action in this.buttonUpActions[schemaName])
            this.buttonUpActions[schemaName][action]();
    }

    gi.Player.prototype.onButtonDown = function(schemaName, action)
    {
        if (schemaName in gi.Schema.Names === false) throw "Must be gi.Schema.Names";
        if (typeof(action) !== "function") throw "Action must be a function";

        this.buttonDownActions[schemaName].push(action);
    };

    gi.Player.prototype.onButtonUp = function(schemaName, action)
    {
        if (schemaName in gi.Schema.Names === false) throw "Must be gi.Schema.Names";
        if (typeof(action) !== "function") throw "Action must be a function";

        this.buttonUpActions[schemaName].push(action);
    };

    gi.Player.prototype.hasGamePad = function()
    {
        return typeof(this.type) !== "undefined" && this.type !== GameInput.Type.Keyboard;
    };

    gi.Player.prototype.hasKeyboard = function()
    {
        return typeof(this.type) !== "undefined" && this.type === GameInput.Type.Keyboard;
    };

    /**
     * @desc    Gets the button text
     * @param   schemaName      name of the button or axisValue
     * @param   symbolsAsWords  whether or not to convert Ragdoll's "x □ o △" to "cross square circle triangle"
     */
    gi.Player.prototype.getButtonText = function(schemaName, symbolsAsWords)
    {
        if ( this.schema instanceof gi.Schema.KeyboardAPI )
        {
            return this.schema[schemaName].text;
        }
        else
        {
            var text = this.model.type.schemaNames[schemaName];

            if (symbolsAsWords !== true) return text;

            switch (text) {
                case "▶":
                    return "start";
                case "x":
                    return "cross";
                case "o":
                    return "circle";
                case "□":
                    return "square";
                case "△":
                    return "triangle";
                default:
                    return text;
            }
        }
    }

    gi.Players = [
        new gi.Player(1),
        new gi.Player(2),
        new gi.Player(3),
        new gi.Player(4)
    ];

    gi.Connection = {};

    gi.Connection.GamePadMapping = {
        0 : 0,
        1 : 1,
        2 : 2,
        3 : 3
    }

    gi.getPlayer = function(index) {
        return gi.Players[gi.Connection.GamePadMapping[index]];
    }

    gi.Connection.Gamepads = [undefined, undefined, undefined, undefined];

    gi.Connection.gained = function(gamepad)
    {
        gi.initialGamePadSetup();
    };

    gi.Connection.lost = function(gamepad)
    {
        gi.initialGamePadSetup();
    };

    gi.Theme = function(name)
    {
        this.name = name;
    };

    gi.Schema.Key = function(code, text)
    {
        this.index = code;
        this.text = text;
    };

    gi.Schema.Button = function(index)
    {
        this.index = index;
    };

    gi.Schema.AxisButton = function(indexAndDirection, threshold)
    {
        this.index = Math.abs(indexAndDirection);
        this.direction = indexAndDirection < 0 ? "negative" : "positive";
        if ( typeof(threshold) === "undefined" ) threshold = 0.5;
        this.threshold = (this.direction === "positive" ? 1 : -1 ) * Math.abs(threshold);
    };

    gi.Schema.Generic = function(d_up, d_down, d_left, d_right,
                                menu, button0, button1, button2, button3,
                                l_up, l_down, l_left, l_right,
                                r_up, r_down, r_left, r_right,
                                l_button, r_button, l_trigger, r_trigger)
    {
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
    };

    gi.Schema.Generic.prototype.lookup = function(key)
    {
        var schema = this;
        for (var i in schema)
        {
            if (schema[i] instanceof gi.Schema.Key)
            {
                if (key == schema[i].index) return i;
            }
            else if (schema[i] == key) return i;
        }
    }

    gi.Schema.GamePadAPI = function(d_up, d_down, d_left, d_right,
                                menu, button0, button1, button2, button3,
                                l_up, l_down, l_left, l_right,
                                r_up, r_down, r_left, r_right,
                                l_button, r_button, l_trigger, r_trigger)
    {
        for (var i in arguments)
        {
            if (typeof(arguments[i]) === "number") arguments[i] = new gi.Schema.Button(arguments[i]);
        }
        // if (typeof(d_up) === "number") d_up = new gi.Schema.Button(d_up); // TODO find out what I was doing here... it breaks things if uncommented

        gi.Schema.Generic.call(this, d_up, d_down, d_left, d_right,
                                menu, button0, button1, button2, button3,
                                l_up, l_down, l_left, l_right,
                                r_up, r_down, r_left, r_right,
                                l_button, r_button, l_trigger, r_trigger);
    };
    gi.Schema.GamePadAPI.prototype = new gi.Schema.Generic();
    gi.Schema.GamePadAPI.prototype.constructor = gi.Schema.GamePadAPI;

    gi.Schema.KeyboardAPI = function(d_up, d_down, d_left, d_right,
                                menu, button0, button1, button2, button3,
                                l_up, l_down, l_left, l_right,
                                r_up, r_down, r_left, r_right,
                                l_button, r_button, l_trigger, r_trigger)
    {
        for (var i in arguments)
        {
            if (typeof(arguments[i]) !== "undefined" && (arguments[i] instanceof gi.Schema.Key) === false) throw "Must be undefined or gi.Schema.Key";
        }
        gi.Schema.Generic.call(this, d_up, d_down, d_left, d_right,
                                menu, button0, button1, button2, button3,
                                l_up, l_down, l_left, l_right,
                                r_up, r_down, r_left, r_right,
                                l_button, r_button, l_trigger, r_trigger);
    };
    gi.Schema.KeyboardAPI.prototype = new gi.Schema.Generic();
    gi.Schema.KeyboardAPI.prototype.constructor = gi.Schema.KeyboardAPI;

    /**
     * @desc    Valid keycode integer
     */
    gi.Schema.KeyboardAPI.Keys = {
          ENTER: new gi.Schema.Key(13, "Return"),
          ESCAPE: new gi.Schema.Key(27, "Esc"),
          LEFT_ARROW: new gi.Schema.Key(37, "←"),
          UP_ARROW: new gi.Schema.Key(38, "↑"),
          RIGHT_ARROW: new gi.Schema.Key(39, "→"),
          DOWN_ARROW: new gi.Schema.Key(40, "↓"),
          NUM_0: new gi.Schema.Key(96, "NUM 0"),
          NUM_1: new gi.Schema.Key(97, "NUM 1"),
          NUM_2: new gi.Schema.Key(98, "NUM 2"),
          NUM_3: new gi.Schema.Key(99, "NUM 3"),
          NUM_4: new gi.Schema.Key(100, "NUM 4"),
          NUM_5: new gi.Schema.Key(101, "NUM 5"),
          NUM_6: new gi.Schema.Key(102, "NUM 6"),
          NUM_7: new gi.Schema.Key(103, "NUM 7"),
          NUM_8: new gi.Schema.Key(104, "NUM 8"),
          NUM_9: new gi.Schema.Key(105, "NUM 9"),
          KEY_0: new gi.Schema.Key(48, "0"),
          KEY_1: new gi.Schema.Key(49, "1"),
          KEY_2: new gi.Schema.Key(50, "2"),
          KEY_3: new gi.Schema.Key(51, "3"),
          KEY_4: new gi.Schema.Key(52, "4"),
          KEY_5: new gi.Schema.Key(53, "5"),
          KEY_6: new gi.Schema.Key(54, "6"),
          KEY_7: new gi.Schema.Key(55, "7"),
          KEY_8: new gi.Schema.Key(56, "8"),
          KEY_9: new gi.Schema.Key(57, "9"),
          KEY_A: new gi.Schema.Key(65, "A"),
          KEY_B: new gi.Schema.Key(66, "B"),
          KEY_C: new gi.Schema.Key(67, "C"),
          KEY_D: new gi.Schema.Key(68, "D"),
          KEY_E: new gi.Schema.Key(69, "E"),
          KEY_F: new gi.Schema.Key(70, "F"),
          KEY_G: new gi.Schema.Key(71, "G"),
          KEY_H: new gi.Schema.Key(72, "H"),
          KEY_I: new gi.Schema.Key(73, "I"),
          KEY_J: new gi.Schema.Key(74, "J"),
          KEY_K: new gi.Schema.Key(75, "K"),
          KEY_L: new gi.Schema.Key(76, "L"),
          KEY_M: new gi.Schema.Key(77, "M"),
          KEY_N: new gi.Schema.Key(78, "N"),
          KEY_O: new gi.Schema.Key(79, "O"),
          KEY_P: new gi.Schema.Key(80, "P"),
          KEY_Q: new gi.Schema.Key(81, "Q"),
          KEY_R: new gi.Schema.Key(82, "R"),
          KEY_S: new gi.Schema.Key(83, "S"),
          KEY_T: new gi.Schema.Key(84, "T"),
          KEY_U: new gi.Schema.Key(85, "U"),
          KEY_V: new gi.Schema.Key(86, "V"),
          KEY_W: new gi.Schema.Key(87, "W"),
          KEY_X: new gi.Schema.Key(88, "X"),
          KEY_Y: new gi.Schema.Key(89, "Y"),
          KEY_Z: new gi.Schema.Key(90, "Z"),
          OPEN_BRACKET: new gi.Schema.Key(91, "["),
          CLOSE_BRACKET: new gi.Schema.Key(93, "]"),
          SEMICOLON: new gi.Schema.Key(186, ";"),
          EQUALS: new gi.Schema.Key(187, "="),
          COMMA: new gi.Schema.Key(188, ","),
          DASH: new gi.Schema.Key(189, "-"),
          PERIOD: new gi.Schema.Key(190, "."),
          FORWARD_SLASH: new gi.Schema.Key(191, "/"),
          GRAVE_ACCENT: new gi.Schema.Key(192, "`"),
          BACK_SLASH: new gi.Schema.Key(220, "\\"),
          SINGLE_QUOTE: new gi.Schema.Key(222, "'")
        };

    gi.Schema.KeyboardAPI.Standard = {};

    gi.Schema.KeyboardAPI.Standard.QWERTY = new gi.Schema.KeyboardAPI(
        gi.Schema.KeyboardAPI.Keys.UP_ARROW,
        gi.Schema.KeyboardAPI.Keys.DOWN_ARROW,
        gi.Schema.KeyboardAPI.Keys.LEFT_ARROW,
        gi.Schema.KeyboardAPI.Keys.RIGHT_ARROW,
        gi.Schema.KeyboardAPI.Keys.ENTER,
        gi.Schema.KeyboardAPI.Keys.KEY_A,
        gi.Schema.KeyboardAPI.Keys.KEY_S,
        gi.Schema.KeyboardAPI.Keys.KEY_D,
        gi.Schema.KeyboardAPI.Keys.KEY_F,
        undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined,
        gi.Schema.KeyboardAPI.Keys.KEY_Q,
        gi.Schema.KeyboardAPI.Keys.KEY_W,
        gi.Schema.KeyboardAPI.Keys.KEY_E,
        gi.Schema.KeyboardAPI.Keys.KEY_R
    );

    gi.Schema.KeyboardAPI.Standard.Dvorak = new gi.Schema.KeyboardAPI(
        gi.Schema.KeyboardAPI.Keys.UP_ARROW,
        gi.Schema.KeyboardAPI.Keys.DOWN_ARROW,
        gi.Schema.KeyboardAPI.Keys.LEFT_ARROW,
        gi.Schema.KeyboardAPI.Keys.RIGHT_ARROW,
        gi.Schema.KeyboardAPI.Keys.ENTER,
        gi.Schema.KeyboardAPI.Keys.KEY_A,
        gi.Schema.KeyboardAPI.Keys.KEY_O,
        gi.Schema.KeyboardAPI.Keys.KEY_E,
        gi.Schema.KeyboardAPI.Keys.KEY_U,
        undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined,
        gi.Schema.KeyboardAPI.Keys.SINGLE_QUOTE,
        gi.Schema.KeyboardAPI.Keys.COMMA,
        gi.Schema.KeyboardAPI.Keys.PERIOD,
        gi.Schema.KeyboardAPI.Keys.KEY_P
    );

    gi.Type = function(name, theme, themeSchemaNames)
    {
        this.name = name;
        this.theme = theme;
        if (name != "Keyboard")
        {
            this.schemaNames = {
                d_up        :   "↑",
                d_down      :   "↓",
                d_left      :   "←",
                d_right     :   "→",
                menu        :   "▶",
                button0     :   "button0",
                button1     :   "button1",
                button2     :   "button2",
                button3     :   "button3",
                l_up        :   "↑",
                l_down      :   "↓",
                l_left      :   "←",
                l_right     :   "→",
                r_up        :   "↑",
                r_down      :   "↓",
                r_left      :   "←",
                r_right     :   "→",
                l_button    :   "l_button",
                r_button    :   "r_button",
                l_trigger   :   "l_trigger",
                r_trigger   :   "r_trigger"
            };
            for (var i in themeSchemaNames)
            {
                if (i in this.schemaNames ) this.schemaNames[i] = themeSchemaNames[i];
            }
        }
    };
    gi.Type.prototype.enable = function(){};

    gi.Type.Hedgehog = new gi.Type("Hedgehog", new gi.Theme("HedgeHog"), {
            button0     :   "A",
            button1     :   "B",
            button2     :   "X",
            button3     :   "Y",
            l_button    :   "LB",
            r_button    :   "RB",
            l_trigger   :   "LT",
            r_trigger   :   "RT"
    });

    gi.Type.Plumber = new gi.Type("Plumber", new gi.Theme("Plumber"), {
            button0     :   "B",
            button1     :   "A",
            button2     :   "Y",
            button3     :   "X",
            l_button    :   "LB",
            r_button    :   "RB",
            l_trigger   :   "LT",
            r_trigger   :   "RT"
    });

    gi.Type.Ragdoll = new gi.Type("Ragdoll", new gi.Theme("Ragdoll"), {
            button0     :   "x",
            button1     :   "o",
            button2     :   "□",
            button3     :   "△",
            l_button    :   "L1",
            r_button    :   "R1",
            l_trigger   :   "L2",
            r_trigger   :   "R2"
    });

    gi.Type.Ragdoll4 = new gi.Type("Ragdoll", new gi.Theme("Ragdoll"), {
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

    gi.Type.Keyboard = new gi.Type("Keyboard", new gi.Theme("QWERTY"));

    gi.Type.Keyboard.StandardThemes = {
        QWERTY: new gi.Theme("QWERTY"),
        Dvorak: new gi.Theme("Dvorak"),
        Blank: new gi.Theme("Blank")
    };


    gi.Type.Keyboard.setQWERTY = function()
    {
        gi.Type.Keyboard.schema = gi.Schema.KeyboardAPI.Standard.QWERTY;
        gi.Type.Keyboard.theme = gi.Type.Keyboard.StandardThemes.QWERTY;

        if (typeof(gi.KeyboardWatcher.PlayerToWatch) !== "undefined" && typeof(gi.Players[gi.KeyboardWatcher.PlayerToWatch]) !== "undefined" )
        {
            gi.Players[gi.KeyboardWatcher.PlayerToWatch].schema = gi.Schema.KeyboardAPI.Standard.QWERTY;
            gi.Players[gi.KeyboardWatcher.PlayerToWatch].theme = gi.Type.Keyboard.StandardThemes.QWERTY;

            /* Treat this like a player reshuffle */
            for (var i = 0; i < gi.reshufflePlayersActions.length; i++)
            {
                if (typeof(gi.reshufflePlayersActions[i]) === "function") gi.reshufflePlayersActions[i]();
            }
        }
    };

    gi.Type.Keyboard.setDvorak = function()
    {
        gi.Type.Keyboard.schema = gi.Schema.KeyboardAPI.Standard.Dvorak;
        gi.Type.Keyboard.theme = gi.Type.Keyboard.StandardThemes.Dvorak;

        if (typeof(gi.KeyboardWatcher.PlayerToWatch) !== "undefined" && typeof(gi.Players[gi.KeyboardWatcher.PlayerToWatch]) !== "undefined" )
        {
            gi.Players[gi.KeyboardWatcher.PlayerToWatch].schema = gi.Schema.KeyboardAPI.Standard.Dvorak;
            gi.Players[gi.KeyboardWatcher.PlayerToWatch].theme = gi.Type.Keyboard.StandardThemes.Dvorak;

            /* Treat this like a player reshuffle */
            for (var i = 0; i < gi.reshufflePlayersActions.length; i++)
            {
                if (typeof(gi.reshufflePlayersActions[i]) === "function") gi.reshufflePlayersActions[i]();
            }
        }
    };

    /**
     * @param   schema  gi.Schema
     */
    gi.Model = function(type, iconName, id, os, schema)
    {
        this.type = type;
        this.iconName = iconName;
        this.id = id;
        this.os = os;
        this.schema = schema;
    };

    gi.Type.Keyboard.model = new gi.Model(
            gi.Type.Keyboard,
            "keyboard",
            "keyboard",
            undefined,
            gi.Schema.KeyboardAPI.Standard.QWERTY);

    gi.Models = {};
    gi.Models.Generic = [
        new gi.Model(
            gi.Type.Hedgehog,
            "xbox360",
            "XInput",
            undefined,
            new gi.Schema.GamePadAPI(
                13, 14, 15, 16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3)//,
                // TODO l_button,
                // TODO r_button,
                // TODO l_trigger,
                // TODO r_trigger
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "xbox360",
            "XBox 360",
            undefined,
            new gi.Schema.GamePadAPI(
                13, 14, 15, 16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5,6,7,8
        )),
        new gi.Model(
            gi.Type.Ragdoll,
            "ds3",
            "PLAYSTATION",
            undefined,
            new gi.Schema.GamePadAPI(
                5,7,8,6,
                8,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3)//,
                // TODO l_button,
                // TODO r_button,
                // TODO l_trigger,
                // TODO r_trigger
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "generic",
            "Logitech Rumblepad 2",
            undefined,
            new gi.Schema.GamePadAPI(
                12,13,14,15,
                10,
                2,3,1,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3)//,
                // TODO l_button,
                // TODO r_button,
                // TODO l_trigger,
                // TODO r_trigger
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "generic",
            "Logitech Dual Action",
            undefined,
            new gi.Schema.GamePadAPI(
                12,13,14,15,
                10,
                2,3,1,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3)//,
                // TODO l_button,
                // TODO r_button,
                // TODO l_trigger,
                // TODO r_trigger
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "generic",
            "STANDARD GAMEPAD",
            undefined,
            new gi.Schema.GamePadAPI(
                13, 14, 15, 16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5,6,7,8
        ))

    ];

    gi.Models.Specific = [
        new gi.Model(
            gi.Type.Hedgehog,
            "xbox360",
            "Xbox 360 Controller (XInput STANDARD GAMEPAD)",
            "Windows",
            new gi.Schema.GamePadAPI(
                13,14,15,16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5,6,7,8
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "generic",
            "0925-8866-SFC/USB Pad",
            "Windows",
            new gi.Schema.GamePadAPI(
                13,14,15,16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5,6,7,8
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "generic",
            "SFC/USB Pad (Vendor: 0925 Product: 8866)",
            "Windows",
            new gi.Schema.GamePadAPI(
                13,14,15,16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5,6,7,8
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "xbox360",
            "Xbox 360 Wireless Receiver (Vendor: 0000 Product: 0000)",
            "Linux",
            new gi.Schema.GamePadAPI(
                16,17,14,15,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5,6,7,8
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "xbox360",
            "0000-0000-Xbox 360 Wireless Receiver",
            "Linux",
            new gi.Schema.GamePadAPI(
                16,17,14,15,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5,6,7,8
        )),
        new gi.Model(
            gi.Type.Ragdoll4,
            "ds4",
            "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
            "Windows",
            new gi.Schema.GamePadAPI(
                13,14,15,16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5,6,7,8
        )),
        new gi.Model(
            gi.Type.Ragdoll4,
            "ds4",
            "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
            "Mac OS X",
            new gi.Schema.GamePadAPI(
            13, 14, 15, 16,
            10,
            1, 2, 3, 4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            new gi.Schema.AxisButton(-4),
            new gi.Schema.AxisButton(4),
            new gi.Schema.AxisButton(-3),
            new gi.Schema.AxisButton(3),
            5, 6, 7, 8
        )),
        new gi.Model(
            gi.Type.Ragdoll4,
            "ds4",
            "054c-05c4-Wireless Controller",
            "Windows",
            new gi.Schema.GamePadAPI(
                15, 16, 17, 18,
                10,
                2, 3, 1, 4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-6),
                new gi.Schema.AxisButton(6),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5, 6, 7, 8
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "xbox360",
            "©Microsoft Corporation Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)",
            "Linux",
            new gi.Schema.GamePadAPI(
                13,14,15,16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3)//,
                // TODO l_button,
                // TODO r_button,
                // TODO l_trigger,
                // TODO r_trigger
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "xbox360",
            "Performance Designed Products Afterglow Gamepad for Xbox 360 (Vendor: 0e6f Product: 0213)",
            "Linux",
            new gi.Schema.GamePadAPI(
                new gi.Schema.AxisButton(-8),
                new gi.Schema.AxisButton(8),
                new gi.Schema.AxisButton(-7),
                new gi.Schema.AxisButton(7),
                8,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-5),
                new gi.Schema.AxisButton(5),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                5,
                6,
                new gi.Schema.AxisButton(3),
                new gi.Schema.AxisButton(6)
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "xbox360",
            "0e6f-0213-Afterglow Gamepad for Xbox 360",
            "Linux",
            new gi.Schema.GamePadAPI(
                new gi.Schema.AxisButton(-8),
                new gi.Schema.AxisButton(8),
                new gi.Schema.AxisButton(-7),
                new gi.Schema.AxisButton(7),
                8,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-5),
                new gi.Schema.AxisButton(5),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                5,
                6,
                new gi.Schema.AxisButton(3),
                new gi.Schema.AxisButton(6)
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "dc",
            "HuiJia  USB GamePad (Vendor: 0e8f Product: 3013)",
            "Linux",
            new gi.Schema.GamePadAPI(
                13, 15, 16, 14,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined, undefined, 5, 6
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "dc",
            "USB GamePad (Vendor: 0e8f Product: 3013)",
            "Windows",
            new gi.Schema.GamePadAPI(
                13, 15, 16, 14,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                undefined,
                undefined,
                undefined,
                undefined,
                undefined, undefined, 5, 6
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "dc",
            "USB GamePad (Vendor: 0e8f Product: 3013)",
            "Mac OS X",
            new gi.Schema.GamePadAPI(
            13, 15, 16, 14,
            10,
            1, 2, 3, 4,
            new gi.Schema.AxisButton(-2),
            new gi.Schema.AxisButton(2),
            new gi.Schema.AxisButton(-1),
            new gi.Schema.AxisButton(1),
            undefined,
            undefined,
            undefined,
            undefined,
            undefined, undefined, 5, 6
        )),
        new gi.Model(
            gi.Type.Ragdoll,
            "ds3",
            "Sony PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)",
            "Linux",
            new gi.Schema.GamePadAPI(
                13, 14, 15, 16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5,6,7,8
        )),
        new gi.Model(
            gi.Type.Ragdoll,
            "ds3",
            "054c-0268-Sony PLAYSTATION(R)3 Controller",
            "Linux",
            new gi.Schema.GamePadAPI(
                5,7,8,6,
                4,
                15, 14, 16, 13,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                11,12,9,10
        )),
        new gi.Model(
            gi.Type.Ragdoll4,
            "ds4",
            "Sony Computer Entertainment Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
            "Linux",
            new gi.Schema.GamePadAPI(
                13,14,15,16,
                10,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5, 6, 7, 8
        )),
        new gi.Model(
            gi.Type.Ragdoll4,
            "ds4",
            "054c-05c4-Sony Computer Entertainment Wireless Controller",
            "Linux",
            new gi.Schema.GamePadAPI(
                new gi.Schema.AxisButton(-8),
                new gi.Schema.AxisButton(8),
                new gi.Schema.AxisButton(-7),
                new gi.Schema.AxisButton(7),
                10,
                2,3,1,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-6),
                new gi.Schema.AxisButton(6),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5, 6, 7, 8
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "joystick",
            "Mayflash Arcade Stick (Vendor: 0e8f Product: 0003)",
            "Windows",
            new gi.Schema.GamePadAPI(
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                10,
                1, 2, 3, 4,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                5, 6, 7, 8
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "joystick",
            "PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)", /* Mayflash Arcade Stick */
            "Mac OS X",
            new gi.Schema.GamePadAPI(
            13, 14, 15, 16,
            10,
            7, 1, 2, 8,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            5, 3, 4, 6
        )),
        new gi.Model(
            gi.Type.Ragdoll,
            "joystick",
            "MY-POWER CO.,LTD. Mayflash Arcade Stick (STANDARD GAMEPAD Vendor: 0e8f Product: 0003)",
            "Linux",
            new gi.Schema.GamePadAPI(
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                10,
                4,2,1,3,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                7,8,5,6
        )),
        new gi.Model(
            gi.Type.Ragdoll,
            "joystick",
            "0e8f-0003-MY-POWER CO.,LTD. Mayflash Arcade Stick",
            "Linux",
            new gi.Schema.GamePadAPI(
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                10,
                1,2,3,4,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                5,6,7,8
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "generic",
            "ASUS Gamepad",
            "Android",
            new gi.Schema.GamePadAPI(
                undefined,
                undefined,
                undefined,
                undefined,
                12,
                1,2,3,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-4),
                new gi.Schema.AxisButton(4),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                7, 8, 5, 6
        )),
        new gi.Model(
            gi.Type.Hedgehog,
            "generic",
            "NYKO PLAYPAD PRO",
            "Android",
            new gi.Schema.GamePadAPI(
                new gi.Schema.AxisButton(-8),
                new gi.Schema.AxisButton(8),
                new gi.Schema.AxisButton(-7),
                new gi.Schema.AxisButton(7),
                10,
                2,3,1,4,
                new gi.Schema.AxisButton(-2),
                new gi.Schema.AxisButton(2),
                new gi.Schema.AxisButton(-1),
                new gi.Schema.AxisButton(1),
                new gi.Schema.AxisButton(-6),
                new gi.Schema.AxisButton(6),
                new gi.Schema.AxisButton(-3),
                new gi.Schema.AxisButton(3),
                5, 6, 7, 8
        ))
    ];

    gi.KeyboardWatcher = new function()
    {
        var watcher = this;
        this.PlayerToWatch = undefined;

        //setup keydown/keyup events
        window.addEventListener("keyup", function(e) {
            if (!gi.handleKeyboard) return;

            var player = gi.Players[gi.KeyboardWatcher.PlayerToWatch];
            if (typeof(player) !== "undefined" && typeof(player.schema) !== "undefined" )
            {
                var schemaButtonName = player.schema.lookup(e.which);
                if (typeof(schemaButtonName) !== "undefined" ) player.buttonUp(schemaButtonName);
            }
        });

        window.addEventListener("keydown", function(e) {
            if (!gi.handleKeyboard) return;

            var player = gi.Players[gi.KeyboardWatcher.PlayerToWatch];
            if (typeof(player) !== "undefined" && typeof(player.schema) !== "undefined" )
            {
                var schemaButtonName = player.schema.lookup(e.which);
                if (typeof(schemaButtonName) !== "undefined" ) player.buttonDown(schemaButtonName);
            }
        });
    };

    gi.loopingUpdate = true;

    gi.startUpdateLoop = function()
    {
        gi.loopingUpdate = true;
        gi.nextUpdateLoop();
    }

    gi.stopUpdateLoop = function()
    {
        gi.loopingUpdate = false;
    }

    gi.nextUpdateLoop = function()
    {
        if (gi.loopingUpdate === false) return;
        gi.update();
         requestAnimationFrame(gi.nextUpdateLoop); // way too slow!
    }

    gi.update = function()
    {
        if (gi.canUseGamepadAPI())
        {
            gi.Connection.Gamepads = navigator.getGamepads();

            for (var i = 0; i < gi.Connection.Gamepads.length; i++)
            {
                gi.Players[i].previous.state = gi.Players[i].state;
                gi.Players[i].state = {};

                var currentGamepad = gi.Connection.Gamepads[i];
                var currentSchema = gi.Players[i].schema;

                if (typeof(currentGamepad) === "undefined") continue;

                for (var j in currentSchema)
                {
                    if (typeof(currentSchema[j]) === "undefined")
                    {
                        //skip
                    }
                    else if ( typeof(currentGamepad.buttons[currentSchema[j] - 1]
                               ) === "undefined")
                    {
                        var negativeAxis = false;
                        if (currentSchema[j].threshold < 0) negativeAxis = true;

                        var axisValue = currentGamepad.axes[currentSchema[j].index - 1];
                        var threshold = currentSchema[j].threshold;

                        gi.Players[i].state[j] = (negativeAxis && axisValue < threshold) || (!negativeAxis && axisValue > threshold);
                    }
                    else
                    {
                        gi.Players[i].state[j] = currentGamepad.buttons[currentSchema[j] - 1].pressed;
                    }
                }
            }

            // Keydown / Keyup
            for (var i = 0; i < gi.Players.length; i++)
            {
                for (var j in gi.Players[i].state)
                {
                    if (gi.firstPress !== true)
                    {
                        gi.firstPress = true;
                        return;
                    }

                    if ( gi.Players[i].previous.state[j] === false
                        && gi.Players[i].state[j] === true )
                    {
                        gi.Players[i].buttonDown(j);
                    }
                    else if ( gi.Players[i].previous.state[j] === true
                        && gi.Players[i].state[j] === false )
                    {
                        gi.Players[i].buttonUp(j);
                    }
                }
            }
        }
    };

    gi.initialGamePadSetup = function()
    {
        // Pause Game or similar
        for (var i = 0; i < gi.reshufflePlayersActions.length; i++)
        {
            if (typeof(gi.reshufflePlayersActions[i]) === "function") gi.reshufflePlayersActions[i]();
        }

        //clear gamepad information
        for (var i = 0; i < gi.Players.length; i++)
        {
            gi.Players[i].type = undefined;
            gi.Players[i].model = undefined;
            gi.Players[i].schema = undefined;
            gi.Players[i].theme = undefined;
        }

        if (gi.canUseGamepadAPI())
        {
            window.addEventListener("gamepadconnected", function(e) {
                if (gi.debug) console.debug("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                    e.gamepad.index, e.gamepad.id,
                    e.gamepad.buttons.length, e.gamepad.axes.length);
                gi.Connection.gained(e.gamepad);
                gi.initialGamePadSetup();
            }, false);

            window.addEventListener("gamepaddisconnected", function(e) {
                if (gi.debug) console.debug("Gamepad disconnected from index %d: %s",
                    e.gamepad.index, e.gamepad.id);
                gi.Connection.lost(e.gamepad);
                gi.initialGamePadSetup();
            }, false);

            gi.Connection.Gamepads = navigator.getGamepads();

            if (   gi.Connection.Gamepads[0] === undefined
                && gi.Connection.Gamepads[1] === undefined
                && gi.Connection.Gamepads[2] === undefined
                && gi.Connection.Gamepads[3] === undefined )
            {
                gi.firstPress = false;
            }

            for (var i in gi.Connection.Gamepads)
            {
                if (gi.Connection.Gamepads[i] instanceof Gamepad)
                {
                    //Translate into Type -  Players order is gamepad order
                    for (var j = 0; j < gi.Models.Specific.length; j++)
                    {
                        if ( toASCII(gi.Models.Specific[j].id) === toASCII(gi.Connection.Gamepads[i].id)
                            && gi.os === gi.Models.Specific[j].os )
                        {
                            gi.Players[i].type = gi.Models.Specific[j].type;
                            gi.Players[i].model = gi.Models.Specific[j];
                            gi.Players[i].schema = gi.Models.Specific[j].schema;
                            gi.Players[i].theme = gi.Models.Specific[j].type.theme;
                        }
                    }

                    if (typeof(gi.Players[i].model) === "undefined")
                    {
                        for (var j = 0; j < gi.Models.Generic.length; j++)
                        {
                            if (gi.Connection.Gamepads[i].id.match(gi.Models.Generic[j].id) !== null)
                            {
                                gi.Players[i].type = gi.Models.Generic[j].type;
                                gi.Players[i].model = gi.Models.Generic[j];
                                gi.Players[i].schema = gi.Models.Generic[j].schema;
                                gi.Players[i].theme = gi.Models.Generic[j].type.theme;
                            }
                        }

                        if (gi.Connection.Gamepads[i] instanceof Gamepad && typeof(gi.Players[i].model) === "undefined")
                        {
                            console.warn("Gamepad not mapped: \"" + gi.Connection.Gamepads[i].id + "\"");
                        }
                    }

                    // blank state to start
                    gi.Players[i].state = {};

                    // setup Previous as current
                    gi.Players[i].previous.type = gi.Players[i].type;
                    gi.Players[i].previous.model = gi.Players[i].model;
                    gi.Players[i].previous.schema = gi.Players[i].schema;
                    gi.Players[i].previous.theme = gi.Players[i].theme;
                    gi.Players[i].previous.state = gi.Players[i].state;

                }
            }
        }
        else if (gi.debug)
        {
            console.debug("This browser does not support the Gamepad API");
        }

        //Setup Keyboard player
        if (gi.handleKeyboard)
        {
            gi.KeyboardWatcher.PlayerToWatch = undefined;
            for (var i = 0; i < gi.Players.length; i++)
            {
                // last player is keyboard
                if (gi.Players[i].type === undefined)
                {
                    gi.Players[i].type = gi.Type.Keyboard;
                    gi.Players[i].model = gi.Type.Keyboard.model;
                    gi.Players[i].schema = gi.Type.Keyboard.schema;
                    gi.Players[i].theme = gi.Type.Keyboard.theme;

                    gi.KeyboardWatcher.PlayerToWatch = i;
                    break;
                }
            }
        }
        else
        {
            gi.KeyboardWatcher.PlayerToWatch = undefined;
        }
    }

    gi.reshufflePlayersActions = [];

    gi.onReshufflePlayers = function(action)
    {
        gi.reshufflePlayersActions.push(action);
    }

    /* Initial Configuration */

    /* Detect OS */
    var clientStrings = [
        {s:'Android', r:/Android/},
        {s:'iOS', r:/(iPhone|iPad|iPod)/},
        {s:'Windows', r:/Windows/},
        {s:'Mac OS X', r:/Mac/},
        {s:'Linux', r:/(Linux|X11)/},
    ];
    for (var id in clientStrings) {
        if (clientStrings[id].r.test(navigator.userAgent)) { gi.os = clientStrings[id].s; break; }
    }

    gi.initialGamePadSetup();
    if (typeof(gi.Type.Keyboard.schema) === "undefined") gi.Type.Keyboard.setQWERTY();
    gi.startUpdateLoop();

    GameInput = gi; //Setup nicer looking alias
})();


/**
 * @preserve
 * @license-end
 */
