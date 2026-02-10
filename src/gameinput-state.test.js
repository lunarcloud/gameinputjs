import { describe, it, expect } from '@jest/globals'
import {
    GameInputItemState,
    GameInputLRState,
    GameInputCenterState,
    GameInputDirectionsState,
    GameInputFaceState,
    GameInputState
} from './gameinput-state.js'
import { FaceDirections } from './gamepad-mapping.js'

describe('GameInputItemState', () => {
    describe('constructor', () => {
        it('should create an item state with item reference', () => {
            const item = { name: 'testButton' }
            const state = new GameInputItemState(item)
            expect(state.item).toBe(item)
        })

        it('should have value and active properties', () => {
            const item = { name: 'testButton' }
            const state = new GameInputItemState(item)
            expect(state).toHaveProperty('value')
            expect(state).toHaveProperty('active')
        })
    })
})

describe('GameInputLRState', () => {
    describe('constructor', () => {
        it('should create state with no buttons', () => {
            const state = new GameInputLRState()
            expect(state.left).toBeUndefined()
            expect(state.right).toBeUndefined()
        })

        it('should create state with left and right buttons', () => {
            const leftItem = new GameInputItemState({ name: 'left' })
            const rightItem = new GameInputItemState({ name: 'right' })
            const state = new GameInputLRState(leftItem, rightItem)
            expect(state.left).toBe(leftItem)
            expect(state.right).toBe(rightItem)
        })
    })
})

describe('GameInputCenterState', () => {
    describe('constructor', () => {
        it('should create state with no buttons', () => {
            const state = new GameInputCenterState()
            expect(state.menu).toBeUndefined()
            expect(state.select).toBeUndefined()
        })

        it('should create state with menu and select buttons', () => {
            const menuItem = new GameInputItemState({ name: 'menu' })
            const selectItem = new GameInputItemState({ name: 'select' })
            const state = new GameInputCenterState(menuItem, selectItem)
            expect(state.menu).toBe(menuItem)
            expect(state.select).toBe(selectItem)
        })
    })
})

describe('GameInputDirectionsState', () => {
    describe('constructor', () => {
        it('should create state with no buttons', () => {
            const state = new GameInputDirectionsState()
            expect(state.up).toBeUndefined()
            expect(state.right).toBeUndefined()
            expect(state.down).toBeUndefined()
            expect(state.left).toBeUndefined()
        })

        it('should create state with all directional buttons', () => {
            const upItem = new GameInputItemState({ name: 'up' })
            const rightItem = new GameInputItemState({ name: 'right' })
            const downItem = new GameInputItemState({ name: 'down' })
            const leftItem = new GameInputItemState({ name: 'left' })
            const state = new GameInputDirectionsState(upItem, rightItem, downItem, leftItem)
            expect(state.up).toBe(upItem)
            expect(state.right).toBe(rightItem)
            expect(state.down).toBe(downItem)
            expect(state.left).toBe(leftItem)
        })

        it('should extend GameInputLRState', () => {
            const state = new GameInputDirectionsState()
            expect(state).toBeInstanceOf(GameInputLRState)
        })
    })
})

describe('GameInputFaceState', () => {
    describe('constructor', () => {
        it('should create state with default direction', () => {
            const state = new GameInputFaceState()
            expect(state.direction).toBe(FaceDirections.ltr)
        })

        it('should create state with specified direction', () => {
            const state = new GameInputFaceState(undefined, undefined, undefined, undefined, FaceDirections.rtl)
            expect(state.direction).toBe(FaceDirections.rtl)
        })

        it('should extend GameInputDirectionsState', () => {
            const state = new GameInputFaceState()
            expect(state).toBeInstanceOf(GameInputDirectionsState)
        })
    })

    describe('ordinal', () => {
        it('should return button by ordinal priority with ltr direction', () => {
            const downItem = new GameInputItemState({ name: 'down' })
            const rightItem = new GameInputItemState({ name: 'right' })
            const leftItem = new GameInputItemState({ name: 'left' })
            const upItem = new GameInputItemState({ name: 'up' })
            const state = new GameInputFaceState(upItem, rightItem, downItem, leftItem, FaceDirections.ltr)

            // For ltr (Xbox/Hedgehog), ordinal 0 is down (A button)
            expect(state.ordinal(0)).toBe(downItem)
        })
    })

    describe('variant', () => {
        it('should create a variant with overrides', () => {
            const state = new GameInputFaceState()
            const newUpItem = new GameInputItemState({ name: 'newUp' })
            const variant = state.variant({ up: newUpItem })

            expect(variant).toBeInstanceOf(GameInputFaceState)
            expect(variant.up).toBe(newUpItem)
            expect(variant).not.toBe(state) // Should be a new instance
        })

        it('should preserve other properties when creating variant', () => {
            const downItem = new GameInputItemState({ name: 'down' })
            const state = new GameInputFaceState(undefined, undefined, downItem, undefined, FaceDirections.rtl)
            const variant = state.variant({})

            expect(variant.down).toBe(downItem)
            expect(variant.direction).toBe(FaceDirections.rtl)
        })
    })
})

describe('GameInputState', () => {
    describe('constructor', () => {
        it('should create state with default values', () => {
            const state = new GameInputState()
            expect(state.dpad).toBeInstanceOf(GameInputDirectionsState)
            expect(state.face).toBeInstanceOf(GameInputFaceState)
            expect(state.center).toBeInstanceOf(GameInputCenterState)
            expect(state.shoulder).toBeInstanceOf(GameInputLRState)
            expect(state.trigger).toBeInstanceOf(GameInputLRState)
            expect(state.leftStick).toBeInstanceOf(GameInputDirectionsState)
            expect(state.rightStick).toBeInstanceOf(GameInputDirectionsState)
        })

        it('should create state with custom components', () => {
            const customDpad = new GameInputDirectionsState()
            const customFace = new GameInputFaceState()
            const state = new GameInputState(customDpad, customFace)
            expect(state.dpad).toBe(customDpad)
            expect(state.face).toBe(customFace)
        })
    })

    describe('variant', () => {
        it('should create a variant with overrides', () => {
            const state = new GameInputState()
            const newDpad = new GameInputDirectionsState()
            const variant = state.variant({ dpad: newDpad })

            expect(variant).toBeInstanceOf(GameInputState)
            expect(variant.dpad).toBe(newDpad)
            expect(variant).not.toBe(state) // Should be a new instance
        })

        it('should create variant with face overrides', () => {
            const state = new GameInputState()
            const newUpItem = new GameInputItemState({ name: 'newUp' })
            const variant = state.variant({}, { up: newUpItem })

            expect(variant.face.up).toBe(newUpItem)
            expect(variant.face).not.toBe(state.face) // Face should be new instance
        })

        it('should handle undefined overrides parameter', () => {
            const state = new GameInputState()
            const variant = state.variant(undefined)

            expect(variant).toBeInstanceOf(GameInputState)
            expect(variant).not.toBe(state)
        })

        it('should preserve other properties when creating variant', () => {
            const state = new GameInputState()
            const variant = state.variant({ dpad: new GameInputDirectionsState() })

            expect(variant.face).toBeInstanceOf(GameInputFaceState)
            expect(variant.center).toBeInstanceOf(GameInputCenterState)
            expect(variant.shoulder).toBeInstanceOf(GameInputLRState)
        })
    })
})
