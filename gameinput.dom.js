/**
 * @preserve
 * @source: https://raw.githubusercontent.com/lunarcloud/gameinputjs/master/gameinput.js
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT (Expat) License
 */
"use strict";

if (typeof(GameInput) == "undefined") throw "GameInput JS must be included first!";

var commonStyleElement = document.createElement('link');
commonStyleElement.innerHTML = '<link rel="stylesheet" href="css/gameinput-common.css">';
document.head.appendChild(commonStyleElement);


GameInput.onButtonDown(function(playerIndex, schemaName) {
    var buttonElements = document.querySelectorAll(".gameinput-player" + playerIndex + "-" + schemaName);
    for (var i = 0; i < buttonElements.length; i++) {
        buttonElements[i].classList.add("gameinput-button-active");
    }
});

GameInput.onButtonUp(function(playerIndex, schemaName) {
    var buttonElements = document.querySelectorAll(".gameinput-player" + playerIndex + "-" + schemaName);
    for (var i = 0; i < buttonElements.length; i++) {
        buttonElements[i].classList.remove("gameinput-button-active");
    }
});

GameInput.onReshufflePlayers(function()
{
    "use strict";

    /* Remove Old Stuff */
    for (var i = 0; i < gi.Players.length; i++)
    {
        var previousThemeStyleElements = document.head.querySelectorAll('.gameinput-theme-player' + i);
        for (var j = 0; j < previousThemeStyleElements.length; j++) document.head.removeChild(previousThemeStyleElements[j]);
    }

    setTimeout(function(){
        /* Add new stuff */
        for (var i = 0; i < gi.Players.length; i++)
        {
            var player = gi.getPlayer(i);

            if (typeof(player.type) !== "undefined" && typeof(player.model) !== "undefined") {
                var playerIcons = document.querySelectorAll("img.gameinput-icon-player" + player.index);
                for (var j = 0; j < playerIcons.length; j++ ) playerIcons[j].setAttribute("src", "img/" + player.model.iconName + ".png");

                var backgroundIcons = document.querySelectorAll(".gameinput-icon-background-player" + player.index);
                for (var j = 0; j < backgroundIcons.length; j++ ) backgroundIcons[j].style.backgroundImage = "url('img/models/" + player.model.iconName + ".png')";

                var themeStyleElement = document.createElement('link');
                themeStyleElement.classList.add("gameinput-theme-player" + player.index);
                themeStyleElement.setAttribute("rel", "stylesheet");
                themeStyleElement.setAttribute("href", "css/" + player.type.theme.name.toLowerCase() + "/" + player.index + ".css");
                document.head.appendChild(themeStyleElement);
            } else {
                var previousPlayerIcons = document.querySelectorAll("img.gameinput-icon-player" + player.index);
                for (var j = 0; j < previousPlayerIcons.length; j++ ) previousPlayerIcons[j].setAttribute("src", "");
            }
        }
    },1);
});

