[<img src="img/generic.png" width="48" />](img/generic.png) Game-Input JavaScript Library
=============
A client-side JavaScript module one can import to add good gamepad support to web-powered games or other gamepad-powered web applications.

## Usage

```js
import { GameInput, DetectedOS } from './lib/gameinputjs/src/gameinput.js'
import { GameInputSchemaSectionNames, GameInputSchemaButtonNames } from './lib/gameinputjs/src/gameinput-schema.js'

/** @type {GameInput} */
const gameInput = new GameInput()
// Events style
    .onReinitialize(() => {
        console.debug("Players updated")
        const firstPlayer = gameInput.getPlayer(0)
        if (!firstPlayer?.model) {
            noPlayers()
            return
        }
        displayButtons(firstPlayer)
        document.querySelector('img.gamepad').src = `img/${firstPlayer?.model?.iconName ?? 'generic'}.png`
    })
    .onButtonDown((playerIndex, sectionName, buttonName) => {
        const player = gameInput.getPlayer(playerIndex)
        console.debug(`Player ${player} pushed ${player.getButtonText(sectionName, buttonName)} (${buttonName})`)
    })
    .onButtonUp((playerIndex, sectionName, buttonName) => {
        const player = gameInput.getPlayer(playerIndex)
        console.debug(`Player ${player} released ${player.getButtonText(sectionName, buttonName)} (${buttonName})`)

        if (sectionName === 'center' && buttonName === 'menu') {
            console.debug('menu requested')
            return
        }

        if (sectionName === 'face' && buttonName === player.schema.ordinalButton(0)) {
            console.debug('Jump / Confirm pushed')
        }
    })

// Game-Loop Style
function gameLoop() {
    for (const player of gameInput.Players) {
        if (!player)
            continue

        if (player.state.face.ordinal(0))
            player.rumble({ duration: 200, weakMagnitude: 1.0, strongMagnitude: 0.25 })

        const leftStick = player.getStickVector('left')
        console.debug(`Player left stick vector is ${leftStick.toString()}`)
        requestAnimationFrame(() => gameLoop())
    }
}
requestAnimationFrame(() => gameLoop()) // kick off
```

## Installation

GameinputJS's `src` and `img` folders need to be accessible in the distributed version of your website.

I would recommend setting up a `package.json` script to help update a distributable copy of the library outside node_modules:
```json
{
    "name": "@me/my-client-webapp",
    "scripts": {
        "deps2lib": "shx rm -rf lib && shx cp -r node_modules/gameinputjs lib/"
    }
    ...
}
```
Which would allow you to run:

```sh
    npm i --save-dev shx
    npm i gameinputjs
    npm run deps2lib
```
