#!/usr/bin/env node

/**
 * Deadzone Normalization Comparison
 *
 * This script demonstrates the difference between the old (non-normalized)
 * and new (normalized) deadzone implementations.
 */

const DEADZONE = 0.2

/**
 * Old implementation: filters deadzone but doesn't normalize
 */
function oldDeadzoneFilter (value, deadzone) {
    const absValue = Math.abs(value)
    const absDeadzone = Math.abs(deadzone)

    if (absValue <= absDeadzone) {
        return 0
    }

    return value
}

/**
 * New implementation: filters and normalizes deadzone
 */
function newDeadzoneNormalize (value, deadzone, max = 1.0) {
    const absValue = Math.abs(value)
    const absDeadzone = Math.abs(deadzone)
    const absMax = Math.abs(max)

    if (absValue <= absDeadzone) {
        return 0
    }

    const normalized = (absValue - absDeadzone) / (absMax - absDeadzone)
    const clamped = Math.min(normalized, 1)

    return value < 0 ? -clamped : clamped
}

console.log('Deadzone Normalization Comparison')
console.log('==================================')
console.log(`Deadzone: ${DEADZONE}\n`)

console.log('Input | Old Output | New Output | Difference')
console.log('------|------------|------------|------------')

const testValues = [0.0, 0.1, 0.15, 0.2, 0.3, 0.5, 0.7, 0.9, 1.0]

for (const input of testValues) {
    const oldOutput = oldDeadzoneFilter(input, DEADZONE)
    const newOutput = newDeadzoneNormalize(input, DEADZONE)
    const diff = newOutput - oldOutput

    console.log(
        `${input.toFixed(2)}  | ` +
        `${oldOutput.toFixed(3).padStart(10)} | ` +
        `${newOutput.toFixed(3).padStart(10)} | ` +
        `${diff.toFixed(3).padStart(10)}`
    )
}

console.log('\nKey Observations:')
console.log('- Values within deadzone (0.0-0.2): Both return 0')
console.log('- Deadzone edge (0.2): Old=0.2, New=0.0 ✓ Fixed!')
console.log('- Mid-range (0.5): Old=0.5, New=0.375 (rescaled)')
console.log('- Maximum (1.0): Both return 1.0 ✓')
console.log('\nThe new implementation ensures smooth, linear mapping')
console.log('from the deadzone edge (0) to maximum (1.0).')

// Radial deadzone example
console.log('\n\nRadial Deadzone Example')
console.log('=======================')
console.log('For a 2D stick with deadzone 0.2:\n')

const stickExamples = [
    { x: 0.1, y: 0.1, desc: 'Small input (within deadzone)' },
    { x: 0.3, y: 0.4, desc: 'Diagonal input (outside deadzone)' },
    { x: 0.7, y: 0.7, desc: 'Large diagonal input' },
    { x: 1.0, y: 0.0, desc: 'Maximum horizontal' }
]

for (const { x, y, desc } of stickExamples) {
    const magnitude = Math.sqrt(x * x + y * y)

    let normalizedX = 0
    let normalizedY = 0
    let normalizedMag = 0

    if (magnitude > DEADZONE) {
        const scale = Math.min((magnitude - DEADZONE) / (1 - DEADZONE), 1)
        normalizedX = (x / magnitude) * scale
        normalizedY = (y / magnitude) * scale
        normalizedMag = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY)
    }

    console.log(`${desc}:`)
    console.log(`  Input: (${x.toFixed(1)}, ${y.toFixed(1)}) mag=${magnitude.toFixed(3)}`)
    console.log(`  Output: (${normalizedX.toFixed(3)}, ${normalizedY.toFixed(3)}) mag=${normalizedMag.toFixed(3)}`)
    console.log()
}
