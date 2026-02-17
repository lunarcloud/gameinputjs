import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { GameInput } from './gameinput.js'

describe('GameInput Cleanup', () => {
    let gameInput
    let rafId = 1

    beforeEach(() => {
        rafId = 1

        // Mock requestAnimationFrame - don't call the callback immediately
        global.requestAnimationFrame = jest.fn(() => {
            return rafId++
        })
        global.cancelAnimationFrame = jest.fn()

        // Mock navigator.getGamepads
        global.navigator.getGamepads = jest.fn(() => [])

        // Mock window.addEventListener and removeEventListener
        global.window = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        }

        gameInput = new GameInput({ debugStatements: false })
    })

    describe('onButtonDown unsubscribe', () => {
        it('should return an unsubscribe function', () => {
            const handler = jest.fn()
            const unsubscribe = gameInput.onButtonDown(handler)

            expect(typeof unsubscribe).toBe('function')
        })

        it('should add handler to buttonDownActions', () => {
            const handler = jest.fn()
            gameInput.onButtonDown(handler)

            expect(gameInput.buttonDownActions).toContain(handler)
        })

        it('should remove handler when unsubscribe is called', () => {
            const handler = jest.fn()
            const unsubscribe = gameInput.onButtonDown(handler)

            expect(gameInput.buttonDownActions).toContain(handler)

            unsubscribe()

            expect(gameInput.buttonDownActions).not.toContain(handler)
        })

        it('should not affect other handlers when one is unsubscribed', () => {
            const handler1 = jest.fn()
            const handler2 = jest.fn()
            const handler3 = jest.fn()

            gameInput.onButtonDown(handler1)
            const unsubscribe2 = gameInput.onButtonDown(handler2)
            gameInput.onButtonDown(handler3)

            expect(gameInput.buttonDownActions.length).toBe(3)

            unsubscribe2()

            expect(gameInput.buttonDownActions.length).toBe(2)
            expect(gameInput.buttonDownActions).toContain(handler1)
            expect(gameInput.buttonDownActions).not.toContain(handler2)
            expect(gameInput.buttonDownActions).toContain(handler3)
        })

        it('should handle multiple unsubscribe calls safely', () => {
            const handler = jest.fn()
            const unsubscribe = gameInput.onButtonDown(handler)

            unsubscribe()
            expect(gameInput.buttonDownActions).not.toContain(handler)

            // Should not throw when called again
            expect(() => unsubscribe()).not.toThrow()
        })
    })

    describe('onButtonUp unsubscribe', () => {
        it('should return an unsubscribe function', () => {
            const handler = jest.fn()
            const unsubscribe = gameInput.onButtonUp(handler)

            expect(typeof unsubscribe).toBe('function')
        })

        it('should add handler to buttonUpActions', () => {
            const handler = jest.fn()
            gameInput.onButtonUp(handler)

            expect(gameInput.buttonUpActions).toContain(handler)
        })

        it('should remove handler when unsubscribe is called', () => {
            const handler = jest.fn()
            const unsubscribe = gameInput.onButtonUp(handler)

            expect(gameInput.buttonUpActions).toContain(handler)

            unsubscribe()

            expect(gameInput.buttonUpActions).not.toContain(handler)
        })
    })

    describe('onReinitialize unsubscribe', () => {
        it('should return an unsubscribe function', () => {
            const handler = jest.fn()
            const unsubscribe = gameInput.onReinitialize(handler)

            expect(typeof unsubscribe).toBe('function')
        })

        it('should add handler to reinitializeActions', () => {
            const handler = jest.fn()
            gameInput.onReinitialize(handler)

            expect(gameInput.reinitializeActions).toContain(handler)
        })

        it('should remove handler when unsubscribe is called', () => {
            const handler = jest.fn()
            const unsubscribe = gameInput.onReinitialize(handler)

            expect(gameInput.reinitializeActions).toContain(handler)

            unsubscribe()

            expect(gameInput.reinitializeActions).not.toContain(handler)
        })
    })

    describe('destroy', () => {
        it('should clear all event listener arrays', () => {
            const handler1 = jest.fn()
            const handler2 = jest.fn()
            const handler3 = jest.fn()

            gameInput.onButtonDown(handler1)
            gameInput.onButtonUp(handler2)
            gameInput.onReinitialize(handler3)

            expect(gameInput.buttonDownActions.length).toBeGreaterThan(0)
            expect(gameInput.buttonUpActions.length).toBeGreaterThan(0)
            expect(gameInput.reinitializeActions.length).toBeGreaterThan(0)

            gameInput.destroy()

            expect(gameInput.buttonDownActions.length).toBe(0)
            expect(gameInput.buttonUpActions.length).toBe(0)
            expect(gameInput.reinitializeActions.length).toBe(0)
        })

        it('should stop the update loop', () => {
            gameInput.destroy()

            // The update loop should be stopped
            expect(global.cancelAnimationFrame).toHaveBeenCalled()
        })

        it('should remove window event listeners', () => {
            const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

            gameInput.destroy()

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'gamepadconnected',
                expect.any(Function),
                false
            )
            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'gamepaddisconnected',
                expect.any(Function),
                false
            )

            removeEventListenerSpy.mockRestore()
        })

        it('should clear player models', () => {
            gameInput.destroy()

            for (const player of gameInput.Players) {
                expect(player.model).toBeUndefined()
            }
        })

        it('should clear gamepad references', () => {
            gameInput.destroy()

            expect(gameInput.Connection.Gamepads).toEqual([
                undefined,
                undefined,
                undefined,
                undefined
            ])
        })

        it('should be safe to call multiple times', () => {
            expect(() => {
                gameInput.destroy()
                gameInput.destroy()
            }).not.toThrow()
        })
    })

    describe('Multiple subscribe/unsubscribe cycles', () => {
        it('should handle multiple subscribe and unsubscribe cycles', () => {
            const handler1 = jest.fn()
            const handler2 = jest.fn()

            // First cycle
            const unsub1 = gameInput.onButtonDown(handler1)
            expect(gameInput.buttonDownActions).toContain(handler1)
            unsub1()
            expect(gameInput.buttonDownActions).not.toContain(handler1)

            // Second cycle with same handler
            const unsub2 = gameInput.onButtonDown(handler1)
            expect(gameInput.buttonDownActions).toContain(handler1)

            // Add another handler
            const unsub3 = gameInput.onButtonDown(handler2)
            expect(gameInput.buttonDownActions).toContain(handler2)
            expect(gameInput.buttonDownActions.length).toBe(2)

            // Unsubscribe the second handler
            unsub3()
            expect(gameInput.buttonDownActions.length).toBe(1)
            expect(gameInput.buttonDownActions).toContain(handler1)
            expect(gameInput.buttonDownActions).not.toContain(handler2)

            // Unsubscribe the first handler
            unsub2()
            expect(gameInput.buttonDownActions.length).toBe(0)
        })

        it('should work with same handler subscribed multiple times', () => {
            const handler = jest.fn()

            const unsub1 = gameInput.onButtonDown(handler)
            const unsub2 = gameInput.onButtonDown(handler)

            // Handler should be in the array twice
            const occurrences = gameInput.buttonDownActions.filter(h => h === handler).length
            expect(occurrences).toBe(2)

            // Unsubscribe once - should remove only one instance
            unsub1()
            const occurrencesAfterFirst = gameInput.buttonDownActions.filter(h => h === handler).length
            expect(occurrencesAfterFirst).toBe(1)

            // Unsubscribe again - should remove the second instance
            unsub2()
            const occurrencesAfterSecond = gameInput.buttonDownActions.filter(h => h === handler).length
            expect(occurrencesAfterSecond).toBe(0)
        })
    })
})
