import { describe, it, expect, beforeEach } from '@jest/globals'
import { GameInput } from './gameinput.js'
import { AxisAsButton } from './axis-as-button.js'
import { GameInputModel } from './gameinput-model.js'
import { GameInputSchema } from './gameinput-schema.js'

describe('GameInputPlayer Deadzone API', () => {
    let gameInput
    let player

    beforeEach(() => {
        // Create a GameInput instance with debug disabled
        gameInput = new GameInput({ debugStatements: false, maxPlayers: 4 })
        player = gameInput.getPlayer(0)

        // Set up a mock gamepad model
        const mockModel = new GameInputModel(GameInputSchema.Hedgehog, 'generic')
        player.setModel(mockModel)
    })

    describe('setDeadzone', () => {
        it('should set deadzone for entire left stick', () => {
            player.setDeadzone('leftStick', 0.2)
            expect(player.getDeadzone('leftStick.x')).toBe(0.2)
            expect(player.getDeadzone('leftStick.y')).toBe(0.2)
        })

        it('should set deadzone for entire right stick', () => {
            player.setDeadzone('rightStick', 0.3)
            expect(player.getDeadzone('rightStick.x')).toBe(0.3)
            expect(player.getDeadzone('rightStick.y')).toBe(0.3)
        })

        it('should set deadzone for individual axis', () => {
            player.setDeadzone('leftStick.x', 0.1)
            player.setDeadzone('leftStick.y', 0.2)
            expect(player.getDeadzone('leftStick.x')).toBe(0.1)
            expect(player.getDeadzone('leftStick.y')).toBe(0.2)
        })

        it('should set deadzone for triggers', () => {
            player.setDeadzone('trigger.left', 0.15)
            player.setDeadzone('trigger.right', 0.25)
            expect(player.getDeadzone('trigger.left')).toBe(0.15)
            expect(player.getDeadzone('trigger.right')).toBe(0.25)
        })

        it('should set deadzone for both triggers at once', () => {
            player.setDeadzone('trigger', 0.2)
            expect(player.getDeadzone('trigger.left')).toBe(0.2)
            expect(player.getDeadzone('trigger.right')).toBe(0.2)
        })

        it('should throw error for invalid value', () => {
            expect(() => player.setDeadzone('leftStick', -0.1)).toThrow('Deadzone value must be a number between 0 and 1')
            expect(() => player.setDeadzone('leftStick', 1.5)).toThrow('Deadzone value must be a number between 0 and 1')
            expect(() => player.setDeadzone('leftStick', 'invalid')).toThrow('Deadzone value must be a number between 0 and 1')
        })

        it('should throw error for invalid path', () => {
            expect(() => player.setDeadzone('invalidStick', 0.2)).toThrow('Invalid path')
            expect(() => player.setDeadzone('leftStick.z', 0.2)).toThrow('Invalid path')
        })

        it('should accept boundary values 0 and 1', () => {
            expect(() => player.setDeadzone('leftStick', 0)).not.toThrow()
            expect(() => player.setDeadzone('leftStick', 1)).not.toThrow()
            expect(player.getDeadzone('leftStick.x')).toBe(1)
        })
    })

    describe('getDeadzone', () => {
        it('should return undefined for unset deadzone', () => {
            expect(player.getDeadzone('leftStick.x')).toBeUndefined()
        })

        it('should return set deadzone value', () => {
            player.setDeadzone('leftStick.x', 0.25)
            expect(player.getDeadzone('leftStick.x')).toBe(0.25)
        })

        it('should return stick-level deadzone when querying stick', () => {
            player.setDeadzone('leftStick', 0.3)
            expect(player.getDeadzone('leftStick')).toBe(0.3)
        })

        it('should return undefined for undefined paths', () => {
            expect(player.getDeadzone('invalid.path')).toBeUndefined()
        })
    })

    describe('resetDeadzone', () => {
        it('should reset specific axis deadzone', () => {
            player.setDeadzone('leftStick.x', 0.2)
            player.setDeadzone('leftStick.y', 0.3)
            player.resetDeadzone('leftStick.x')
            expect(player.getDeadzone('leftStick.x')).toBeUndefined()
            expect(player.getDeadzone('leftStick.y')).toBe(0.3)
        })

        it('should reset entire stick deadzones', () => {
            player.setDeadzone('leftStick', 0.2)
            player.resetDeadzone('leftStick')
            expect(player.getDeadzone('leftStick.x')).toBeUndefined()
            expect(player.getDeadzone('leftStick.y')).toBeUndefined()
        })

        it('should reset all deadzones when called without arguments', () => {
            player.setDeadzone('leftStick', 0.2)
            player.setDeadzone('rightStick.x', 0.3)
            player.setDeadzone('trigger.left', 0.1)
            player.resetDeadzone()
            expect(player.getDeadzone('leftStick.x')).toBeUndefined()
            expect(player.getDeadzone('rightStick.x')).toBeUndefined()
            expect(player.getDeadzone('trigger.left')).toBeUndefined()
        })

        it('should reset trigger deadzones', () => {
            player.setDeadzone('trigger', 0.2)
            player.resetDeadzone('trigger')
            expect(player.getDeadzone('trigger.left')).toBeUndefined()
            expect(player.getDeadzone('trigger.right')).toBeUndefined()
        })
    })

    describe('Integration with getStickVector', () => {
        beforeEach(() => {
            // Mock the gamepad state with axis-based buttons
            player.state.leftStick = {
                up: { value: -0.3, active: true, item: new AxisAsButton('-', 1, 0.5, 0.1) },
                down: { value: 0, active: false, item: new AxisAsButton('+', 1, 0.5, 0.1) },
                left: { value: -0.2, active: true, item: new AxisAsButton('-', 0, 0.5, 0.1) },
                right: { value: 0, active: false, item: new AxisAsButton('+', 0, 0.5, 0.1) }
            }
        })

        it('should use runtime deadzone when set', () => {
            // Set a larger deadzone to filter out small movements
            player.setDeadzone('leftStick', 0.25)

            const vector = player.getStickVector('left')

            // With deadzone 0.25, input of -0.2 on x-axis should be filtered to 0
            // Input of -0.3 on y-axis should be normalized: (0.3 - 0.25) / (1 - 0.25) = 0.05 / 0.75 ≈ 0.067
            // For "up" direction with negative axis, the code does: vector.y -= normalized where normalized is negative
            // So: vector.y -= (-0.067) = vector.y + 0.067 = 0.067
            expect(vector.x).toBeCloseTo(0, 2)
            expect(vector.y).toBeCloseTo(0.067, 2)
        })

        it('should fall back to model deadzone when runtime deadzone not set', () => {
            const vector = player.getStickVector('left')

            // With model deadzone 0.1:
            // x-axis: (0.2 - 0.1) / (1 - 0.1) = 0.1 / 0.9 ≈ 0.111, but sign is negative for "left"
            // y-axis: (0.3 - 0.1) / (1 - 0.1) = 0.2 / 0.9 ≈ 0.222, sign is positive for "up"
            expect(vector.x).toBeCloseTo(-0.111, 2)
            expect(vector.y).toBeCloseTo(0.222, 2)
        })

        it('should support different deadzones per axis', () => {
            player.setDeadzone('leftStick.x', 0.3)
            player.setDeadzone('leftStick.y', 0.15)

            const vector = player.getStickVector('left')

            // x-axis: -0.2 is below deadzone 0.3, so should be 0
            // y-axis: (0.3 - 0.15) / (1 - 0.15) = 0.15 / 0.85 ≈ 0.176
            expect(vector.x).toBeCloseTo(0, 2)
            expect(vector.y).toBeCloseTo(0.176, 2)
        })
    })

    describe('Integration with getNormalizedStickVector', () => {
        beforeEach(() => {
            // Mock the gamepad mapping and state
            player.mapping = {
                leftStick: {
                    up: new AxisAsButton('-', 1, 0.5, 0.1),
                    down: new AxisAsButton('+', 1, 0.5, 0.1),
                    left: new AxisAsButton('-', 0, 0.5, 0.1),
                    right: new AxisAsButton('+', 0, 0.5, 0.1)
                }
            }

            player.state.leftStick = {
                up: { value: -0.5, active: true, item: player.mapping.leftStick.up },
                down: { value: 0, active: false, item: player.mapping.leftStick.down },
                left: { value: -0.5, active: true, item: player.mapping.leftStick.left },
                right: { value: 0, active: false, item: player.mapping.leftStick.right }
            }
        })

        it('should apply radial deadzone with runtime override', () => {
            player.setDeadzone('leftStick', 0.3)

            const vector = player.getNormalizedStickVector('left')

            // With deadzone 0.3, the normalized result should be approximately (-0.105, 0.105)
            // x is negative (left), y is positive (up in library's coordinate system)
            expect(vector.x).toBeCloseTo(-0.105, 1)
            expect(vector.y).toBeCloseTo(0.105, 1)
        })

        it('should return zero vector when within radial deadzone', () => {
            player.setDeadzone('leftStick', 0.8)

            const vector = player.getNormalizedStickVector('left')

            // With large deadzone, the stick input should be zeroed out
            expect(vector.x).toBe(0)
            expect(vector.y).toBe(0)
        })
    })

    describe('Backward compatibility', () => {
        it('should work without any runtime deadzones set', () => {
            // Set up gamepad state
            player.state.leftStick = {
                up: { value: -0.3, active: true, item: new AxisAsButton('-', 1, 0.5, 0.1) },
                down: { value: 0, active: false, item: new AxisAsButton('+', 1, 0.5, 0.1) },
                left: { value: 0, active: false, item: new AxisAsButton('-', 0, 0.5, 0.1) },
                right: { value: 0, active: false, item: new AxisAsButton('+', 0, 0.5, 0.1) }
            }

            // Should use model-defined deadzone (0.1)
            const vector = player.getStickVector('left')
            // (0.3 - 0.1) / (1 - 0.1) = 0.2 / 0.9 ≈ 0.222
            expect(vector.y).toBeCloseTo(0.222, 2)
        })
    })

    describe('Runtime override priority', () => {
        it('should prioritize runtime deadzone over model deadzone', () => {
            player.state.leftStick = {
                up: { value: -0.3, active: true, item: new AxisAsButton('-', 1, 0.5, 0.25) },
                down: { value: 0, active: false, item: new AxisAsButton('+', 1, 0.5, 0.25) },
                left: { value: 0, active: false, item: new AxisAsButton('-', 0, 0.5, 0.25) },
                right: { value: 0, active: false, item: new AxisAsButton('+', 0, 0.5, 0.25) }
            }

            // Model has deadzone 0.25, set runtime to 0.1
            player.setDeadzone('leftStick.y', 0.1)

            const vector = player.getStickVector('left')

            // Should use runtime deadzone 0.1, not model's 0.25
            // (0.3 - 0.1) / (1 - 0.1) = 0.2 / 0.9 ≈ 0.222
            expect(vector.y).toBeCloseTo(0.222, 2)
        })
    })
})
