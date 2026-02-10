/* Test of GameInputModel */

import { describe, it, expect } from '@jest/globals'
import { GameInputModel } from './gameinput-model.js'
import { GameInputSchema } from './gameinput-schema.js'

describe('GameInputModel', () => {
    describe('GamepadIdInfoRegex', () => {
        it('should parse Firefox format (VID-PID-name)', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057e-2009-Nintendo Switch Pro Controller'
            )
            expect(model.VendorId).toBe('057e')
            expect(model.ProductId).toBe('2009')
            expect(model.ProductName).toBe('Nintendo Switch Pro Controller')
            expect(model.IsStandardGamepad).toBeFalsy()
        })

        it('should parse Chromium format without STANDARD GAMEPAD', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                'Nintendo Switch Pro Controller (Vendor: 057e Product: 2009)'
            )
            expect(model.VendorId).toBe('057e')
            expect(model.ProductId).toBe('2009')
            expect(model.ProductName).toBe('Nintendo Switch Pro Controller')
            expect(model.IsStandardGamepad).toBeFalsy()
        })

        it('should parse Chromium format with STANDARD GAMEPAD', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                'Nintendo Switch Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)'
            )
            expect(model.VendorId).toBe('057e')
            expect(model.ProductId).toBe('2009')
            expect(model.ProductName).toBe('Nintendo Switch Pro Controller')
            expect(model.IsStandardGamepad).toBeTruthy()
        })

        it('should pad vendor and product IDs to 4 characters', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '57e-209-Test Device'
            )
            expect(model.VendorId).toBe('057e')
            expect(model.ProductId).toBe('0209')
        })

        it('should handle uppercase hex digits', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057E-2009-Nintendo Switch Pro Controller'
            )
            expect(model.VendorId).toBe('057E')
            expect(model.ProductId).toBe('2009')
        })

        it('should handle mixed case hex digits', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                'Test Device (Vendor: 045E Product: 0B20)'
            )
            expect(model.VendorId).toBe('045E')
            expect(model.ProductId).toBe('0B20')
        })
    })

    describe('matches', () => {
        it('should return true for exact ID match', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057e-2009-Nintendo Switch Pro Controller'
            )
            expect(model.matches('057e-2009-Nintendo Switch Pro Controller')).toBeTruthy()
        })

        it('should return false for non-matching ID', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057e-2009-Nintendo Switch Pro Controller'
            )
            expect(model.matches('057e-2006-Nintendo Switch Left Joy-Con')).toBeFalsy()
        })

        it('should return false when model has no ID', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                undefined
            )
            expect(model.matches('057e-2009-Nintendo Switch Pro Controller')).toBeFalsy()
        })
    })

    describe('matchesVendor', () => {
        it('should return true when vendor IDs match (Firefox format)', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057e-2009-Nintendo Switch Pro Controller'
            )
            expect(model.matchesVendor('057e-2006-Nintendo Switch Left Joy-Con')).toBeTruthy()
            expect(model.matchesVendor('057e-2007-Nintendo Switch Right Joy-Con')).toBeTruthy()
        })

        it('should return true when vendor IDs match (Chromium format)', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                'Nintendo Switch Pro Controller (Vendor: 057e Product: 2009)'
            )
            expect(model.matchesVendor('Nintendo Switch Left Joy-Con (Vendor: 057e Product: 2006)')).toBeTruthy()
            expect(model.matchesVendor('Nintendo Switch Right Joy-Con (Vendor: 057e Product: 2007)')).toBeTruthy()
        })

        it('should return true when vendor IDs match (mixed formats)', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057e-2009-Nintendo Switch Pro Controller'
            )
            expect(model.matchesVendor('Nintendo Switch Left Joy-Con (Vendor: 057e Product: 2006)')).toBeTruthy()
        })

        it('should return false when vendor IDs do not match', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057e-2009-Nintendo Switch Pro Controller'
            )
            expect(model.matchesVendor('045e-028e-Xbox 360 Controller')).toBeFalsy()
        })

        it('should return false when model has no vendor ID', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                undefined
            )
            expect(model.matchesVendor('057e-2009-Nintendo Switch Pro Controller')).toBeFalsy()
        })

        it('should return false when gamepad ID is invalid', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057e-2009-Nintendo Switch Pro Controller'
            )
            expect(model.matchesVendor('Invalid Gamepad ID')).toBeFalsy()
        })

        it('should handle case-insensitive vendor ID matching', () => {
            const model = new GameInputModel(
                GameInputSchema.Plumber,
                'generic',
                '057e-2009-Nintendo Switch Pro Controller'
            )
            expect(model.matchesVendor('057E-2006-Nintendo Switch Left Joy-Con')).toBeTruthy()
        })
    })
})
