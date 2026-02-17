import { describe, it, expect, jest } from '@jest/globals'
import { GameInputPlayer } from './gameinput-player.js'

describe('GameInputPlayer rumble', () => {
    describe('rumble method', () => {
        it('should apply default values when called with empty object', () => {
            // Mock GameInput
            const mockGameInput = {
                getGamepad: jest.fn()
            }

            // Mock vibrationActuator with playEffect
            const mockPlayEffect = jest.fn().mockResolvedValue('complete')
            const mockGamepad = {
                vibrationActuator: {
                    type: 'dual-rumble',
                    playEffect: mockPlayEffect
                }
            }

            mockGameInput.getGamepad.mockReturnValue(mockGamepad)

            // Create player
            const player = new GameInputPlayer(mockGameInput, 1)

            // Call rumble with empty object
            player.rumble({})

            // Verify playEffect was called with default values
            expect(mockPlayEffect).toHaveBeenCalledWith('dual-rumble', {
                startDelay: 0,
                duration: 300,
                strongMagnitude: 0.5,
                weakMagnitude: 0.5
            })
        })

        it('should apply default values when called with no arguments', () => {
            // Mock GameInput
            const mockGameInput = {
                getGamepad: jest.fn()
            }

            // Mock vibrationActuator with playEffect
            const mockPlayEffect = jest.fn().mockResolvedValue('complete')
            const mockGamepad = {
                vibrationActuator: {
                    type: 'dual-rumble',
                    playEffect: mockPlayEffect
                }
            }

            mockGameInput.getGamepad.mockReturnValue(mockGamepad)

            // Create player
            const player = new GameInputPlayer(mockGameInput, 1)

            // Call rumble with no arguments
            player.rumble()

            // Verify playEffect was called with default values
            expect(mockPlayEffect).toHaveBeenCalledWith('dual-rumble', {
                startDelay: 0,
                duration: 300,
                strongMagnitude: 0.5,
                weakMagnitude: 0.5
            })
        })

        it('should allow user-provided values to override defaults', () => {
            // Mock GameInput
            const mockGameInput = {
                getGamepad: jest.fn()
            }

            // Mock vibrationActuator with playEffect
            const mockPlayEffect = jest.fn().mockResolvedValue('complete')
            const mockGamepad = {
                vibrationActuator: {
                    type: 'dual-rumble',
                    playEffect: mockPlayEffect
                }
            }

            mockGameInput.getGamepad.mockReturnValue(mockGamepad)

            // Create player
            const player = new GameInputPlayer(mockGameInput, 1)

            // Call rumble with custom values
            player.rumble({
                duration: 500,
                strongMagnitude: 1.0
            })

            // Verify playEffect was called with custom values overriding defaults
            expect(mockPlayEffect).toHaveBeenCalledWith('dual-rumble', {
                startDelay: 0, // default
                duration: 500, // custom
                strongMagnitude: 1.0, // custom
                weakMagnitude: 0.5 // default
            })
        })

        it('should allow all values to be overridden', () => {
            // Mock GameInput
            const mockGameInput = {
                getGamepad: jest.fn()
            }

            // Mock vibrationActuator with playEffect
            const mockPlayEffect = jest.fn().mockResolvedValue('complete')
            const mockGamepad = {
                vibrationActuator: {
                    type: 'dual-rumble',
                    playEffect: mockPlayEffect
                }
            }

            mockGameInput.getGamepad.mockReturnValue(mockGamepad)

            // Create player
            const player = new GameInputPlayer(mockGameInput, 1)

            // Call rumble with all custom values
            player.rumble({
                startDelay: 100,
                duration: 1000,
                strongMagnitude: 0.8,
                weakMagnitude: 0.3
            })

            // Verify playEffect was called with all custom values
            expect(mockPlayEffect).toHaveBeenCalledWith('dual-rumble', {
                startDelay: 100,
                duration: 1000,
                strongMagnitude: 0.8,
                weakMagnitude: 0.3
            })
        })

        it('should return undefined when no vibrationActuator exists', () => {
            // Mock GameInput
            const mockGameInput = {
                getGamepad: jest.fn()
            }

            // Mock gamepad without vibrationActuator
            const mockGamepad = {}

            mockGameInput.getGamepad.mockReturnValue(mockGamepad)

            // Create player
            const player = new GameInputPlayer(mockGameInput, 1)

            // Call rumble
            const result = player.rumble()

            // Should return undefined
            expect(result).toBeUndefined()
        })

        it('should return undefined when no gamepad exists', () => {
            // Mock GameInput
            const mockGameInput = {
                getGamepad: jest.fn().mockReturnValue(null)
            }

            // Create player
            const player = new GameInputPlayer(mockGameInput, 1)

            // Call rumble
            const result = player.rumble()

            // Should return undefined
            expect(result).toBeUndefined()
        })

        it('should use fallback dual-rumble type when vibrator.type is undefined', () => {
            // Mock GameInput
            const mockGameInput = {
                getGamepad: jest.fn()
            }

            // Mock vibrationActuator without type
            const mockPlayEffect = jest.fn().mockResolvedValue('complete')
            const mockGamepad = {
                vibrationActuator: {
                    playEffect: mockPlayEffect
                }
            }

            mockGameInput.getGamepad.mockReturnValue(mockGamepad)

            // Create player
            const player = new GameInputPlayer(mockGameInput, 1)

            // Call rumble
            player.rumble()

            // Verify playEffect was called with fallback 'dual-rumble' type
            expect(mockPlayEffect).toHaveBeenCalledWith('dual-rumble', expect.any(Object))
        })
    })
})
