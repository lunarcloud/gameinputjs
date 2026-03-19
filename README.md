[<img src="img/generic.png" width="48" />](img/generic.png) Game-Input JavaScript Library
=============
[![npm](https://img.shields.io/npm/v/gameinputjs)](https://www.npmjs.com/package/gameinputjs)
[![license](https://img.shields.io/npm/l/gameinputjs)](LICENSE)
[![GitHub top language](https://img.shields.io/github/languages/top/lunarcloud/gameinputjs)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![environment](https://img.shields.io/badge/env-Browser-green)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)

![Code Quality](https://github.com/lunarcloud/gameinputjs/actions/workflows/ci.yml/badge.svg)

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

### Configuration Options

You can configure GameInput by passing options to the constructor:

```js
const gameInput = new GameInput({
    debugStatements: false,  // Enable debug console logs (default: false)
    maxPlayers: 8            // Force max players (normally auto-detected, 4-8 on supported browsers)
})
```

#### maxPlayers

GameInput supports at least 4 players, up to 8 when detected on supported browsers. The `maxPlayers` option forces a specific maximum, overriding auto-detection.

**Example:**
```js
// Auto-detect (recommended)
const gameInput = new GameInput()

// Force a specific maximum
const gameInput = new GameInput({ maxPlayers: 16 })

// Access all detected players
for (const player of gameInput.Players) {
    if (player.model) {
        console.log(`Player ${player.number} connected`)
    }
}
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

### Lifecycle Management

GameInputJS provides proper cleanup APIs to prevent memory leaks in Single Page Applications (SPAs).

#### Unsubscribing from Events

Event listener methods (`onButtonDown`, `onButtonUp`, `onReinitialize`) return an unsubscribe function:

```js
// Subscribe to an event
const unsubscribe = gameInput.onButtonDown((playerIndex, sectionName, buttonName) => {
    console.debug(`Button ${buttonName} pressed`)
})

// Later: unsubscribe when no longer needed
unsubscribe()
```

#### Destroying the GameInput Instance

When you're done with a GameInput instance (e.g., navigating away from a game page), call `destroy()` to clean up all resources:

```js
// Clean up everything
gameInput.destroy()
```

This will:
- Stop the update loop and connection watch loop
- Remove all event listeners (both custom and window events)
- Clear all gamepad and player references

**Example: Cleanup in a SPA**
```js
// In your route setup
function initGame() {
    const gameInput = new GameInput()
    
    gameInput.onButtonDown((player, section, button) => {
        // Handle input
    })
    
    return gameInput
}

// When navigating away
function cleanupGame(gameInput) {
    gameInput.destroy()
}
```
