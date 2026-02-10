import { describe, it, expect } from '@jest/globals'
import { GameInputOptions } from './gameinput-options.js'

describe('GameInputOptions', () => {
    describe('constructor', () => {
        it('should create options with default values', () => {
            const options = new GameInputOptions()
            expect(options.debugStatements).toBe(false)
        })

        it('should allow setting debugStatements', () => {
            const options = new GameInputOptions()
            options.debugStatements = true
            expect(options.debugStatements).toBe(true)
        })
    })
})
