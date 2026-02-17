/* Test of GameInputSchema */

import { describe, it, expect } from '@jest/globals'
import { GameInputSchema } from './gameinput-schema.js'
import { FaceDirections } from './gamepad-mapping.js'

describe('GameInputSchema', () => {
    describe('constructor', () => {
        it('should not mutate static Defaults object', () => {
            // Store original defaults - shallow copy is sufficient since values are primitives
            const originalDefaults = {
                dpad: { ...GameInputSchema.Defaults.dpad },
                center: { ...GameInputSchema.Defaults.center },
                face: { ...GameInputSchema.Defaults.face },
                leftStick: { ...GameInputSchema.Defaults.leftStick },
                rightStick: { ...GameInputSchema.Defaults.rightStick },
                shoulder: { ...GameInputSchema.Defaults.shoulder },
                trigger: { ...GameInputSchema.Defaults.trigger }
            }

            // Create schema with overrides
            const schema1 = new GameInputSchema('TestSchema1', FaceDirections.ltr, {
                face: {
                    up: 'Custom1',
                    down: 'Custom2',
                    left: 'Custom3',
                    right: 'Custom4'
                },
                shoulder: {
                    left: 'CustomL1',
                    right: 'CustomR1'
                }
            })

            // Verify Defaults were not mutated
            expect(GameInputSchema.Defaults.face.up).toBe(originalDefaults.face.up)
            expect(GameInputSchema.Defaults.face.down).toBe(originalDefaults.face.down)
            expect(GameInputSchema.Defaults.face.left).toBe(originalDefaults.face.left)
            expect(GameInputSchema.Defaults.face.right).toBe(originalDefaults.face.right)
            expect(GameInputSchema.Defaults.shoulder.left).toBe(originalDefaults.shoulder.left)
            expect(GameInputSchema.Defaults.shoulder.right).toBe(originalDefaults.shoulder.right)

            // Verify schema1 has the correct overrides
            expect(schema1.face.up).toBe('Custom1')
            expect(schema1.face.down).toBe('Custom2')
            expect(schema1.face.left).toBe('Custom3')
            expect(schema1.face.right).toBe('Custom4')
            expect(schema1.shoulder.left).toBe('CustomL1')
            expect(schema1.shoulder.right).toBe('CustomR1')

            // Create another schema with different overrides
            const schema2 = new GameInputSchema('TestSchema2', FaceDirections.rtl, {
                trigger: {
                    left: 'Z1',
                    right: 'Z2'
                },
                center: {
                    menu: 'Start',
                    back: 'Select'
                }
            })

            // Verify Defaults still intact
            expect(GameInputSchema.Defaults.trigger.left).toBe(originalDefaults.trigger.left)
            expect(GameInputSchema.Defaults.trigger.right).toBe(originalDefaults.trigger.right)
            expect(GameInputSchema.Defaults.center.menu).toBe(originalDefaults.center.menu)
            expect(GameInputSchema.Defaults.center.back).toBe(originalDefaults.center.back)

            // Verify schema2 has the correct overrides
            expect(schema2.trigger.left).toBe('Z1')
            expect(schema2.trigger.right).toBe('Z2')
            expect(schema2.center.menu).toBe('Start')
            expect(schema2.center.back).toBe('Select')

            // Verify schema1 was not affected by schema2
            expect(schema1.trigger.left).toBe(originalDefaults.trigger.left)
            expect(schema1.trigger.right).toBe(originalDefaults.trigger.right)
        })

        it('should create independent schema instances', () => {
            const schema1 = new GameInputSchema('Schema1', FaceDirections.ltr, {
                face: { up: 'A', down: 'B', left: 'C', right: 'D' }
            })

            const schema2 = new GameInputSchema('Schema2', FaceDirections.rtl, {
                face: { up: 'W', down: 'X', left: 'Y', right: 'Z' }
            })

            // Each schema should have its own overrides
            expect(schema1.face.up).toBe('A')
            expect(schema2.face.up).toBe('W')

            // Schemas should not affect each other
            expect(schema1.face.up).not.toBe(schema2.face.up)
        })

        it('should preserve default values for non-overridden properties', () => {
            const schema = new GameInputSchema('TestSchema', FaceDirections.ltr, {
                face: { up: 'Y', down: 'A', left: 'X', right: 'B' }
            })

            // Should preserve default values for properties not in overrides
            expect(schema.dpad.up).toBe(GameInputSchema.Defaults.dpad.up)
            expect(schema.dpad.down).toBe(GameInputSchema.Defaults.dpad.down)
            expect(schema.dpad.left).toBe(GameInputSchema.Defaults.dpad.left)
            expect(schema.dpad.right).toBe(GameInputSchema.Defaults.dpad.right)
        })
    })

    describe('predefined schemas', () => {
        it('should have correct values for Hedgehog schema', () => {
            expect(GameInputSchema.Hedgehog.name).toBe('Hedgehog')
            expect(GameInputSchema.Hedgehog.face.up).toBe('Y')
            expect(GameInputSchema.Hedgehog.face.down).toBe('A')
            expect(GameInputSchema.Hedgehog.face.left).toBe('X')
            expect(GameInputSchema.Hedgehog.face.right).toBe('B')
        })

        it('should have correct values for Plumber schema', () => {
            expect(GameInputSchema.Plumber.name).toBe('Plumber')
            expect(GameInputSchema.Plumber.face.up).toBe('X')
            expect(GameInputSchema.Plumber.face.down).toBe('B')
            expect(GameInputSchema.Plumber.face.left).toBe('Y')
            expect(GameInputSchema.Plumber.face.right).toBe('A')
        })
    })
})
