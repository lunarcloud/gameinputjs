import { describe, it, expect } from '@jest/globals'
import { Vector2 } from './vector2.js'

describe('Vector2', () => {
    describe('constructor', () => {
        it('should create a vector with default values', () => {
            const vector = new Vector2()
            expect(vector.x).toBe(0)
            expect(vector.y).toBe(0)
        })

        it('should create a vector with specified values', () => {
            const vector = new Vector2(3, 4)
            expect(vector.x).toBe(3)
            expect(vector.y).toBe(4)
        })
    })

    describe('set', () => {
        it('should set the vector values', () => {
            const vector = new Vector2(1, 2)
            vector.set(5, 6)
            expect(vector.x).toBe(5)
            expect(vector.y).toBe(6)
        })

        it('should set to 0 when values are falsy', () => {
            const vector = new Vector2(1, 2)
            vector.set(0, 0)
            expect(vector.x).toBe(0)
            expect(vector.y).toBe(0)
        })
    })

    describe('clone', () => {
        it('should create an independent copy', () => {
            const original = new Vector2(3, 4)
            const clone = original.clone()
            expect(clone.x).toBe(3)
            expect(clone.y).toBe(4)
            
            clone.x = 10
            expect(original.x).toBe(3) // Original unchanged
        })
    })

    describe('add', () => {
        it('should add two vectors', () => {
            const v1 = new Vector2(1, 2)
            const v2 = new Vector2(3, 4)
            const result = v1.add(v2)
            expect(result.x).toBe(4)
            expect(result.y).toBe(6)
        })
    })

    describe('subtract', () => {
        it('should subtract two vectors', () => {
            const v1 = new Vector2(5, 7)
            const v2 = new Vector2(2, 3)
            const result = v1.subtract(v2)
            expect(result.x).toBe(3)
            expect(result.y).toBe(4)
        })
    })

    describe('scale', () => {
        it('should scale a vector by a scalar', () => {
            const vector = new Vector2(3, 4)
            const result = vector.scale(2)
            expect(result.x).toBe(6)
            expect(result.y).toBe(8)
        })

        it('should handle negative scaling', () => {
            const vector = new Vector2(3, 4)
            const result = vector.scale(-1)
            expect(result.x).toBe(-3)
            expect(result.y).toBe(-4)
        })
    })

    describe('dot', () => {
        it('should calculate dot product of two vectors', () => {
            const v1 = new Vector2(3, 4)
            const v2 = new Vector2(2, 5)
            const result = v1.dot(v2)
            // Expected: 3*2 + 4*5 = 6 + 20 = 26
            // Current buggy implementation: 3*2 + 4 + 5 = 6 + 9 = 15
            // This test will reveal the bug
            expect(result).toBe(26)
        })

        it('should handle zero vectors', () => {
            const v1 = new Vector2(0, 0)
            const v2 = new Vector2(5, 5)
            expect(v1.dot(v2)).toBe(0)
        })
    })

    describe('moveTowards', () => {
        it('should move from one vector towards another by amount t', () => {
            const start = new Vector2(0, 0)
            const end = new Vector2(10, 10)
            const result = start.moveTowards(end, 0.5)
            expect(result.x).toBe(5)
            expect(result.y).toBe(5)
        })

        it('should clamp t to maximum of 1', () => {
            const start = new Vector2(0, 0)
            const end = new Vector2(10, 10)
            const result = start.moveTowards(end, 2)
            expect(result.x).toBe(10)
            expect(result.y).toBe(10)
        })
    })

    describe('magnitude', () => {
        it('should calculate magnitude of vector', () => {
            const vector = new Vector2(3, 4)
            expect(vector.magnitude()).toBe(5) // 3-4-5 triangle
        })

        it('should return 0 for zero vector', () => {
            const vector = new Vector2(0, 0)
            expect(vector.magnitude()).toBe(0)
        })
    })

    describe('magnitudeSqr', () => {
        it('should calculate squared magnitude', () => {
            const vector = new Vector2(3, 4)
            expect(vector.magnitudeSqr()).toBe(25) // 3^2 + 4^2
        })
    })

    describe('distance', () => {
        it('should calculate distance between two vectors', () => {
            const v1 = new Vector2(0, 0)
            const v2 = new Vector2(3, 4)
            expect(v1.distance(v2)).toBe(5)
        })
    })

    describe('distanceSqr', () => {
        it('should calculate squared distance between two vectors', () => {
            const v1 = new Vector2(0, 0)
            const v2 = new Vector2(3, 4)
            expect(v1.distanceSqr(v2)).toBe(25)
        })
    })

    describe('normalize', () => {
        it('should normalize a vector to unit length', () => {
            const vector = new Vector2(3, 4)
            const normalized = vector.normalize()
            expect(normalized.magnitude()).toBeCloseTo(1, 5)
            expect(normalized.x).toBeCloseTo(0.6, 5)
            expect(normalized.y).toBeCloseTo(0.8, 5)
        })

        it('should handle zero vector', () => {
            const vector = new Vector2(0, 0)
            const normalized = vector.normalize()
            expect(normalized.x).toBe(0)
            expect(normalized.y).toBe(0)
        })
    })

    describe('angle', () => {
        it('should calculate angle of vector', () => {
            const vector = new Vector2(1, 0)
            expect(vector.angle()).toBe(0)
        })

        it('should calculate angle for diagonal vector', () => {
            const vector = new Vector2(1, 1)
            expect(vector.angle()).toBeCloseTo(Math.PI / 4, 5) // 45 degrees
        })
    })

    describe('rotate', () => {
        it('should rotate vector by 90 degrees', () => {
            const vector = new Vector2(1, 0)
            const rotated = vector.rotate(Math.PI / 2)
            expect(rotated.x).toBeCloseTo(0, 5)
            expect(rotated.y).toBeCloseTo(1, 5)
        })

        it('should rotate vector by 180 degrees', () => {
            const vector = new Vector2(1, 0)
            const rotated = vector.rotate(Math.PI)
            expect(rotated.x).toBeCloseTo(-1, 5)
            expect(rotated.y).toBeCloseTo(0, 5)
        })
    })

    describe('toPrecision', () => {
        it('should round vector components to specified precision', () => {
            const vector = new Vector2(1.23456, 7.89012)
            const precise = vector.toPrecision(2)
            expect(precise.x).toBe(1.23)
            expect(precise.y).toBe(7.89)
        })
    })

    describe('toString', () => {
        it('should convert vector to string representation', () => {
            const vector = new Vector2(3.456, 7.891)
            expect(vector.toString()).toBe('[3.5; 7.9]')
        })

        it('should handle integer values', () => {
            const vector = new Vector2(3, 4)
            expect(vector.toString()).toBe('[3; 4]')
        })
    })
})
