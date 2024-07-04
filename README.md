[<img src="img/generic.png" width="48" />](img/generic.png) Game-Input JavaScript Library
=============
[![npm](https://img.shields.io/npm/v/gameinputjs)](https://www.npmjs.com/package/gameinputjs)
[![license](https://img.shields.io/npm/l/gameinputjs)](LICENSE)
[![language](https://img.shields.io/badge/lang-JavaScript-orange)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![environment](https://img.shields.io/badge/env-Browser-green)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)

A client-side JavaScript module one can import to add good gamepad support to web-powered games or other gamepad-powered web applications.

## Installation

GameinputJS's `src` and `img` folders need to be accessible in the distributed version of your website.

I would recommend setting up a `package.json` script to help update a distributable copy of the library outside node_modules:
```json
{
    "name": "@me/my-client-webapp",
    "scripts": {
        "deps2lib": "shx rm -rf lib && shx mkdir lib && shx cp -r node_modules/gameinputjs lib/"
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


## Usage
Import from within a Javascript module, construct it, and then use either the events or make a game loop that uses the properties.

```js
import { GameInput, DetectedOS } from './lib/gameinputjs/src/gameinput.js'
import { GameInputSchemaSectionNames, GameInputSchemaButtonNames } from './lib/gameinputjs/src/gameinput-schema.js'

const gameInput = new GameInput()
```

### Event-Driven Style
```js
gameInput
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
```

### Game-Loop Style
```js
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
