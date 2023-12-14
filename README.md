Game-Input (JavaScript) Library
=============
![](img/generic.png)

A client-side JavaScript module one can import to add good gamepad support to web-powered games or other gamepad-powered web applications.

```js
import { GameInput, DetectedOS } from './gameinput.js'
import { GameInputSchemaSectionNames, GameInputSchemaButtonNames } from './gameinput-schema.js'

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
