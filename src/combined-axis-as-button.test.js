/* Test of Gamepad Mapping */

import { test, expect } from '@jest/globals'
import { CombinedAxisToButton } from './combined-axis-as-button.js';

const upButton = new CombinedAxisToButton(0, 'up');
const rightButton = new CombinedAxisToButton(0, 'right');
const downButton = new CombinedAxisToButton(0, 'down');
const leftButton = new CombinedAxisToButton(0, 'left');

test('Hori Direction Values for Up', () => {
    expect(upButton.test(1)).toStrictEqual(true)
    expect(upButton.test(-1)).toStrictEqual(true)
    expect(upButton.test(-0.71429)).toStrictEqual(true)
})

test('Hori Direction Values for Right', () => {
    expect(rightButton.test(-0.14286)).toStrictEqual(true)
    expect(rightButton.test(-0.42857)).toStrictEqual(true)
    expect(rightButton.test(-0.71429)).toStrictEqual(true)
})

test('Hori Direction Values for Down', () => {
    expect(downButton.test(-0.14286)).toStrictEqual(true)
    expect(downButton.test(0.14286)).toStrictEqual(true)
    expect(downButton.test(0.42857)).toStrictEqual(true)
})

test('Hori Direction Values for Left', () => {
    expect(leftButton.test(1)).toStrictEqual(true)
    expect(leftButton.test(0.71429)).toStrictEqual(true)
    expect(leftButton.test(0.42857)).toStrictEqual(true)
})
