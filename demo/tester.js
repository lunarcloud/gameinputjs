import { GameInput, DetectedOS } from '../gameinput.js'
import { GameInputSchemaSectionNames, GameInputSchemaButtonNames } from '../gameinput-schema.js'

/** @type {GameInput} */
globalThis.gi = new GameInput();

document.querySelector('p.detected-os').textContent = `OS: ${DetectedOS}`

const playersEl = document.getElementById('players')

// Setup
gi.onButtonDown((playerIndex, buttonName) => {
    // TODO
});

gi.onButtonUp((playerIndex, buttonName) => {
    // TODO
});

gi.onReinitialize(function()
{
    /* Remove Old Stuff */
    playersEl.innerHTML = ''

    /* TODO Add new stuff */
    setTimeout(function(){
        for (const player of gi.Players)
        {
            // TODO
        }
    },1);
});

gi.onReinitialize(() => setupPlayers());
setTimeout(()=> gi.reinitialize(), 100); // TODO?

function setupPlayers()
{
    document.querySelector("#players").innerHTML = '';

    const template = document.getElementById('player-template')
    for (const i in gi.Players)
    {
        const clone = template.content.cloneNode(true);
        /** {GameInputModel} */
        const model = gi.Players[i].model

        if (!model)
            continue

        clone.querySelector('.player-number').textContent = i
        clone.querySelector('.gamepad-icon').src = `img/${model.iconName}.png`
        clone.querySelector('.gamepad-vendorid').textContent = model.VendorId
        clone.querySelector('.gamepad-productid').textContent = model.ProductId
        clone.querySelector('.gamepad-productname').textContent = model.ProductName

        for (const sectionName in GameInputSchemaSectionNames)
            for (const buttonName in GameInputSchemaButtonNames) {
                const el = clone.querySelector(`.gamepad-visualize .${sectionName} .${buttonName}`)
                el.textContent = gi.Players[i].getButtonText(sectionName, buttonName)
            }
        playersEl.appendChild(clone);
    }
}

globalThis.findAncestor = function(el, cls) {
    if (typeof(el.closest)) return el.closest("." + cls);

    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}
