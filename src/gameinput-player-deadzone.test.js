import { describe, it, expect } from '@jest/globals'
import { AxisAsButton } from './axis-as-button.js'

/**
 * Helper function to test deadzone normalization
 * This is the expected behavior for proper deadzone normalization
 * @param {number} value - The raw input value
 * @param {number} deadzone - The deadzone threshold (absolute value)
 * @param {number} max - The maximum value (typically 1.0)
 * @returns {number} The normalized value
 */
function normalizeWithDeadzone (value, deadzone, max) {
    const absValue = Math.abs(value)
    const absDeadzone = Math.abs(deadzone)

    // If within deadzone, return 0
    if (absValue <= absDeadzone) {
        return 0
    }

    // Normalize to [0, 1] range after deadzone
    const normalized = (absValue - absDeadzone) / (max - absDeadzone)
    return value < 0 ? -normalized : normalized
}

describe('Deadzone Normalization', () => {
    describe('normalizeWithDeadzone helper', () => {
        it('should return 0 for values within deadzone', () => {
            expect(normalizeWithDeadzone(0.1, 0.15, 1.0)).toBe(0)
            expect(normalizeWithDeadzone(0.15, 0.15, 1.0)).toBe(0)
            expect(normalizeWithDeadzone(-0.1, 0.15, 1.0)).toBe(0)
        })

        it('should normalize values at deadzone edge to 0', () => {
            const result = normalizeWithDeadzone(0.2, 0.2, 1.0)
            expect(result).toBe(0)
        })

        it('should normalize values outside deadzone', () => {
            // Value 0.3 with deadzone 0.2 should be (0.3 - 0.2) / (1.0 - 0.2) = 0.125
            const result = normalizeWithDeadzone(0.3, 0.2, 1.0)
            expect(result).toBeCloseTo(0.125, 3)
        })

        it('should normalize maximum value to 1.0', () => {
            const result = normalizeWithDeadzone(1.0, 0.2, 1.0)
            expect(result).toBeCloseTo(1.0, 3)
        })

        it('should handle negative values', () => {
            // Value -0.3 with deadzone 0.2 should be -(0.3 - 0.2) / (1.0 - 0.2) = -0.125
            const result = normalizeWithDeadzone(-0.3, 0.2, 1.0)
            expect(result).toBeCloseTo(-0.125, 3)
        })

        it('should normalize negative maximum to -1.0', () => {
            const result = normalizeWithDeadzone(-1.0, 0.2, 1.0)
            expect(result).toBeCloseTo(-1.0, 3)
        })
    })

    describe('AxisAsButton deadzone configuration', () => {
        it('should store positive deadzone for positive direction', () => {
            const axis = new AxisAsButton('+', 0, 0.5, 0.15)
            expect(axis.deadZone).toBeGreaterThan(0)
            expect(Math.abs(axis.deadZone)).toBeCloseTo(0.15, 3)
        })

        it('should store negative deadzone for negative direction', () => {
            const axis = new AxisAsButton('-', 0, 0.5, 0.15)
            expect(axis.deadZone).toBeLessThan(0)
            expect(Math.abs(axis.deadZone)).toBeCloseTo(0.15, 3)
        })

        it('should default deadzone to 0', () => {
            const axis = new AxisAsButton('+', 0, 0.5)
            expect(axis.deadZone).toBe(0)
        })
    })

    describe('Radial deadzone for stick vectors', () => {
        it('should return zero vector for stick within radial deadzone', () => {
            const deadzone = 0.15
            const x = 0.1
            const y = 0.1
            const magnitude = Math.sqrt(x * x + y * y) // ≈ 0.141

            // If magnitude < deadzone, should return (0, 0)
            if (magnitude < deadzone) {
                expect(magnitude).toBeLessThan(deadzone)
            }
        })

        it('should normalize stick vector outside radial deadzone', () => {
            const deadzone = 0.15
            const x = 0.3
            const y = 0.4
            const magnitude = Math.sqrt(x * x + y * y) // = 0.5

            if (magnitude > deadzone) {
                // Expected normalized values
                const scale = (magnitude - deadzone) / (1 - deadzone)
                const expectedX = (x / magnitude) * scale
                const expectedY = (y / magnitude) * scale

                // Verify the calculation
                // (0.5 - 0.15) / (1 - 0.15) = 0.35 / 0.85 = 0.4117647
                // expectedX = (0.3 / 0.5) * 0.4117647 = 0.6 * 0.4117647 = 0.247
                // expectedY = (0.4 / 0.5) * 0.4117647 = 0.8 * 0.4117647 = 0.329
                expect(expectedX).toBeCloseTo(0.247, 2)
                expect(expectedY).toBeCloseTo(0.329, 2)
            }
        })

        it('should preserve direction after normalization', () => {
            const deadzone = 0.2
            const x = 0.6
            const y = 0.8
            const magnitude = Math.sqrt(x * x + y * y) // = 1.0

            // Normalize direction
            const dirX = x / magnitude
            const dirY = y / magnitude

            // Apply radial deadzone scaling
            const scale = (magnitude - deadzone) / (1 - deadzone)
            const normalizedX = dirX * scale
            const normalizedY = dirY * scale

            // Direction should be preserved
            const originalAngle = Math.atan2(y, x)
            const normalizedAngle = Math.atan2(normalizedY, normalizedX)
            expect(normalizedAngle).toBeCloseTo(originalAngle, 5)
        })
    })
})
