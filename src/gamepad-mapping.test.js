/* Test of Gamepad Mapping */

import { test, expect } from '@jest/globals'
import { StandardPlumberGamepadMapping, StandardGamepadMapping } from './standard-gamepad-mapping.js'
import { AxisAsButton } from './axis-as-button.js'
import { FaceDirections } from './gamepad-mapping.js'
import GameInputModels from './gameinput-models.js'

/**
 * This is what they state a gamepad labeled "STANDARD MAPPING" should look like.
 * Some gamepads physically have a subset of these available, but they will still map this way.
 */
const w3cStandardMapping = {
    buttons: [
        'button0',
        'button1',
        'button2',
        'button3',
        'leftShoulder',
        'rightShoulder',
        'leftTrigger',
        'rightTrigger',
        'back',
        'menu',
        'leftStickClick',
        'rightStickClick',
        'dpadUp',
        'dpadDown',
        'dpadLeft',
        'dpadRight',
        'os'
    ],
    axes: {
        leftStickLeft: new AxisAsButton('-', 0),
        leftStickRight: new AxisAsButton('+', 0),
        leftStickUp: new AxisAsButton('-', 1),
        leftStickDown: new AxisAsButton('+', 1),
        rightStickLeft: new AxisAsButton('-', 2),
        rightStickRight: new AxisAsButton('+', 2),
        rightStickUp: new AxisAsButton('-', 3),
        rightStickDown: new AxisAsButton('+', 3)
    }
}

const mapping = StandardGamepadMapping

test('Standard face button mappings', () => {
    expect(mapping.face.ordinal(0)).toBe(w3cStandardMapping.buttons.indexOf('button0'))
    expect(mapping.face.ordinal(1)).toBe(w3cStandardMapping.buttons.indexOf('button1'))
    expect(mapping.face.ordinal(2)).toBe(w3cStandardMapping.buttons.indexOf('button2'))
    expect(mapping.face.ordinal(3)).toBe(w3cStandardMapping.buttons.indexOf('button3'))
})

test('LTR button mappings directions to ordinal', () => {
    expect(mapping.face.direction).toBe(FaceDirections.ltr)
    expect(mapping.face.ordinal(0)).toBe(mapping.face.down)
    expect(mapping.face.ordinal(1)).toBe(mapping.face.right)
    expect(mapping.face.ordinal(2)).toBe(mapping.face.left)
    expect(mapping.face.ordinal(3)).toBe(mapping.face.up)
})

test('RTL button mappings directions to ordinal', () => {
    const rtlMapping = StandardPlumberGamepadMapping
    expect(rtlMapping.face.direction).toBe(FaceDirections.rtl)
    expect(rtlMapping.face.ordinal(0)).toBe(rtlMapping.face.right)
    expect(rtlMapping.face.ordinal(1)).toBe(rtlMapping.face.down)
    expect(rtlMapping.face.ordinal(2)).toBe(rtlMapping.face.up)
    expect(rtlMapping.face.ordinal(3)).toBe(rtlMapping.face.left)
})

test('Standard DPad button mappings', () => {
    expect(mapping.dpad.up).toBe(w3cStandardMapping.buttons.indexOf('dpadUp'))
    expect(mapping.dpad.down).toBe(w3cStandardMapping.buttons.indexOf('dpadDown'))
    expect(mapping.dpad.left).toBe(w3cStandardMapping.buttons.indexOf('dpadLeft'))
    expect(mapping.dpad.right).toBe(w3cStandardMapping.buttons.indexOf('dpadRight'))
})

test('Standard center button mappings', () => {
    expect(mapping.center.menu).toBe(w3cStandardMapping.buttons.indexOf('menu'))
    expect(mapping.center.back).toBe(w3cStandardMapping.buttons.indexOf('back'))
})

test('Standard shoulder button mappings', () => {
    expect(mapping.shoulder.left).toBe(w3cStandardMapping.buttons.indexOf('leftShoulder'))
    expect(mapping.shoulder.right).toBe(w3cStandardMapping.buttons.indexOf('rightShoulder'))
})

test('Standard trigger button mappings', () => {
    expect(mapping.trigger.left).toBe(w3cStandardMapping.buttons.indexOf('leftTrigger'))
    expect(mapping.trigger.right).toBe(w3cStandardMapping.buttons.indexOf('rightTrigger'))
})

test('Standard left stick mappings', () => {
    expect(mapping.leftStick.up).toStrictEqual(w3cStandardMapping.axes.leftStickUp)
    expect(mapping.leftStick.down).toStrictEqual(w3cStandardMapping.axes.leftStickDown)
    expect(mapping.leftStick.left).toStrictEqual(w3cStandardMapping.axes.leftStickLeft)
    expect(mapping.leftStick.right).toStrictEqual(w3cStandardMapping.axes.leftStickRight)
})

test('Standard right stick mappings', () => {
    expect(mapping.leftStick.up).toStrictEqual(w3cStandardMapping.axes.leftStickUp)
    expect(mapping.leftStick.down).toStrictEqual(w3cStandardMapping.axes.leftStickDown)
    expect(mapping.leftStick.left).toStrictEqual(w3cStandardMapping.axes.leftStickLeft)
    expect(mapping.leftStick.right).toStrictEqual(w3cStandardMapping.axes.leftStickRight)
})

const mappingsSeen = new Set()
for (const model of GameInputModels) {
    // check that there are no duplicate mappings in the same os context
    const mappingUniqueID = `${model.id}::${model.os}`
    test(`Mapping "${mappingUniqueID}" is unique`, () => {
        expect(mappingsSeen.has(mappingUniqueID)).toBeFalsy()
        mappingsSeen.add(mappingUniqueID)
    })

    // check that there are no duplicate button mappings within gamepads
    const indexesSeen = new Set()
    for (const i in model.mapping) {
        const section = model.mapping[i]
        for (const j in section) {
            let item = section[j]

            if (item instanceof AxisAsButton)
                item = `axis:${item.direction}${item.index}`
            else if (typeof item === 'number')
                item = `button:${item}`
            else
                continue

            test(`Mapping "${mappingUniqueID}" ${item} is unique`, () => {
                expect(mappingsSeen.has(item)).toBeFalsy()
                indexesSeen.add(item)
            })
        }
    }
}
