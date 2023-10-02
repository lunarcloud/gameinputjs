/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/gameinput.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */
import { Vector2, GamepadAPI, GameInputModel, GameInputSchemaType, SchemaAxisButton } from './gameinput.types'
import { GameInputModels } from './gameinput.models'


const osStrings = [
    {s:'Android', r:/Android/},
    {s:'iOS', r:/(iPhone|iPad|iPod)/},
    {s:'Windows', r:/Windows/},
    {s:'macOS', r:/Mac/},
    {s:'Linux', r:/(Linux|X11)/}
];

function normalize(val, min, max) {
    return (val-min)/(max-min);
}

class GameInputPlayer {

    #gameInput

    constructor(gameInput, number) {
        this.#gameInput = gameInput
        this.number = number;
        this.index = number - 1;

        this.type;
        this.model;
        this.schema;
        this.theme;
        this.state;
        this.analog;

        this.previous = {
            type: undefined,
            model: undefined,
            schema: undefined,
            state: undefined,
            analog: undefined,
        };

        this.buttonDownActions = {};
        this.buttonUpActions = {};

        for (var i in GameInput.SchemaNames) {
            this.buttonDownActions[GameInput.SchemaNames[i]] = [];
            this.buttonUpActions[GameInput.SchemaNames[i]] = [];
        }
    }
    buttonDown(schemaName) {
        this.#gameInput.buttonDown(this.index, schemaName);
        for (var action in this.buttonDownActions[schemaName])
            this.buttonDownActions[schemaName][action]();
    }
    buttonUp(schemaName) {
        this.#gameInput.buttonUp(this.index, schemaName);
        for (var action in this.buttonUpActions[schemaName])
            this.buttonUpActions[schemaName][action]();
    }
    onButtonDown(schemaName, action) {
        if (schemaName in GameInput.SchemaNames === false) throw "Must be SchemaNames";
        if (typeof (action) !== "function") throw "Action must be a function";

        this.buttonDownActions[schemaName].push(action);
    }
    onButtonUp(schemaName, action) {
        if (schemaName in GameInput.SchemaNames === false) throw "Must be SchemaNames";
        if (typeof (action) !== "function") throw "Action must be a function";

        this.buttonUpActions[schemaName].push(action);
    }
    getStickVector(stick) {
        if (stick != "l" && stick != "r") throw "Must be l or r";

        var x = 0;
        var y = 0;

        if (this.schema[stick + "_up"] instanceof SchemaAxisButton) {
            if (this.schema[stick + "_up"].direction == "negative") {
                y -= this.analog[stick + "_up"] < this.schema[stick + "_up"].deadZone ? Math.abs(this.analog[stick + "_up"]) : 0;
            } else {
                y -= this.analog[stick + "_up"] > this.schema[stick + "_up"].deadZone ? Math.abs(this.analog[stick + "_up"]) : 0;
            }
        } else {
            y -= 0.7;
        }

        if (this.schema[stick + "_down"] instanceof SchemaAxisButton) {
            if (this.schema[stick + "_down"].direction == "negative") {
                y += this.analog[stick + "_down"] < this.schema[stick + "_down"].deadZone ? Math.abs(this.analog[stick + "_down"]) : 0;
            } else {
                y += this.analog[stick + "_down"] > this.schema[stick + "_down"].deadZone ? Math.abs(this.analog[stick + "_down"]) : 0;
            }
        } else {
            x += 0.7;
        }

        if (this.schema[stick + "_left"] instanceof SchemaAxisButton) {
            if (this.schema[stick + "_left"].direction == "negative") {
                x -= this.analog[stick + "_left"] < this.schema[stick + "_left"].deadZone ? Math.abs(this.analog[stick + "_left"]) : 0;
            } else {
                x -= this.analog[stick + "_left"] > this.schema[stick + "_left"].deadZone ? Math.abs(this.analog[stick + "_left"]) : 0;
            }
        } else {
            x -= 0.7;
        }

        if (this.schema[stick + "_right"] instanceof SchemaAxisButton) {
            if (this.schema[stick + "_right"].direction == "negative") {
                x += this.analog[stick + "_right"] < this.schema[stick + "_right"].deadZone ? Math.abs(this.analog[stick + "_right"]) : 0;
            } else {
                x += this.analog[stick + "_right"] > this.schema[stick + "_right"].deadZone ? Math.abs(this.analog[stick + "_right"]) : 0;
            }
        } else {
            x += 0.7;
        }

        return new Vector2(x, y);

    }
    getNormalizedStickVector(stick) {
        var stickInput = this.getStickVector(stick);
        var radialDeadZone = 0;

        for (var direction in ["up", "down", "left", "right"]) {
            if (this.schema[stick + "_" + direction] instanceof SchemaAxisButton) {
                if (this.schema[stick + "_" + direction].deadZone > radialDeadZone) {
                    radialDeadZone = this.schema[stick + "_" + direction].deadZone;
                }
            }
        }

        if (stickInput.magnitude < radialDeadZone) {
            return new Vector2(0, 0);
        } else {
            return stickInput.normalize().scale((stickInput.magnitude() - radialDeadZone) / (1 - radialDeadZone));
        }
    }
    getNormalizedTriggerValue(trigger) {
        if (trigger != "l" && trigger != "r") throw "Must be l or r";
        trigger += "_trigger";

        if (this.schema[trigger] instanceof SchemaKey
            || this.schema[trigger] instanceof SchemaButton) {
            return this.state[trigger] ? 1 : 0;
        }
        // else  this.schema[trigger] instanceof SchemaAxisButton
        return normalize(
        /*val*/ this.state[trigger],
            /*min*/ this.schema[trigger].deadZone,
            /*max*/ 1
        );
    }
    /**
     * @desc    Gets the button text
     * @param   schemaName      name of the button or axisValue
     * @param   symbolsAsWords  whether or not to convert Ragdoll's "x □ o △" to "cross square circle triangle"
     */
    getButtonText(schemaName, symbolsAsWords) {
        if (this.model && this.model.type) {
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
};


/**
 * GameInput
 * @brief   Game Input System
 * @desc    System for using a gamepad control scheme for games
 */
class GameInput {

    debug = true; // disable to remove console output

    /* Helper function */
    static toASCII (text) {
        return text.replace(/[^\x00-\x7F]/g, ""); /* eslint-disable-line no-control-regex */
    }

    static os = "Other";
    static browser = "Other";
    static firstPress = false;

    static canUseGamepadAPI ()
    {
        return "getGamepads" in navigator;
    }

    buttonDownActions = [];
    buttonUpActions = [];

    onButtonDown (action) {
        if (typeof(action) !== "function") throw "Action must be a function";
        this.buttonDownActions.push(action);
    }

    onButtonUp (action) {
        if (typeof(action) !== "function") throw "Action must be a function";
        this.buttonUpActions.push(action);
    }

    buttonDown (player, schemaName) {
        for ( var action in this.buttonDownActions) {
            if (typeof(this.buttonDownActions[action]) === "function")
                this.buttonDownActions[action](player, schemaName);
        }
    }

    buttonUp (player, schemaName) {
        for ( var action in this.buttonUpActions) {
            if (typeof(this.buttonUpActions[action]) === "function")
                this.buttonUpActions[action](player, schemaName);
        }
    }

    Players = [
        new GameInputPlayer(this, 1),
        new GameInputPlayer(this, 2),
        new GameInputPlayer(this, 3),
        new GameInputPlayer(this, 4)
    ];

    Connection = {
        GamePadMapping: {
            0 : 0,
            1 : 1,
            2 : 2,
            3 : 3
        },
        Gamepads: [undefined, undefined, undefined, undefined]
    }

    getPlayer (index) {
        return this.Players[this.Connection.GamePadMapping[index]];
    }

    static SchemaNames = {
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
    }

    Models = {
        UnknownStandardMapping: new GameInputModel(
            GameInputSchemaType.Hedgehog,
            "generic",
            undefined,
            undefined,
            GamepadAPI.Stardard),

        Generic: [
            new GameInputModel(
                GameInputSchemaType.Hedgehog,
                "xbox360",
                "XInput",
                undefined,
                GamepadAPI.Stardard
            ),
            new GameInputModel(
                GameInputSchemaType.Hedgehog,
                "xbox360",
                "xinput",
                undefined,
                GamepadAPI.Stardard
            ),
            new GameInputModel(
                GameInputSchemaType.Hedgehog,
                "xbox360",
                "XBox 360",
                undefined,
                GamepadAPI.Stardard
            ),
            new GameInputModel(
                GameInputSchemaType.Hedgehog,
                "generic",
                "Logitech Rumblepad 2",
                undefined,
                new GamepadAPI(
                    12,13,14,15,
                    10,
                    2,3,1,4,
                    new SchemaAxisButton(-2),
                    new SchemaAxisButton(2),
                    new SchemaAxisButton(-1),
                    new SchemaAxisButton(1),
                    new SchemaAxisButton(-4),
                    new SchemaAxisButton(4),
                    new SchemaAxisButton(-3),
                    new SchemaAxisButton(3)//,
                    // TODO l_button,
                    // TODO r_button,
                    // TODO l_trigger,
                    // TODO r_trigger
            )),
            new GameInputModel(
                GameInputSchemaType.Hedgehog,
                "generic",
                "Logitech Dual Action",
                undefined,
                new GamepadAPI(
                    12,13,14,15,
                    10,
                    2,3,1,4,
                    new SchemaAxisButton(-2),
                    new SchemaAxisButton(2),
                    new SchemaAxisButton(-1),
                    new SchemaAxisButton(1),
                    new SchemaAxisButton(-4),
                    new SchemaAxisButton(4),
                    new SchemaAxisButton(-3),
                    new SchemaAxisButton(3)//,
                    // TODO l_button,
                    // TODO r_button,
                    // TODO l_trigger,
                    // TODO r_trigger
            )),
            new GameInputModel(
                GameInputSchemaType.Hedgehog,
                "generic",
                "STANDARD GAMEPAD",
                undefined,
                GamepadAPI.Stardard
            )
        ],

        Specific: GameInputModels // imported
    }

    loopingUpdate = true;

    startUpdateLoop ()
    {
        this.loopingUpdate = true;
        this.nextUpdateLoop();
    };

    stopUpdateLoop ()
    {
        this.loopingUpdate = false;
    };

    nextUpdateLoop ()
    {
        if (this.loopingUpdate === false)
            return;

        this.update();
        requestAnimationFrame(() => this.nextUpdateLoop()); // way too slow!
    };

    update ()
    {
        if (!GameInput.canUseGamepadAPI())
            return;

        this.Connection.Gamepads = navigator.getGamepads();

        for (let i = 0; i < this.Connection.Gamepads.length; i++)
        {
            this.Players[i].previous.state = this.Players[i].state;
            this.Players[i].state = {};
            this.Players[i].previous.analog = this.Players[i].analog;
            this.Players[i].analog = {};

            var currentGamepad = this.Connection.Gamepads[i];
            var currentSchema = this.Players[i].schema;

            if (typeof(currentGamepad) === "undefined" || currentGamepad === null) continue;

            for (let j in currentSchema)
            {
                if (typeof(currentSchema[j]) === "undefined")
                {
                    //skip
                }
                else if ( typeof(currentGamepad.buttons[currentSchema[j] - 1] ) === "undefined")
                {
                    var negativeAxis = currentSchema[j].threshold < 0;

                    var axisValue = this.Players[i].analog[j] = currentGamepad.axes[currentSchema[j].index - 1];

                    this.Players[i].state[j] = (negativeAxis && axisValue < currentSchema[j].threshold) || (!negativeAxis && axisValue > currentSchema[j].threshold);
                }
                else
                {
                    this.Players[i].state[j] = currentGamepad.buttons[currentSchema[j] - 1].pressed;

                    this.Players[i].analog[j] = this.Players[i].state[j] ? 1 : 0;
                }
            }
        }

        // Keydown / Keyup
        for (let i = 0; i < this.Players.length; i++)
        {
            for (let j in this.Players[i].state)
            {
                if (this.firstPress !== true)
                {
                    this.firstPress = true;
                    return;
                }

                if ( this.Players[i].previous.state[j] === false
                    && this.Players[i].state[j] === true )
                {
                    this.Players[i].buttonDown(j);
                }
                else if ( this.Players[i].previous.state[j] === true
                    && this.Players[i].state[j] === false )
                {
                    this.Players[i].buttonUp(j);
                }
            }
        }
    }

    gamepadsCount ()
    {
        var gamepads = navigator.getGamepads();
        var count = 0;

        for (let i = 0; i < 4; i++) {
            count += typeof gamepads[i] === "object" && gamepads[i] !== null ? 1 : 0;
        }

        return count;
    }

    lastCheckedNumberOfGamepads = -1;

    connectionWatchLoop () {
        var currentNumberOfGamepads = this.gamepadsCount();

        if ( this.lastCheckedNumberOfGamepads !== currentNumberOfGamepads) {
            if ( this.debug )
                console.debug("Now have " + currentNumberOfGamepads + " gamepad(s).");

            this.lastCheckedNumberOfGamepads = currentNumberOfGamepads;
            this.initialGamePadSetup();
        }

        requestAnimationFrame(() => this.connectionWatchLoop());
    }

    initialGamePadSetup ()
    {
        //clear gamepad information
        for (let i = 0; i < this.Players.length; i++)
        {
            this.Players[i].type = undefined;
            this.Players[i].model = undefined;
            this.Players[i].schema = undefined;
            this.Players[i].theme = undefined;
        }

        if (GameInput.canUseGamepadAPI())
        {
            this.Connection.Gamepads = navigator.getGamepads();

            if (   this.Connection.Gamepads[0] === undefined
                && this.Connection.Gamepads[1] === undefined
                && this.Connection.Gamepads[2] === undefined
                && this.Connection.Gamepads[3] === undefined )
            {
                this.firstPress = false;
            }

            for (let i in this.Connection.Gamepads)
            {
                if (this.Connection.Gamepads[i] instanceof Gamepad)
                {
                    //Translate into Type -  Players order is gamepad order
                    for (let j = 0; j < this.Models.Specific.length; j++)
                    {
                        if ( GameInput.toASCII(this.Models.Specific[j].id) === GameInput.toASCII(this.Connection.Gamepads[i].id)
                            && this.os === this.Models.Specific[j].os )
                        {
                            this.Players[i].type = this.Models.Specific[j].type;
                            this.Players[i].model = this.Models.Specific[j];
                            this.Players[i].schema = this.Models.Specific[j].schema;
                            this.Players[i].theme = this.Models.Specific[j].type.theme;

                            if (this.debug) {
                                console.debug("Gamepad of type " +  this.Players[i].type.name + " configured");
                            }
                            break;
                        }
                    }

                    if (typeof(this.Players[i].model) === "undefined")
                    {
                        for (let j = 0; j < this.Models.Generic.length; j++)
                        {
                            if (this.Connection.Gamepads[i].id.match(this.Models.Generic[j].id) !== null)
                            {
                                this.Players[i].type = this.Models.Generic[j].type;
                                this.Players[i].model = this.Models.Generic[j];
                                this.Players[i].schema = this.Models.Generic[j].schema;
                                this.Players[i].theme = this.Models.Generic[j].type.theme;
                                if (this.debug) {
                                    console.debug("Gamepad of type " +  this.Players[i].type.name + " configured");
                                }
                            }
                        }

                        if (this.Connection.Gamepads[i] instanceof Gamepad && typeof(this.Players[i].model) === "undefined")
                        {
                            if (this.debug) {
                                if (this.Connection.Gamepads[i].mapping === "standard") {
                                    console.debug("Gamepad not detected, detected \"stardard\" mapping: \"" + this.Connection.Gamepads[i].id + "\"");
                                } else {
                                    console.debug("Gamepad not detected, forcing \"stardard\" mapping: \"" + this.Connection.Gamepads[i].id + "\"");
                                }
                            }

                            this.Players[i].type = this.Models.UnknownStandardMapping.type;
                            this.Players[i].model = this.Models.UnknownStandardMapping;
                            this.Players[i].schema = this.Models.UnknownStandardMapping.schema;
                            this.Players[i].theme = this.Models.UnknownStandardMapping.theme;

                            if (this.debug) {
                                console.debug("Gamepad of type " +  this.Players[i].type.name + " configured");
                            }
                        }
                    }

                    // blank state to start
                    this.Players[i].state = {};
                    this.Players[i].analog = {};

                    // setup Previous as current
                    this.Players[i].previous.type = this.Players[i].type;
                    this.Players[i].previous.model = this.Players[i].model;
                    this.Players[i].previous.schema = this.Players[i].schema;
                    this.Players[i].previous.theme = this.Players[i].theme;
                    this.Players[i].previous.state = this.Players[i].state;
                    this.Players[i].previous.analog = this.Players[i].analog;

                }
            }
        }
        else if (this.debug)
        {
            console.debug("This browser does not support the Gamepad API");
        }

        // Pause Game or similar
        for (let i = 0; i < this.reshufflePlayersActions.length; i++)
        {
            if (typeof(this.reshufflePlayersActions[i]) === "function")
                this.reshufflePlayersActions[i]();
        }
    }

    reshufflePlayersActions = [];

    onReshufflePlayers (action)
    {
        this.reshufflePlayersActions.push(action);
    }

    constructor () {
        /* Detect OS */
        for (var id in osStrings) {
            if (osStrings[id].r.test(navigator.userAgent)) { this.os = osStrings[id].s; break; }
        }

        /* Detect Browser */
        if (/Chrome/.test(navigator.userAgent)) {
            this.browser = "Chrome";
        } else if (/Firefox/.test(navigator.userAgent)) {
            this.browser = "Firefox";
        } // else { this.browser = "Other" }


        this.startUpdateLoop();

        // Start watching for gamepads joining and leaving
        if (GameInput.canUseGamepadAPI())
        {
            this.connectionWatchLoop();

            // warning, these are very unreliable!
            window.addEventListener("gamepadconnected", function(e) {
                if (this.debug)
                    console.debug("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                        e.gamepad.index, e.gamepad.id,
                        e.gamepad.buttons.length, e.gamepad.axes.length);
            }, false);

            window.addEventListener("gamepaddisconnected", function(e) {
                if (this.debug)
                    console.debug("Gamepad disconnected from index %d: %s",
                        e.gamepad.index, e.gamepad.id);
            }, false);
        }
    }
}

export default GameInput
export { GameInput, Vector2 }

/**
 * @preserve
 * @license-end
 */
