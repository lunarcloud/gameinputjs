"use strict";

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
        var previousThemeStyleElements = document.head.querySelectorAll('.gameinput-player' + i);
        for (var j = 0; j < previousThemeStyleElements.length; j++) document.head.removeChild(previousThemeStyleElements);
    }

    setTimeout(function(){
        /* Add new stuff */
        for (var i = 0; i < gi.Players.length; i++)
        {
            var player = gi.getPlayer(i);

            if (typeof(player.type) !== "undefined" && typeof(player.model) !== "undefined") {
                var playerIcons = document.querySelectorAll("img.gameinput-icon-player" + player.index);

                var backgroundIcons = document.querySelectorAll(".gameinput-icon-background-player" + player.index);
                for (var j = 0; j < backgroundIcons.length; j++ ) backgroundIcons[j].style.backgroundImage = "url('img/models/" + player.model.iconName + ".png')";

                var themeStyleElement = document.createElement('link');
                themeStyleElement.innerHTML = '<link class="gameinput-theme-player' + player.index + '" rel="stylesheet" href="css/' + player.type.theme.name.toLowerCase() + '/' + player.index + '.css">';
                document.head.appendChild(themeStyleElement);
            } else {
                var previousPlayerIcons = document.querySelectorAll("img.gameinput-icon-player" + player.index);
                for (var j = 0; j < previousPlayerIcons.length; j++ ) previousPlayerIcons[j].setAttribute("src", "");
            }
        }
    },1);
});

