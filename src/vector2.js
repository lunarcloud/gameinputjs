export default class Vector2 {
    constructor (x, y) {
        this.x = (x === undefined) ? 0 : x
        this.y = (y === undefined) ? 0 : y
    }

    set (x, y) {
        this.x = x || 0
        this.y = y || 0
    }

    clone () {
        return new Vector2(this.x, this.y)
    }

    add (vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y)
    }

    subtract (vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y)
    }

    scale (scalar) {
        return new Vector2(this.x * scalar, this.y * scalar)
    }

    dot (vector) {
        return (this.x * vector.x + this.y + vector.y)
    }

    moveTowards (vector, t) {
        // Linearly interpolates between vectors A and B by t.
        // t = 0 returns A, t = 1 returns B
        t = Math.min(t, 1) // still allow negative t
        const diff = vector.subtract(this)
        return this.add(diff.scale(t))
    }

    magnitude () {
        return Math.sqrt(this.magnitudeSqr())
    }

    magnitudeSqr () {
        return (this.x * this.x + this.y * this.y)
    }

    distance (vector) {
        return Math.sqrt(this.distanceSqr(vector))
    }

    distanceSqr (vector) {
        const deltaX = this.x - vector.x
        const deltaY = this.y - vector.y
        return (deltaX * deltaX + deltaY * deltaY)
    }

    normalize () {
        const mag = this.magnitude()
        const vector = this.clone()
        if (Math.abs(mag) < 1e-9) {
            vector.x = 0
            vector.y = 0
        } else {
            vector.x /= mag
            vector.y /= mag
        }
        return vector
    }

    angle () {
        return Math.atan2(this.y, this.x)
    }

    rotate (alpha) {
        const cos = Math.cos(alpha)
        const sin = Math.sin(alpha)
        const vector = new Vector2()
        vector.x = this.x * cos - this.y * sin
        vector.y = this.x * sin + this.y * cos
        return vector
    }

    toPrecision (precision) {
        const vector = this.clone()
        vector.x = vector.x.toFixed(precision)
        vector.y = vector.y.toFixed(precision)
        return vector
    }

    toString () {
        const vector = this.toPrecision(1)
        return ('[' + vector.x + '; ' + vector.y + ']')
    }
}

export { Vector2 }
