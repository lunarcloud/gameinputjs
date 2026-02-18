import { describe, it, expect } from '@jest/globals'
import { GameInputOptions } from './gameinput-options.js'

describe('GameInputOptions', () => {
    describe('constructor', () => {
        it('should create options with default values', () => {
            const options = new GameInputOptions()
            expect(options.debugStatements).toBe(false)
            expect(options.maxPlayers).toBe(4)
        })

        it('should allow setting debugStatements', () => {
            const options = new GameInputOptions()
            options.debugStatements = true
            expect(options.debugStatements).toBe(true)
        })

        it('should allow setting maxPlayers', () => {
            const options = new GameInputOptions()
            options.maxPlayers = 8
            expect(options.maxPlayers).toBe(8)
        })
    })
})
