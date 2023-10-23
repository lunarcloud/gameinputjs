import { AxisAsButton, OldAxisAsButton } from './axis-as-button.js'
import { OldGameInputModel } from './gameinput-model.js'
import { GameInputSchema } from './gameinput-schema.js'
import { OldGameInputModels } from './old-gameinput-models.js'
import { OldStandardDPadMapping, OldStandardFaceMapping, OldStandardLeftStickMapping, OldStandardRightStickMapping, OldStandardShoulderMapping, OldStandardTriggerMapping, OldStandardGamepadMapping } from './old-standard-gamepad-mapping.js'

const makeComparable = (item) => item instanceof OldAxisAsButton
    ? new AxisAsButton(item.direction === 'positive' ? '+' : '-', item.index, item.threshold, item.deadZone)
    : item

const isNullDPad = (oldmapping) => !oldmapping.dpadDown &&
                                    !oldmapping.dpadRight &&
                                    !oldmapping.dpadLeft &&
                                    !oldmapping.dpadUp
const isStandardDPad = (oldmapping) => makeComparable(oldmapping.dpadDown) === makeComparable(OldStandardDPadMapping[0]) &&
                                        makeComparable(oldmapping.dpadRight) === makeComparable(OldStandardDPadMapping[1]) &&
                                        makeComparable(oldmapping.dpadLeft) === makeComparable(OldStandardDPadMapping[2]) &&
                                        makeComparable(oldmapping.dpadUp) === makeComparable(OldStandardDPadMapping[3])

const isNullFace = (oldmapping) => !oldmapping.button0 &&
                                    !oldmapping.button1 &&
                                    !oldmapping.button2 &&
                                    !oldmapping.button3
const isStandardFace = (oldmapping) => makeComparable(oldmapping.button0) === makeComparable(OldStandardFaceMapping[0]) &&
                                        makeComparable(oldmapping.button1) === makeComparable(OldStandardFaceMapping[1]) &&
                                        makeComparable(oldmapping.button2) === makeComparable(OldStandardFaceMapping[2]) &&
                                        makeComparable(oldmapping.button3) === makeComparable(OldStandardFaceMapping[3])

const isNullShoulder = (oldmapping) => !oldmapping.leftShoulder && !oldmapping.rightShoulder
const isStandardShoulder = (oldmapping) => makeComparable(oldmapping.leftShoulder) === makeComparable(OldStandardShoulderMapping[0]) &&
                                            makeComparable(oldmapping.rightShoulder) === makeComparable(OldStandardShoulderMapping[1])

const isNullTrigger = (oldmapping) => !oldmapping.leftTrigger && !oldmapping.rightTrigger
const isStandardTrigger = (oldmapping) => makeComparable(oldmapping.leftTrigger) === makeComparable(OldStandardTriggerMapping[0]) &&
                                            makeComparable(oldmapping.rightTrigger) === makeComparable(OldStandardTriggerMapping[1])

const isNullLeftStick = (oldmapping) => !oldmapping.leftStickUp && !oldmapping.leftStickDown && !oldmapping.leftStickLeft && !oldmapping.leftStickRight
const isStandardLeftStick = (oldmapping) => makeComparable(oldmapping.leftStickUp) === makeComparable(OldStandardLeftStickMapping[0]) &&
                                            makeComparable(oldmapping.leftStickDown) === makeComparable(OldStandardLeftStickMapping[1]) &&
                                            makeComparable(oldmapping.leftStickLeft) === makeComparable(OldStandardLeftStickMapping[2]) &&
                                            makeComparable(oldmapping.leftStickRight) === makeComparable(OldStandardLeftStickMapping[3])

const isNullRightStick = (oldmapping) => !oldmapping.rightStickUp && !oldmapping.rightStickDown && !oldmapping.rightStickLeft && !oldmapping.rightStickRight
const isStandardRightStick = (oldmapping) => makeComparable(oldmapping.rightStickUp) === makeComparable(OldStandardRightStickMapping[0]) &&
                                            makeComparable(oldmapping.rightStickDown) === makeComparable(OldStandardRightStickMapping[1]) &&
                                            makeComparable(oldmapping.rightStickLeft) === makeComparable(OldStandardRightStickMapping[2]) &&
                                            makeComparable(oldmapping.rightStickRight) === makeComparable(OldStandardRightStickMapping[3])

const oldToNewButton = (button) => button instanceof OldAxisAsButton
    ? `new AxisAsButton(${button.direction === 'positive' ? "'+'" : "'-'"}, ${button.index}${Math.abs(button.threshold) === 0.5 ? '' : `, ${button.threshold}`}${button.deadZone ? `, ${button.deadZone}` : ''})`
    : typeof button === 'number'
        ? `${button - 1}`
        : undefined

const oldToNewDirectional = (up, down, left, right) => `new GamepadDirectionsMapping(${oldToNewButton(up)}, ${oldToNewButton(right)}, ${oldToNewButton(down)}, ${oldToNewButton(left)})`

const oldToNewFace = (down, right, left, up) => `new GamepadFaceMapping(${oldToNewButton(up)}, ${oldToNewButton(right)}, ${oldToNewButton(down)}, ${oldToNewButton(left)})`

const gamepadInfo = /([0-9a-fA-F]{4})-([0-9a-fA-F]{4})-|((?:STANDARD GAMEPAD)*s*Vendor:s*([0-9a-fA-F]{4})s*Product:s([0-9a-fA-F]{4}))/

/**
 * Compare
 * @param {OldGameInputModel} a first
 * @param {OldGameInputModel} b second
 * @returns {number} comparison value
 */
function alphabeticalById (a, b) {
    const schemaCompare = a.iconName.localeCompare(b.iconName)
    if (schemaCompare !== 0)
        return schemaCompare

    const aId = a.id.replace(gamepadInfo, '')
    const bId = b.id.replace(gamepadInfo, '')
    const idCompare = aId.localeCompare(bId)
    if (idCompare !== 0)
        return idCompare

    return a.os.localeCompare(b.os)
}

/**
 * Convert the old models from old api to new one.
 * @returns {string}    the new code
 */
export default function ConvertGamepadModels () {
    let output = ''

    for (const model of OldGameInputModels.sort(alphabeticalById)) {
        let modelType = model.schema.name

        switch (model.schema) {
        case GameInputSchema.RagdollOld:
            modelType = 'RagdollOld'
            break
        case GameInputSchema.PlumberRotatedLeft:
            modelType = 'PlumberRotatedLeft'
            break
        case GameInputSchema.PlumberRotatedRight:
            modelType = 'PlumberRotatedRight'
            break
        }

        let schema = ''

        if (model.mapping === OldStandardGamepadMapping)
            schema = 'StandardGamepadMapping'
        else {
            schema = `Standard${modelType.includes('Plumber') ? 'Plumber' : ''}GamepadMapping.variant({`

            if (isNullDPad(model.mapping))
                schema += '\n\t\tdpad: undefined,'
            else if (!isStandardDPad(model.mapping))
                schema += `\n\t\tdpad: ${oldToNewDirectional(model.mapping.dpadUp, model.mapping.dpadDown, model.mapping.dpadLeft, model.mapping.dpadRight)},`

            if (isNullFace(model.mapping))
                schema += '\n\t\tface: undefined,'
            else if (!isStandardFace(model.mapping))
                schema += `\n\t\tface: ${oldToNewFace(model.mapping.button0, model.mapping.button1, model.mapping.button2, model.mapping.button3)},`

            // Center Mapping
            schema += `\n\t\tcenter: new GamepadCenterMapping(${oldToNewButton(model.mapping.menu)}),`

            // Shoulder Mapping
            if (isNullShoulder(model.mapping))
                schema += '\n\t\tshoulder: undefined,'
            else if (!isStandardShoulder(model.mapping))
                schema += `\n\t\tshoulder: new GamepadLRMapping(${oldToNewButton(model.mapping.leftShoulder)}, ${oldToNewButton(model.mapping.rightShoulder)}),`

            // Trigger Mapping
            if (isNullTrigger(model.mapping))
                schema += '\n\t\ttrigger: undefined,'
            else if (!isStandardTrigger(model.mapping))
                schema += `\n\t\ttrigger: new GamepadLRMapping(${oldToNewButton(model.mapping.leftTrigger)}, ${oldToNewButton(model.mapping.rightTrigger)}),`

            // Left Stick Mapping,
            if (isNullLeftStick(model.mapping))
                schema += '\n\t\tleftStick: undefined,'
            else if (!isStandardLeftStick(model.mapping))
                schema += `\n\t\tleftStick: ${oldToNewDirectional(model.mapping.leftStickUp, model.mapping.leftStickDown, model.mapping.leftStickLeft, model.mapping.leftStickRight)},`

            // Right Stick Mapping
            if (isNullRightStick(model.mapping))
                schema += '\n\t\trightStick: undefined,'
            else if (!isStandardRightStick(model.mapping))
                schema += `\n\t\trightStick: ${oldToNewDirectional(model.mapping.leftStickUp, model.mapping.leftStickDown, model.mapping.leftStickLeft, model.mapping.leftStickRight)},`

            schema = schema.slice(0, -1) // remove final comma
            schema += '\n\t})'
        }

        output += `\n\tnew GameInputModel(
            GameInputSchema.${modelType},
            '${model.iconName}',
            '${model.id}',
            ${model.os ? `'${model.os}'` : 'undefined'},
            ${schema}
        ),`
    }

    return output.slice(2, -1) // remove final comma
}
