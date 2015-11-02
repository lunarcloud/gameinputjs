/**
 * @author  Samuel J Sarette
 * License  MIT
 */
"use strict";

/**
 * GameInput
 * @brief   HTML5 Game Input System
 * @desc    System for using a gamepad or keyboard control scheme for games
 *
 */
var GameInput = {};

GameInput.OS = {};
GameInput.OS.Detected = "unknown OS";
GameInput.OS.clientStrings = [
	{s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
	{s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
	{s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
	{s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
	{s:'Windows Vista', r:/Windows NT 6.0/},
	{s:'Windows Server 2003', r:/Windows NT 5.2/},
	{s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
	{s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
	{s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
	{s:'Windows 98', r:/(Windows 98|Win98)/},
	{s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
	{s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
	{s:'Windows CE', r:/Windows CE/},
	{s:'Windows 3.11', r:/Win16/},
	{s:'Android', r:/Android/},
	{s:'Open BSD', r:/OpenBSD/},
	{s:'Sun OS', r:/SunOS/},
	{s:'Linux', r:/(Linux|X11)/},
	{s:'iOS', r:/(iPhone|iPad|iPod)/},
	{s:'Mac OS X', r:/Mac OS X/},
	{s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
	{s:'QNX', r:/QNX/},
	{s:'UNIX', r:/UNIX/},
	{s:'BeOS', r:/BeOS/},
	{s:'OS/2', r:/OS\/2/},
	{s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
];

GameInput.Schema = {};

GameInput.Schema.Names = {
	d_up	: 	"d_up",
	d_down	: 	"d_down",
	d_left	: 	"d_left",
	d_right	: 	"d_right",
	menu	: 	"menu",
	button0	: 	"button0",
	button1	: 	"button1",
	button2	: 	"button2",
	button3	: 	"button3",
	a_up	: 	"a_up",
	a_down	: 	"a_down",
	a_left	:	"a_left",
	a_right	:	"a_right"
};


GameInput.debug = true;

GameInput.canUseGamepadAPI = function()
{
	return "getGamepads" in navigator;
}

GameInput.Player = function(number)
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

	for (var i in GameInput.Schema.Names)
	{
		this.buttonDownActions[ GameInput.Schema.Names[i] ] = [];
		this.buttonUpActions[ GameInput.Schema.Names[i] ] = [];
	}

}

GameInput.Player.prototype.buttonDown = function(schemaName)
{
	for ( var action in this.buttonDownActions[schemaName])
		this.buttonDownActions[schemaName][action]();
}

GameInput.Player.prototype.buttonUp = function(schemaName)
{
	for ( var action in this.buttonUpActions[schemaName])
		this.buttonUpActions[schemaName][action]();
}

GameInput.Player.prototype.onButtonDown = function(schemaName, action)
{
	if (schemaName in GameInput.Schema.Names === false) throw "Must be GameInput.Schema.Names";
	if (typeof(action) !== "function") throw "Action must be a function";

	this.buttonDownActions[schemaName].push(action);
};

GameInput.Player.prototype.onButtonUp = function(schemaName, action)
{
	if (schemaName in GameInput.Schema.Names === false) throw "Must be GameInput.Schema.Names";
	if (typeof(action) !== "function") throw "Action must be a function";

	this.buttonUpActions[schemaName].push(action);
};

GameInput.Players = [
	new GameInput.Player(1),
	new GameInput.Player(2),
	new GameInput.Player(3),
	new GameInput.Player(4)
];

GameInput.Connection = {};

GameInput.Connection.GamePadMapping = {
	0 : 0,
	1 : 1,
	2 : 2,
	3 : 3
}

GameInput.Connection.Gamepads = [undefined, undefined, undefined, undefined];

GameInput.Connection.gained = function(gamepad)
{
	GameInput.initialGamePadSetup();
};

GameInput.Connection.lost = function(gamepad)
{
	GameInput.initialGamePadSetup();
};

GameInput.Theme = function(name)
{
	this.name = name;
};

GameInput.Theme.prototype.getStyleSheet = function(playerIndex)
{
	if (isNaN(playerIndex)) playerIndex = 0;
	return "css/gameinput/" + this.name.toLowerCase() + "/" + playerIndex + ".css";
}
GameInput.Theme.prototype.enable = function(playerIndex)
{
	if (isNaN(playerIndex)) playerIndex = 0;
	$('.gameinput-player' + playerIndex).remove();
	$("head").append('<link class="gameinput-theme-player' + playerIndex + '" rel="stylesheet" href="' + this.getStyleSheet(playerIndex) + '">');
}

GameInput.Schema.Key = function(code, text)
{
	this.index = code;
	this.text = text;
};

GameInput.Schema.Button = function(index)
{
	this.index = index;
};

GameInput.Schema.AxisButton = function(indexAndDirection, threshold)
{
	this.index = Math.abs(indexAndDirection);
	this.direction = indexAndDirection < 0 ? "negative" : "positive";
	if ( typeof(threshold) === "undefined" ) threshold = 0.7;
	this.threshold = (this.direction === "positive" ? 1 : -1 ) * Math.abs(threshold);
};

GameInput.Schema.Generic = function(d_up, d_down, d_left, d_right,
                            menu, button0, button1, button2, button3,
                            a_up, a_down, a_left, a_right)
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
	this.a_up = a_up;
	this.a_down = a_down;
	this.a_left = a_left;
	this.a_right = a_right;
};

GameInput.Schema.Generic.prototype.lookup = function(key)
{
	var schema = this;
	for (var i in schema)
	{
		if (schema[i] instanceof GameInput.Schema.Key)
		{
			if (key == schema[i].index) return i;
		}
		else if (schema[i] == key) return i;
	}
}

GameInput.Schema.GamePadAPI = function(d_up, d_down, d_left, d_right,
                            menu, button0, button1, button2, button3,
                            a_up, a_down, a_left, a_right)
{
	for (var i in arguments)
	{
		if (typeof(arguments[i]) === "number") arguments[i] = new GameInput.Schema.Button(arguments[i]);
	}
	if (typeof(d_up) === "number") d_up = new GameInput.Schema.Button(d_up);

	GameInput.Schema.Generic.call(this, d_up, d_down, d_left, d_right,
                            menu, button0, button1, button2, button3,
                            a_up, a_down, a_left, a_right);
};
GameInput.Schema.GamePadAPI.prototype = new GameInput.Schema.Generic();
GameInput.Schema.GamePadAPI.prototype.constructor = GameInput.Schema.GamePadAPI;

GameInput.Schema.KeyboardAPI = function(d_up, d_down, d_left, d_right,
                            menu, button0, button1, button2, button3,
                            a_up, a_down, a_left, a_right)
{
	for (var i in arguments)
	{
		if (typeof(arguments[i]) !== "undefined" && (arguments[i] instanceof GameInput.Schema.Key) === false) throw "Must be undefined or GameInput.Schema.Key";
	}
	GameInput.Schema.Generic.call(this, d_up, d_down, d_left, d_right,
                            menu, button0, button1, button2, button3,
                            a_up, a_down, a_left, a_right);
};
GameInput.Schema.KeyboardAPI.prototype = new GameInput.Schema.Generic();
GameInput.Schema.KeyboardAPI.prototype.constructor = GameInput.Schema.KeyboardAPI;

/**
 * @desc    Valid keycode integer
 */
GameInput.Schema.KeyboardAPI.Keys = {
      ENTER: new GameInput.Schema.Key(13, "Return"),
      ESCAPE: new GameInput.Schema.Key(27, "Esc"),
      LEFT_ARROW: new GameInput.Schema.Key(37, "←"),
      UP_ARROW: new GameInput.Schema.Key(38, "↑"),
      RIGHT_ARROW: new GameInput.Schema.Key(39, "→"),
      DOWN_ARROW: new GameInput.Schema.Key(40, "↓"),
      KEY_0: new GameInput.Schema.Key(48, "0"),
      KEY_1: new GameInput.Schema.Key(49, "1"),
      KEY_2: new GameInput.Schema.Key(50, "2"),
      KEY_3: new GameInput.Schema.Key(51, "3"),
      KEY_4: new GameInput.Schema.Key(52, "4"),
      KEY_5: new GameInput.Schema.Key(53, "5"),
      KEY_6: new GameInput.Schema.Key(54, "6"),
      KEY_7: new GameInput.Schema.Key(55, "7"),
      KEY_8: new GameInput.Schema.Key(56, "8"),
      KEY_9: new GameInput.Schema.Key(57, "9"),
      KEY_A: new GameInput.Schema.Key(65, "A"),
      KEY_B: new GameInput.Schema.Key(66, "B"),
      KEY_C: new GameInput.Schema.Key(67, "C"),
      KEY_D: new GameInput.Schema.Key(68, "D"),
      KEY_E: new GameInput.Schema.Key(69, "E"),
      KEY_F: new GameInput.Schema.Key(70, "F"),
      KEY_G: new GameInput.Schema.Key(71, "G"),
      KEY_H: new GameInput.Schema.Key(72, "H"),
      KEY_I: new GameInput.Schema.Key(73, "I"),
      KEY_J: new GameInput.Schema.Key(74, "J"),
      KEY_K: new GameInput.Schema.Key(75, "K"),
      KEY_L: new GameInput.Schema.Key(76, "L"),
      KEY_M: new GameInput.Schema.Key(77, "M"),
      KEY_N: new GameInput.Schema.Key(78, "N"),
      KEY_O: new GameInput.Schema.Key(79, "O"),
      KEY_P: new GameInput.Schema.Key(80, "P"),
      KEY_Q: new GameInput.Schema.Key(81, "Q"),
      KEY_R: new GameInput.Schema.Key(82, "R"),
      KEY_S: new GameInput.Schema.Key(83, "S"),
      KEY_T: new GameInput.Schema.Key(84, "T"),
      KEY_U: new GameInput.Schema.Key(85, "U"),
      KEY_V: new GameInput.Schema.Key(86, "V"),
      KEY_W: new GameInput.Schema.Key(87, "W"),
      KEY_X: new GameInput.Schema.Key(88, "X"),
      KEY_Y: new GameInput.Schema.Key(89, "Y"),
      KEY_Z: new GameInput.Schema.Key(90, "Z"),
      OPEN_BRACKET: new GameInput.Schema.Key(91, "["),
      CLOSE_BRACKET: new GameInput.Schema.Key(93, "]"),
      SEMICOLON: new GameInput.Schema.Key(186, ";"),
      EQUALS: new GameInput.Schema.Key(187, "="),
      COMMA: new GameInput.Schema.Key(188, ","),
      DASH: new GameInput.Schema.Key(189, "-"),
      PERIOD: new GameInput.Schema.Key(190, "."),
      FORWARD_SLASH: new GameInput.Schema.Key(191, "/"),
      GRAVE_ACCENT: new GameInput.Schema.Key(192, "`"),
      BACK_SLASH: new GameInput.Schema.Key(220, "\\"),
      SINGLE_QUOTE: new GameInput.Schema.Key(222, "'")
    };

GameInput.Schema.KeyboardAPI.Standard = {};

GameInput.Schema.KeyboardAPI.Standard.QWERTY = new GameInput.Schema.KeyboardAPI(
	GameInput.Schema.KeyboardAPI.Keys.UP_ARROW,
	GameInput.Schema.KeyboardAPI.Keys.DOWN_ARROW,
	GameInput.Schema.KeyboardAPI.Keys.LEFT_ARROW,
	GameInput.Schema.KeyboardAPI.Keys.RIGHT_ARROW,
	GameInput.Schema.KeyboardAPI.Keys.ENTER,
	GameInput.Schema.KeyboardAPI.Keys.KEY_A,
	GameInput.Schema.KeyboardAPI.Keys.KEY_S,
	GameInput.Schema.KeyboardAPI.Keys.KEY_D,
	GameInput.Schema.KeyboardAPI.Keys.KEY_F
);

GameInput.Schema.KeyboardAPI.Standard.Dvorak = new GameInput.Schema.KeyboardAPI(
	GameInput.Schema.KeyboardAPI.Keys.UP_ARROW,
	GameInput.Schema.KeyboardAPI.Keys.DOWN_ARROW,
	GameInput.Schema.KeyboardAPI.Keys.LEFT_ARROW,
	GameInput.Schema.KeyboardAPI.Keys.RIGHT_ARROW,
	GameInput.Schema.KeyboardAPI.Keys.ENTER,
	GameInput.Schema.KeyboardAPI.Keys.KEY_A,
	GameInput.Schema.KeyboardAPI.Keys.KEY_O,
	GameInput.Schema.KeyboardAPI.Keys.KEY_E,
	GameInput.Schema.KeyboardAPI.Keys.KEY_U
);

GameInput.Type = function(name, theme, defaultSchema)
{
	this.name = name;
	this.theme = theme;
	this.schema = defaultSchema;
};
GameInput.Type.prototype.enable = function(){};

GameInput.Type.Hedgehog = new GameInput.Type("Hedgehog", new GameInput.Theme("HedgeHog"));

GameInput.Type.Plumber = new GameInput.Type("Plumber", new GameInput.Theme("Plumber"));

GameInput.Type.Ragdoll = new GameInput.Type("Ragdoll", new GameInput.Theme("Ragdoll"));

GameInput.Type.Keyboard = new GameInput.Type("Keyboard", new GameInput.Theme("Blank"));
GameInput.Type.Keyboard.StandardThemes = {
	Blank: new GameInput.Theme("Blank"),
	Dvorak: new GameInput.Theme("Dvorak"),
	QWERTY: new GameInput.Theme("QWERTY")
};


GameInput.Type.Keyboard.setQWERTY = function()
{
	GameInput.Type.Keyboard.schema = GameInput.Schema.KeyboardAPI.Standard.QWERTY;
	GameInput.Type.Keyboard.theme = GameInput.Type.Keyboard.StandardThemes.QWERTY;

	if (typeof(GameInput.KeyboardWatcher.PlayerToWatch) !== "undefined" && typeof(GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch]) !== "undefined" )
	{
		GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch].schema = GameInput.Schema.KeyboardAPI.Standard.QWERTY;
		GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch].theme = GameInput.Type.Keyboard.StandardThemes.QWERTY;
		GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch].theme.enable(GameInput.KeyboardWatcher.PlayerToWatch);
	}
};

GameInput.Type.Keyboard.setDvorak = function()
{
	GameInput.Type.Keyboard.schema = GameInput.Schema.KeyboardAPI.Standard.Dvorak;
	GameInput.Type.Keyboard.theme = GameInput.Type.Keyboard.StandardThemes.Dvorak;

	if (typeof(GameInput.KeyboardWatcher.PlayerToWatch) !== "undefined" && typeof(GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch]) !== "undefined" )
	{
		GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch].schema = GameInput.Schema.KeyboardAPI.Standard.Dvorak;
		GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch].theme = GameInput.Type.Keyboard.StandardThemes.Dvorak;
		GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch].theme.enable(GameInput.KeyboardWatcher.PlayerToWatch);

	}
};

/**
 * @param   schema  GameInput.Schema
 */
GameInput.Model = function(type, iconName, id, os, schema)
{
	this.type = type;
	this.iconName = iconName;
	this.id = id;
	this.os = os;
	this.schema = schema;
};

GameInput.Model.prototype.getIcon = function()
{
	return "css/gameinput/img/models/" + this.iconName + ".png";
}

GameInput.Model.prototype.setIcon = function(playerIndex)
{
	if (isNaN(playerIndex)) playerIndex = 0;
	$("img.gameinput-icon-player" + playerIndex).attr("src", this.getIcon());
	$(".gameinput-icon-background-player" + playerIndex).attr("background-image", "url('" + this.getIcon() + "')");
}

GameInput.Type.Keyboard.model = new GameInput.Model(
		GameInput.Type.Keyboard,
		"keyboard",
		"keyboard",
		undefined,
		GameInput.Schema.KeyboardAPI.Standard.QWERTY);

GameInput.Models = {};
GameInput.Models.Generic = [
	new GameInput.Model(
		GameInput.Type.Hedgehog,
		"xbox360",
		"XInput",
		undefined,
		new GameInput.Schema.GamePadAPI(
			13, 14, 15, 16,
			10,
			1,2,3,4,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	)),
	new GameInput.Model(
		GameInput.Type.Hedgehog,
		"xbox360",
		"XBox 360",
		undefined,
		new GameInput.Schema.GamePadAPI(
			13, 14, 15, 16,
			10,
			1,2,3,4,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	)),
	new GameInput.Model(
		GameInput.Type.Ragdoll,
		"ds3",
		"PLAYSTATION",
		undefined,
		new GameInput.Schema.GamePadAPI(
			5,7,8,6,
			8,
			1,2,3,4,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	)),
	new GameInput.Model(
		GameInput.Type.Hedgehog,
		"generic",
		"Logitech Rumblepad 2",
		undefined,
		new GameInput.Schema.GamePadAPI(
			12,13,14,15,
			10,
			2,3,1,4,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	)),
	new GameInput.Model(
		GameInput.Type.Hedgehog,
		"generic",
		"Logitech Dual Action",
		undefined,
		new GameInput.Schema.GamePadAPI(
			12,13,14,15,
			10,
			2,3,1,4,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	))
];

GameInput.Models.Specific = [
	new GameInput.Model(
		GameInput.Type.Hedgehog,
		"xbox360",
		"Xbox 360 Controller (XInput STANDARD GAMEPAD)",
		"Windows",
		new GameInput.Schema.GamePadAPI(
			13,14,15,16,
			10,
			1,2,3,4,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	)),
	new GameInput.Model(
		GameInput.Type.Hedgehog,
		"xbox360",
		"Performance Designed Products Afterglow Gamepad for Xbox 360 (Vendor: 0e6f Product: 0213)",
		"Linux",
		new GameInput.Schema.GamePadAPI(
			new GameInput.Schema.AxisButton(-8),
			new GameInput.Schema.AxisButton(8),
			new GameInput.Schema.AxisButton(-7),
			new GameInput.Schema.AxisButton(7),
			8,
			1,2,3,4,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	)),
	new GameInput.Model(
		GameInput.Type.Hedgehog,
		"dc",
		"HuiJia  USB GamePad (Vendor: 0e8f Product: 3013)",
		"Linux",
		new GameInput.Schema.GamePadAPI(
			13, 15, 16, 14,
			4,
			15,14,16,13,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	)),
	new GameInput.Model(
		GameInput.Type.Ragdoll,
		"ds4",
		"Sony Computer Entertainment Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
		"Linux",
		new GameInput.Schema.GamePadAPI(
			new GameInput.Schema.AxisButton(-11),
			new GameInput.Schema.AxisButton(11),
			new GameInput.Schema.AxisButton(-10),
			new GameInput.Schema.AxisButton(10),
			4,
			15,14,16,13,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	)),
	new GameInput.Model(
		GameInput.Type.Ragdoll,
		"ds3",
		"Sony PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)",
		"Linux",
		new GameInput.Schema.GamePadAPI(
			5,7,8,6,
			4,
			15,14,16,13,
			new GameInput.Schema.AxisButton(-2),
			new GameInput.Schema.AxisButton(2),
			new GameInput.Schema.AxisButton(-1),
			new GameInput.Schema.AxisButton(1)
	))
];

GameInput.KeyboardWatcher = new function()
{
	var watcher = this;
	this.PlayerToWatch = undefined;

	//setup keydown/keyup events

	$(document).keyup(function(e) {
		var player = GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch];
		if (typeof(player.schema) !== "undefined" )
		{
			var schemaButtonName = player.schema.lookup(e.which);
			if (typeof(schemaButtonName) !== "undefined" )
			{
				$(".gameinput-player" + player.index + "-" + schemaButtonName).removeClass("gameinput-button-active");
				player.buttonUp(schemaButtonName);
			}
		}
	})
	$(document).keydown(function(e) {
		var player = GameInput.Players[GameInput.KeyboardWatcher.PlayerToWatch];
		if (typeof(player.schema) !== "undefined" )
		{
			var schemaButtonName = player.schema.lookup(e.which);
			if (typeof(schemaButtonName) !== "undefined" )
			{
				$(".gameinput-player" + player.index + "-" + schemaButtonName).addClass("gameinput-button-active");
				player.buttonDown(schemaButtonName);
			}
		}
	})
};

GameInput.loopingUpdate = true;

GameInput.startUpdateLoop = function()
{
	GameInput.loopingUpdate = true;
	GameInput.nextUpdateLoop();
}

GameInput.stopUpdateLoop = function()
{
	GameInput.loopingUpdate = false;
}

GameInput.nextUpdateLoop = function()
{
	if (GameInput.loopingUpdate === false) return;
	GameInput.update();
// 	requestAnimationFrame(GameInput.update); // way too slow!
	setTimeout($.throttle(10, GameInput.nextUpdateLoop), 1);
}

GameInput.update = function()
{
	if (GameInput.canUseGamepadAPI())
	{
		GameInput.Connection.Gamepads = navigator.getGamepads();

		for (var i = 0; i < GameInput.Connection.Gamepads.length; i++)
		{
			GameInput.Players[GameInput.Connection.GamePadMapping[i]].previous.state = GameInput.Players[GameInput.Connection.GamePadMapping[i]].state;
			GameInput.Players[GameInput.Connection.GamePadMapping[i]].state = {};

			var currentGamepad = GameInput.Connection.Gamepads[GameInput.Connection.GamePadMapping[i]];
			var currentSchema = GameInput.Players[GameInput.Connection.GamePadMapping[i]].schema;
			if (typeof(currentGamepad) === "undefined") continue;

			for (var schemaIndex in currentSchema)
			{
				if (typeof(currentSchema[schemaIndex]) === "undefined")
				{
					//skip
				}
				else if ( typeof(currentGamepad.buttons[currentSchema[schemaIndex] - 1]
						   ) === "undefined")
				{
					var negativeAxis = false;
					if (currentSchema[schemaIndex].threshold < 0) negativeAxis = true;

					var axisValue = GameInput.Connection.Gamepads[i].axes[currentSchema[schemaIndex].index - 1];
					var threshold = currentSchema[schemaIndex].threshold;

					if ( (negativeAxis && axisValue < threshold)
						|| (!negativeAxis && axisValue > threshold))
					{
						GameInput.Players[GameInput.Connection.GamePadMapping[i]].state[schemaIndex] = true;
						$(".gameinput-player" + i + "-" + schemaIndex).addClass("gameinput-button-active");
					}
					else
					{
						GameInput.Players[GameInput.Connection.GamePadMapping[i]].state[schemaIndex] = false;
						$(".gameinput-player" + i + "-" + schemaIndex).removeClass("gameinput-button-active");
					}
				}
				else
				{
					if (GameInput.Connection.Gamepads[i].buttons[currentSchema[schemaIndex] - 1].pressed)
					{
						GameInput.Players[GameInput.Connection.GamePadMapping[i]].state[schemaIndex] = true;
						$(".gameinput-player" + i + "-" + schemaIndex).addClass("gameinput-button-active");
					}
					else
					{
						GameInput.Players[GameInput.Connection.GamePadMapping[i]].state[schemaIndex] = false;
						$(".gameinput-player" + i + "-" + schemaIndex).removeClass("gameinput-button-active");
					}
				}
			}
		}

		// Keydown / Keyup
		for (var i = 0; i < GameInput.Players.length; i++)
		{
			for (var j in GameInput.Players[i].state)
			{
				if ( GameInput.Players[i].previous.state[j] === false
					&& GameInput.Players[i].state[j] === true )
				{
					GameInput.Players[i].buttonDown(j);
				}
				else if ( GameInput.Players[i].previous.state[j] === true
					&& GameInput.Players[i].state[j] === false )
				{
					GameInput.Players[i].buttonUp(j);
				}
			}
		}
	}
};

GameInput.initialGamePadSetup = function()
{
	// Pause Game or similar
	for (var i = 0; i < GameInput.reshufflePlayersActions.length; i++)
	{
		if (typeof(GameInput.reshufflePlayersActions[i]) === "function") GameInput.reshufflePlayersActions[i]();
	}

	//clear gamepad information
	for (var i = 0; i < GameInput.Players.length; i++)
	{
		GameInput.Players[i].type = undefined;
		GameInput.Players[i].model = undefined;
		GameInput.Players[i].schema = undefined;
		GameInput.Players[i].theme = undefined;
	}
	$("img.gameinput-icon").attr("src", "");

	if (GameInput.canUseGamepadAPI())
	{
		window.addEventListener("gamepadconnected", function(e) {
			if (GameInput.debug) console.debug("Gamepad connected at index %d: %s. %d buttons, %d axes.",
				e.gamepad.index, e.gamepad.id,
				e.gamepad.buttons.length, e.gamepad.axes.length);
			GameInput.Connection.gained(e.gamepad);
			GameInput.initialGamePadSetup();
		}, false);

		window.addEventListener("gamepaddisconnected", function(e) {
			if (GameInput.debug) console.debug("Gamepad disconnected from index %d: %s",
				e.gamepad.index, e.gamepad.id);
			GameInput.Connection.lost(e.gamepad);
			GameInput.initialGamePadSetup();
		}, false);

		GameInput.Connection.Gamepads = navigator.getGamepads();

		for (var i in GameInput.Connection.Gamepads)
		{
			if (GameInput.Connection.Gamepads[i] instanceof Gamepad)
			{
				//Translate into Type -  Players order is gamepad order
				for (var j = 0; j < GameInput.Models.Specific.length; j++)
				{
					if ( GameInput.Models.Specific[j].id === GameInput.Connection.Gamepads[i].id
						&& GameInput.OS.Detected === GameInput.Models.Specific[j].os )
					{
						GameInput.Players[GameInput.Connection.GamePadMapping[i]].type = GameInput.Models.Specific[j].type;
						GameInput.Players[GameInput.Connection.GamePadMapping[i]].model = GameInput.Models.Specific[j];
						GameInput.Players[GameInput.Connection.GamePadMapping[i]].schema = GameInput.Models.Specific[j].schema;
						GameInput.Players[GameInput.Connection.GamePadMapping[i]].theme = GameInput.Models.Specific[j].type.theme;
					}
				}

				if (typeof(GameInput.Players[GameInput.Connection.GamePadMapping[i]]) === "undefined")
				{
					for (var j = 0; j < GameInput.Models.Generic.length; j++)
					{
						if (GameInput.Models.Generic[j].id.seach(GameInput.Connection.Gamepads[i].id) > 0)
						{
							GameInput.Players[GameInput.Connection.GamePadMapping[i]].type = GameInput.Models.Generic[j].type;
							GameInput.Players[GameInput.Connection.GamePadMapping[i]].model = GameInput.Models.Generic[j];
							GameInput.Players[GameInput.Connection.GamePadMapping[i]].schema = GameInput.Models.Generic[j].schema;
							GameInput.Players[GameInput.Connection.GamePadMapping[i]].theme = GameInput.Models.Generic[j].type.theme;
						}
					}
				}

				// blank state to start
				GameInput.Players[GameInput.Connection.GamePadMapping[i]].state = {};

				// setup Previous as current
				GameInput.Players[GameInput.Connection.GamePadMapping[i]].previous.type = GameInput.Players[GameInput.Connection.GamePadMapping[i]].type;
				GameInput.Players[GameInput.Connection.GamePadMapping[i]].previous.model = GameInput.Players[GameInput.Connection.GamePadMapping[i]].model;
				GameInput.Players[GameInput.Connection.GamePadMapping[i]].previous.schema = GameInput.Players[GameInput.Connection.GamePadMapping[i]].schema;
				GameInput.Players[GameInput.Connection.GamePadMapping[i]].previous.theme = GameInput.Players[GameInput.Connection.GamePadMapping[i]].theme;
				GameInput.Players[GameInput.Connection.GamePadMapping[i]].previous.state = GameInput.Players[GameInput.Connection.GamePadMapping[i]].state;

			}
		}
	}
	else if (GameInput.debug)
	{
		console.debug("This browser does not support the Gamepad API");
	}

	//Setup Keyboard player
	GameInput.KeyboardWatcher.PlayerToWatch = undefined;
	for (var i = 0; i < GameInput.Players.length; i++)
	{
		// last player is keyboard
		if (GameInput.Players[i].type === undefined)
		{
			GameInput.Players[i].type = GameInput.Type.Keyboard;
			GameInput.Players[i].model = GameInput.Type.Keyboard.model;
			GameInput.Players[i].schema = GameInput.Type.Keyboard.schema;
			GameInput.Players[i].theme = GameInput.Type.Keyboard.theme;

			GameInput.KeyboardWatcher.PlayerToWatch = i;
			break;
		}
	}

	for (var i = 0; i < GameInput.Players.length; i++)
	{
		if (GameInput.Players[i].type instanceof GameInput.Type)
		{
			GameInput.Players[i].type.theme.enable(i);
			if (typeof(GameInput.Players[i].model) !== "undefined" && GameInput.Players[i].model instanceof GameInput.Model) GameInput.Players[i].model.setIcon(i);
		}
	}
}

GameInput.reshufflePlayersActions = [];

GameInput.onReshufflePlayers = function(action)
{
	GameInput.reshufflePlayersActions.push(action);
}

/* Initial Configuration */

for (var id in GameInput.OS.clientStrings) {
	if (GameInput.OS.clientStrings[id].r.test(navigator.userAgent)) {
		GameInput.OS.Detected = GameInput.OS.clientStrings[id].s;
		break;
	}
}

GameInput.initialGamePadSetup();
if (typeof(GameInput.Type.Keyboard.schema) === "undefined") GameInput.Type.Keyboard.setQWERTY();
GameInput.startUpdateLoop();

/* Add Common Style */
$("head").append('<link rel="stylesheet" href="css/gameinput/common.css">');
