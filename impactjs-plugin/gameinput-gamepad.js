/**
 * @author  Samuel J Sarette
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this module.
 *
 * Copyright (C) 2016  Samuel J Sarette
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Except as contained in this notice, the name of the copyright holder shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the copyright holder.
 *
 * @licend  The above is the entire license notice for the JavaScript code in this module.
 */
ig.module(
    'plugins.gameinput-gamepad'
)
.requires(
    'impact.input',
    'impact.game'
)
.defines(function(){
    "use strict";

    // Assign some values to the Gamepad buttons. We use an offset of 256
    // here so we don't collide with the keyboard buttons when binding.
    ig.GAMEPAD_BUTTON_OFFSET = 256;

    for (var i = 1; i <= 4; i++) {
        ig['GAMEPAD' + i] = {
            d_up    :     ig.GAMEPAD_BUTTON_OFFSET * i + 0,
            d_down    :     ig.GAMEPAD_BUTTON_OFFSET * i + 1,
            d_left    :     ig.GAMEPAD_BUTTON_OFFSET * i + 2,
            d_right    :     ig.GAMEPAD_BUTTON_OFFSET * i + 3,
            menu    :     ig.GAMEPAD_BUTTON_OFFSET * i + 4,
            button0    :     ig.GAMEPAD_BUTTON_OFFSET * i + 5,
            button1    :     ig.GAMEPAD_BUTTON_OFFSET * i + 6,
            button2    :     ig.GAMEPAD_BUTTON_OFFSET * i + 7,
            button3    :     ig.GAMEPAD_BUTTON_OFFSET * i + 8,
            l_up    :     ig.GAMEPAD_BUTTON_OFFSET * i + 9,
            l_down    :     ig.GAMEPAD_BUTTON_OFFSET * i + 10,
            l_left    :    ig.GAMEPAD_BUTTON_OFFSET * i + 11,
            l_right    :    ig.GAMEPAD_BUTTON_OFFSET * i + 12,
            r_up    :     ig.GAMEPAD_BUTTON_OFFSET * i + 13,
            r_down    :     ig.GAMEPAD_BUTTON_OFFSET * i + 14,
            r_left    :    ig.GAMEPAD_BUTTON_OFFSET * i + 15,
            r_right    :    ig.GAMEPAD_BUTTON_OFFSET * i + 16,
            l_button    :    ig.GAMEPAD_BUTTON_OFFSET * i + 17,
            r_button    :    ig.GAMEPAD_BUTTON_OFFSET * i + 18,
            l_trigger    :    ig.GAMEPAD_BUTTON_OFFSET * i + 19,
            r_trigger    :    ig.GAMEPAD_BUTTON_OFFSET * i + 20
        };
    }

    ig.normalizeVendorAttribute(navigator, 'getGamepads');

    ig.Input.inject({
        hasSetupGameInput: [false,false,false,false],

        maxPlayers: 4,

        disableGamepadLeftAnalogStrafe: false,

        gamepadHasRightStick: function(player)
        {
            if (isNaN(player)) player = 1;
            var index = player - 1;

            if (ig.input.disableGamepadLeftAnalogStrafe) return false;
            if (GameInput.Players[GameInput.Connection.GamePadMapping[index]].schema === undefined) return false;

            return GameInput.Players[GameInput.Connection.GamePadMapping[index]].schema.r_left !== undefined
                &&  GameInput.Players[GameInput.Connection.GamePadMapping[index]].schema.r_right !== undefined
                /* && GameInput.Players[GameInput.Connection.GamePadMapping[index]].schema.r_up !== undefined
                &&  GameInput.Players[GameInput.Connection.GamePadMapping[index]].schema.r_down !== undefined */
                ;
        },

        onGamepadChange: function(action) { GameInput.onReshufflePlayers(action); },

        pollGamepads: function()
        {
            for (var i = 1; i <= ig.input.maxPlayers; i++) {
                ig.input.pollGamepad(i);
            }
        },

        pollGamepad: function(player)
        {
            if (isNaN(player)) player = 1;
            var index = player - 1;

            if (ig.input.hasSetupGameInput[index] === false)
            {
                GameInput.stopUpdateLoop();
                GameInput.handleKeyboard = false;
                GameInput.initialGamePadSetup();

                if (typeof(GameInput.Type.Keyboard.schema) === "undefined") GameInput.Type.Keyboard.setQWERTY();


                GameInput.stopUpdateLoop();

                // setup action-gameinput relationship
                for (var i in ig['GAMEPAD' + player])
                {
                    (function(){
                        var button = i;
                        GameInput.Players[GameInput.Connection.GamePadMapping[index]].onButtonDown(button, function() {
                            if (typeof(ig.input.bindings[ig['GAMEPAD' + player][button]]) === "undefined") return;
                            ig.input.actions[ig.input.bindings[ig['GAMEPAD' + player][button]]] = true;
                            ig.input.presses[ig.input.bindings[ig['GAMEPAD' + player][button]]] = true;
                        });
                        GameInput.Players[GameInput.Connection.GamePadMapping[index]].onButtonUp(button, function() {
                            if (typeof(ig.input.bindings[ig['GAMEPAD' + player][button]]) === "undefined") return;
                            ig.input.delayedKeyup[ig.input.bindings[ig['GAMEPAD' + player][button]]] = true;
                        });
                    }());
                }

                ig.input.hasSetupGameInput[index] = true;
            }
            if (!document.hasFocus || document.hasFocus()) GameInput.update();
        },

        getGamepadId: function(player)
        {
            if (isNaN(player)) player = 1;
            var index = player - 1;

            if (typeof(GameInput.Players[GameInput.Connection.GamePadMapping[index]].model) !== "undefined") {
                    return GameInput.Players[GameInput.Connection.GamePadMapping[index]].model.id;
            }
            return false;
        },

        getGamepadType: function(player)
        {
            if (isNaN(player)) player = 1;
            var index = player - 1;

            if (typeof(GameInput.Players[GameInput.Connection.GamePadMapping[index]].model) !== "undefined") {
                    return GameInput.Players[GameInput.Connection.GamePadMapping[index]].type.name.toLowerCase();
            }
            return false;
        },

        getUnmappedGamepadName: function(player)
        {
            if (isNaN(player)) player = 1;
            var index = player - 1;

            if (GameInput.Connection.Gamepads[player] instanceof Gamepad && typeof(GameInput.Players[GameInput.Connection.GamePadMapping[index]].model) === "undefined") {
                    return GameInput.Connection.Gamepads[index].id;
            }
            return false;
        },

        playerHasGamepad: function(player)
        {
            if (isNaN(player)) player = 1;
            var index = player - 1;

            return typeof(GameInput.Players[GameInput.Connection.GamePadMapping[index]]) !== "undefined"
                && typeof(GameInput.Players[GameInput.Connection.GamePadMapping[index]].type) !== "undefined"
                && GameInput.Players[GameInput.Connection.GamePadMapping[index]].type !== GameInput.Type.Keyboard;
        },

        gamepadsCount: function()
        {
            var count = 0;

            for (var i = 1; i <= ig.input.maxPlayers; i++) {
                count += ig.input.playerHasGamepad(i) ? 1 : 0;
            }

            return count;
        },

        icons: {
            dc: new ig.Image("media/gamepads/dc.png"),
            xbox360: new ig.Image("media/gamepads/xbox360.png"),
            xboxone: new ig.Image("media/gamepads/xboxone.png"),
            ds3: new ig.Image("media/gamepads/ds3.png"),
            ds4: new ig.Image("media/gamepads/ds4.png"),
            generic: new ig.Image("media/gamepads/generic.png"),
            'nintendo-generic': new ig.Image("media/gamepads/nintendo-generic.png"),
            'sega-generic': new ig.Image("media/gamepads/sega-generic.png"),
            joystick: new ig.Image("media/gamepads/joystick.png"),
            keyboard: new ig.Image("media/gamepads/keyboard.png")
        },

        getGameInputIcon: function(playerOrTheme)
        {
            if (typeof(playerOrTheme) === "undefined") playerOrTheme = 1;

            var icon;
            if (typeof(playerOrTheme) === "string") {
                icon = playerOrTheme;
            } else if (!isNaN(playerOrTheme)) {
                var index = playerOrTheme - 1;
                icon = GameInput.Players[GameInput.Connection.GamePadMapping[index]].model.iconName;
            } else {
                throw "Must provide praver number (1-4) or theme";
            }
            return this.icons[icon.toLowerCase()];
        },

        getGameInputSchemaImage: function(playerOrTheme)
        {
            if (typeof(playerOrTheme) === "undefined") playerOrTheme = 1;

            var icon;
            if (typeof(playerOrTheme) === "string") {
                icon = playerOrTheme;
            } else if (!isNaN(playerOrTheme)) {
                var index = playerOrTheme - 1;
                icon = GameInput.Players[GameInput.Connection.GamePadMapping[index]].theme.name;
            } else {
                throw "Must provide praver number (1-4) or theme";
            }

            return "img/gamepad/schema/" + icon + ".png";
        },

        getGameInputButtonImage: function(playerOrTheme, button)
        {
            if ( typeof(button) === "undefined" && typeof(playerOrTheme) === "string" ) /* If you only provide the button name... */
            {
                button = playerOrTheme;
                playerOrTheme = 1;
            }

            if (typeof(playerOrTheme) === "undefined") playerOrTheme = 1;

            var theme;
            if (typeof(playerOrTheme) === "string") {
                theme = playerOrTheme;
            } else if (!isNaN(playerOrTheme)) {
                var index = playerOrTheme - 1;
                theme = GameInput.Players[GameInput.Connection.GamePadMapping[index]].theme.name;
            } else {
                throw "Must provide praver number (1-4) or theme";
            }

            return "img/gamepad/buttons/" + theme.toLowerCase() + "/" + button + ".png";
        },

        getGameInputButtonText: function(player, button, supportsUTF8)
        {
            if ( typeof(button) === "undefined" && typeof(player) === "string" ) /* If you only provide the button name... */
            {
                button = player;
                player = 1;
            }

            if (typeof(button) !== "string" || button in gi.Schema.Names === false) throw "Must provide a value from gi.Schema.Names!";

            return gi.getPlayer(player-1).getButtonText(button, supportsUTF8 === true ? false : true);
        }
    });

    // Always poll gamepad before each frame
    ig.Game.inject({
        run: function() {
            ig.input.pollGamepads();
            this.parent();
        }
    });

});
