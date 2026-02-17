import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { GameInput } from './gameinput.js'

describe('GameInput MaxPlayers Configuration', () => {
    beforeEach(() => {
        // Mock requestAnimationFrame - don't call the callback immediately
        global.requestAnimationFrame = jest.fn(() => 1)
        global.cancelAnimationFrame = jest.fn()

        // Mock window.addEventListener and removeEventListener
        global.window = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        }
    })

    describe('auto-detection from navigator.getGamepads()', () => {
        it('should detect and use browser gamepad array length when larger than default', () => {
            // Mock navigator.getGamepads with 8 slots
            global.navigator.getGamepads = jest.fn(() => new Array(8))

            const gameInput = new GameInput({ debugStatements: false })
            expect(gameInput.Players.length).toBe(8)
        })

        it('should use minimum of 4 when browser reports 0 slots', () => {
            // Mock navigator.getGamepads with empty array
            global.navigator.getGamepads = jest.fn(() => [])

            const gameInput = new GameInput({ debugStatements: false })
            expect(gameInput.Players.length).toBe(4)
        })

        it('should use maxPlayers option when larger than detected', () => {
            // Mock navigator.getGamepads with 4 slots
            global.navigator.getGamepads = jest.fn(() => new Array(4))

            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            expect(gameInput.Players.length).toBe(8)
        })

        it('should use detected length when larger than maxPlayers option', () => {
            // Mock navigator.getGamepads with 12 slots
            global.navigator.getGamepads = jest.fn(() => new Array(12))

            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            expect(gameInput.Players.length).toBe(12)
        })
    })

    describe('default configuration (4 players)', () => {
        beforeEach(() => {
            // Mock navigator.getGamepads with empty array for default tests
            global.navigator.getGamepads = jest.fn(() => [])
        })

        it('should create 4 players by default', () => {
            const gameInput = new GameInput({ debugStatements: false })
            expect(gameInput.Players.length).toBe(4)
        })

        it('should initialize 4 player indexes correctly', () => {
            const gameInput = new GameInput({ debugStatements: false })
            expect(gameInput.Players[0].number).toBe(1)
            expect(gameInput.Players[0].index).toBe(0)
            expect(gameInput.Players[1].number).toBe(2)
            expect(gameInput.Players[1].index).toBe(1)
            expect(gameInput.Players[2].number).toBe(3)
            expect(gameInput.Players[2].index).toBe(2)
            expect(gameInput.Players[3].number).toBe(4)
            expect(gameInput.Players[3].index).toBe(3)
        })

        it('should accept valid player indexes 0-3', () => {
            const gameInput = new GameInput({ debugStatements: false })
            expect(() => gameInput.getPlayer(0)).not.toThrow()
            expect(() => gameInput.getPlayer(1)).not.toThrow()
            expect(() => gameInput.getPlayer(2)).not.toThrow()
            expect(() => gameInput.getPlayer(3)).not.toThrow()
        })

        it('should reject player index 4 and above', () => {
            const gameInput = new GameInput({ debugStatements: false })
            expect(() => gameInput.getPlayer(4)).toThrow('Index out of the 0-3 range!')
        })

        it('should reject negative player indexes', () => {
            const gameInput = new GameInput({ debugStatements: false })
            expect(() => gameInput.getPlayer(-1)).toThrow('Index out of the 0-3 range!')
        })
    })

    describe('custom maxPlayers configuration', () => {
        beforeEach(() => {
            // Reset mock for these tests
            global.navigator.getGamepads = jest.fn(() => [])
        })

        it('should create 8 players when maxPlayers is 8', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            expect(gameInput.Players.length).toBe(8)
        })

        it('should initialize 8 player indexes correctly', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            for (let i = 0; i < 8; i++) {
                expect(gameInput.Players[i].number).toBe(i + 1)
                expect(gameInput.Players[i].index).toBe(i)
            }
        })

        it('should accept valid player indexes 0-7 for 8 players', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            for (let i = 0; i < 8; i++) {
                expect(() => gameInput.getPlayer(i)).not.toThrow()
            }
        })

        it('should reject player index 8 and above for 8 players', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            expect(() => gameInput.getPlayer(8)).toThrow('Index out of the 0-7 range!')
        })

        it('should create 16 players when maxPlayers is 16', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 16 })
            expect(gameInput.Players.length).toBe(16)
        })

        it('should accept valid player indexes 0-15 for 16 players', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 16 })
            for (let i = 0; i < 16; i++) {
                expect(() => gameInput.getPlayer(i)).not.toThrow()
            }
        })
    })

    describe('getGamepad bounds checking', () => {
        beforeEach(() => {
            // Reset mock for these tests
            global.navigator.getGamepads = jest.fn(() => [])
        })

        it('should accept valid player indexes for getGamepad with default 4 players', () => {
            const gameInput = new GameInput({ debugStatements: false })
            expect(() => gameInput.getGamepad(0)).not.toThrow()
            expect(() => gameInput.getGamepad(1)).not.toThrow()
            expect(() => gameInput.getGamepad(2)).not.toThrow()
            expect(() => gameInput.getGamepad(3)).not.toThrow()
        })

        it('should reject invalid player indexes for getGamepad with default 4 players', () => {
            const gameInput = new GameInput({ debugStatements: false })
            expect(() => gameInput.getGamepad(4)).toThrow('Index out of the 0-3 range!')
            expect(() => gameInput.getGamepad(-1)).toThrow('Index out of the 0-3 range!')
        })

        it('should accept valid player indexes for getGamepad with 8 players', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            for (let i = 0; i < 8; i++) {
                expect(() => gameInput.getGamepad(i)).not.toThrow()
            }
        })

        it('should reject invalid player indexes for getGamepad with 8 players', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            expect(() => gameInput.getGamepad(8)).toThrow('Index out of the 0-7 range!')
            expect(() => gameInput.getGamepad(-1)).toThrow('Index out of the 0-7 range!')
        })
    })

    describe('destroy method with maxPlayers', () => {
        beforeEach(() => {
            // Reset mock for these tests
            global.navigator.getGamepads = jest.fn(() => [])
        })

        it('should clear gamepads array for default 4 players', () => {
            const gameInput = new GameInput({ debugStatements: false })
            gameInput.destroy()
            expect(gameInput.Connection.Gamepads.length).toBe(4)
            expect(gameInput.Connection.Gamepads.every(g => g === undefined)).toBe(true)
        })

        it('should clear gamepads array for 8 players', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            gameInput.destroy()
            expect(gameInput.Connection.Gamepads.length).toBe(8)
            expect(gameInput.Connection.Gamepads.every(g => g === undefined)).toBe(true)
        })
    })

    describe('GamePadMapping initialization', () => {
        beforeEach(() => {
            // Reset mock for these tests
            global.navigator.getGamepads = jest.fn(() => [])
        })

        it('should initialize GamePadMapping for default 4 players', () => {
            const gameInput = new GameInput({ debugStatements: false })
            expect(gameInput.Connection.GamePadMapping[0]).toBe(0)
            expect(gameInput.Connection.GamePadMapping[1]).toBe(1)
            expect(gameInput.Connection.GamePadMapping[2]).toBe(2)
            expect(gameInput.Connection.GamePadMapping[3]).toBe(3)
        })

        it('should initialize GamePadMapping for 8 players', () => {
            const gameInput = new GameInput({ debugStatements: false, maxPlayers: 8 })
            for (let i = 0; i < 8; i++) {
                expect(gameInput.Connection.GamePadMapping[i]).toBe(i)
            }
        })
    })

    describe('dynamic expansion on reinitialize', () => {
        it('should expand player arrays when more gamepads detected', () => {
            // Start with 4 slots
            global.navigator.getGamepads = jest.fn(() => new Array(4))
            const gameInput = new GameInput({ debugStatements: false })
            expect(gameInput.Players.length).toBe(4)

            // Simulate 8 gamepads connecting
            global.navigator.getGamepads = jest.fn(() => new Array(8))
            gameInput.reinitialize()

            expect(gameInput.Players.length).toBe(8)
            expect(gameInput.Connection.Gamepads.length).toBe(8)
        })

        it('should allow access to newly expanded player slots', () => {
            // Start with 4 slots
            global.navigator.getGamepads = jest.fn(() => new Array(4))
            const gameInput = new GameInput({ debugStatements: false })

            // Simulate 10 gamepads connecting
            global.navigator.getGamepads = jest.fn(() => new Array(10))
            gameInput.reinitialize()

            // Should now accept indexes 0-9
            for (let i = 0; i < 10; i++) {
                expect(() => gameInput.getPlayer(i)).not.toThrow()
            }

            // Should reject index 10
            expect(() => gameInput.getPlayer(10)).toThrow('Index out of the 0-9 range!')
        })

        it('should preserve existing player data when expanding', () => {
            // Start with 4 slots
            global.navigator.getGamepads = jest.fn(() => new Array(4))
            const gameInput = new GameInput({ debugStatements: false })
            const firstPlayer = gameInput.Players[0]

            // Simulate 8 gamepads connecting
            global.navigator.getGamepads = jest.fn(() => new Array(8))
            gameInput.reinitialize()

            // First player should be the same object
            expect(gameInput.Players[0]).toBe(firstPlayer)
        })
    })
})
