import { GameInput, DetectedOS } from '../gameinput.js'
import { GameInputSchemaSectionNames, GameInputSchemaButtonNames } from '../gameinput-schema.js'

/** @type {GameInput} */
globalThis.gi = new GameInput()
let gi = globalThis.gi

document.querySelector('p.detected-os').textContent = `OS: ${DetectedOS}`

const playersEl = document.getElementById('players')

// Setup
gi.onButtonDown((playerIndex, sectionName, buttonName) => {
    const el = document.querySelector(`.player[playerIndex="${playerIndex}"] .gamepad-visualize .${sectionName} .${buttonName}`)
    el?.setAttribute('active', 'active')
})

gi.onButtonUp((playerIndex, sectionName, buttonName) => {
    const el = document.querySelector(`.player[playerIndex="${playerIndex}"] .gamepad-visualize .${sectionName} .${buttonName}`)
    el?.removeAttribute('active')
})

gi.onReinitialize(() => {
    /* Remove Old Stuff */
    playersEl.innerHTML = ''

    /* TODO Add new stuff */
    setTimeout(() => {
        for (const player of gi.Players) {
            // TODO
        }
    }, 1)
})

gi.onReinitialize(() => setupPlayers())
setTimeout(()=> gi.reinitialize(), 100) // TODO?

/**
 * Set Up the Players
 */
function setupPlayers () {
    document.querySelector('#players').innerHTML = ''

    const template = document.getElementById('player-template')
    for (const i in gi.Players) {
        const clone = template.content.cloneNode(true)
        /** {GameInputModel} */
        const model = gi.Players[i].model

        if (!model)
            continue

        clone.querySelector('.player').setAttribute('playerIndex', i)
        clone.querySelector('.player-number').textContent = i
        clone.querySelector('.gamepad-icon').src = `img/${model.iconName}.png`
        clone.querySelector('.gamepad-vendorid').textContent = model.VendorId
        clone.querySelector('.gamepad-productid').textContent = model.ProductId
        clone.querySelector('.gamepad-productname').textContent = model.ProductName

        for (const sectionName in GameInputSchemaSectionNames)
            for (const buttonName in GameInputSchemaButtonNames) {
                const el = clone.querySelector(`.gamepad-visualize .${sectionName} .${buttonName}`)
                if (!el) continue
                el.textContent = gi.Players[i].getButtonText(sectionName, buttonName)
            }

        /** @type {Button} */
        const weakRumbleEl = clone.querySelector('.rumble .weak')
        /** @type {Button} */
        const strongRumbleEl = clone.querySelector('.rumble .strong')

        if (gi.Players[i].hasRumble()) {
            weakRumbleEl.onclick = () => gi.Players[i].rumble({ duration: 300, strongMagnitude: 0, weakMagnitude: 0.75 })
            weakRumbleEl.disabled = !gi.Players[i].hasRumble()

            strongRumbleEl.onclick = () => gi.Players[i].rumble({ duration: 300, strongMagnitude: 0.75, weakMagnitude: 0 })
            strongRumbleEl.disabled = !gi.Players[i].hasRumble()
        } else {
            weakRumbleEl.remove()
            strongRumbleEl.remove()
        }

        playersEl.appendChild(clone)
    }
}

/**
 * Find the nearest element parent with a class.
 * @param {Element} el  element
 * @param {string} cls  CSS class
 * @returns {Element}   nearest ancestor to the element
 */
globalThis.findAncestor = (el, cls) => {
    if ('closest' in el)
        return el.closest('.' + cls)

    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el
}
