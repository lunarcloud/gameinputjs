/* Test of Gamepad Mapping */

import { test, expect } from '@jest/globals';
import { StardardGamepadMapping } from './standard-gamepad-mapping.js';
import { AxisAsButton } from './axis-as-button';

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
        'select',
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
        leftStickLeft: -0,
        leftStickRight: 0,
        leftStickUp: -1,
        leftStickDown: 1,
        rightStickLeft: -2,
        rightStickRight: 2,
        rightStickUp: -3,
        rightStickDown: 3
    }
}

const mapping = StardardGamepadMapping
const gameInputMappingOffset = 1

// The following must pass/be true for this implementation to be good

for (const def in mapping) {
    const libDef = mapping[def] instanceof AxisAsButton
        ? (mapping[def].direction === 'positive' ? 1 : -1) *
            (mapping[def].index - gameInputMappingOffset)
        : mapping[def] - gameInputMappingOffset

    const standardDef = def.includes('Stick')
        ? w3cStandardMapping.axes[def]
        : w3cStandardMapping.buttons.indexOf(def)

    test(`${def} mapping`, () => expect(libDef).toBe(standardDef))
}
