/* Test of Vendor-based Theme Matching */

import { test, expect } from '@jest/globals'
import { GameInput } from './gameinput.js'
import { GameInputSchema } from './gameinput-schema.js'

test('VendorThemes should match Nintendo devices to Plumber theme', () => {
    const nintendoModel = GameInput.Models.VendorThemes.find(m => m.VendorId === '057e')
    expect(nintendoModel).toBeDefined()
    expect(nintendoModel.schema.name).toBe('Plumber')

    // Test different Nintendo device formats
    expect(nintendoModel.matchesVendor('057e-2009-Nintendo Switch Pro Controller')).toBeTruthy()
    expect(nintendoModel.matchesVendor('Nintendo Switch Pro Controller (Vendor: 057e Product: 2009)')).toBeTruthy()
    expect(nintendoModel.matchesVendor('Nintendo Switch Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)')).toBeTruthy()
})

test('VendorThemes should match Microsoft devices to Hedgehog theme', () => {
    const microsoftModel = GameInput.Models.VendorThemes.find(m => m.VendorId === '045e')
    expect(microsoftModel).toBeDefined()
    expect(microsoftModel.schema.name).toBe('Hedgehog')

    // Test different Microsoft device formats
    expect(microsoftModel.matchesVendor('045e-028e-Xbox 360 Controller')).toBeTruthy()
    expect(microsoftModel.matchesVendor('Xbox One Controller (Vendor: 045e Product: 0b13)')).toBeTruthy()
})

test('VendorThemes should match Sony devices to Ragdoll theme', () => {
    const sonyModel = GameInput.Models.VendorThemes.find(m => m.VendorId === '054c')
    expect(sonyModel).toBeDefined()
    expect(sonyModel.schema.name).toBe('Ragdoll')

    // Test different Sony device formats
    expect(sonyModel.matchesVendor('054c-0ce6-DualSense Wireless Controller')).toBeTruthy()
    expect(sonyModel.matchesVendor('054c-05c4-Wireless Controller')).toBeTruthy()
    expect(sonyModel.matchesVendor('DualSense Wireless Controller (Vendor: 054c Product: 0ce6)')).toBeTruthy()
    expect(sonyModel.matchesVendor('DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)')).toBeTruthy()
})

test('VendorThemes should not match devices from different vendors', () => {
    const nintendoModel = GameInput.Models.VendorThemes.find(m => m.VendorId === '057e')

    expect(nintendoModel.matchesVendor('045e-028e-Xbox 360 Controller')).toBeFalsy()
    expect(nintendoModel.matchesVendor('054c-0ce6-Sony DualSense')).toBeFalsy()
})

test('GameInputModel should correctly parse STANDARD GAMEPAD flag', () => {
    const model1 = GameInput.Models.VendorThemes[0]
    const gamepadWithStandard = '057e-2009-Nintendo Switch Pro Controller'
    const gamepadWithStandardChrome = 'Nintendo Switch Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)'

    // The VendorTheme model itself should parse correctly
    expect(model1.VendorId).toBeDefined()
    expect(model1.ProductId).toBeDefined()

    // Test parsing through a new model instance
    const testModel1 = new GameInput.Models.Specific[0].constructor(
        GameInputSchema.Plumber,
        'generic',
        gamepadWithStandard
    )
    expect(testModel1.IsStandardGamepad).toBeFalsy()

    const testModel2 = new GameInput.Models.Specific[0].constructor(
        GameInputSchema.Plumber,
        'generic',
        gamepadWithStandardChrome
    )
    expect(testModel2.IsStandardGamepad).toBeTruthy()
})
