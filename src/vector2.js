/**
 * 2D Vector.
 */
class Vector2 {
    /**
     * Constructor.
     * @param {number} x x value
     * @param {number} y y value
     */
    constructor (x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    /**
     * Set the value.
     * @param {number} x x value
     * @param {number} y y value
     */
    set (x, y) {
        this.x = x || 0
        this.y = y || 0
    }

    /**
     * Create a clone.
     * @returns {Vector2} a clone
     */
    clone () {
        return new Vector2(this.x, this.y)
    }

    /**
     * Add a vector.
     * @param {Vector2} vector other vector
     * @returns {Vector2} combined vector
     */
    add (vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y)
    }

    /**
     * Subtract a vector.
     * @param {Vector2} vector other vector
     * @returns {Vector2} resulting vector
     */
    subtract (vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y)
    }

    /**
     * Scale the vector.
     * @param {number} scalar scalar factor
     * @returns {Vector2} resulting vector
     */
    scale (scalar) {
        return new Vector2(this.x * scalar, this.y * scalar)
    }

    /**
     * Dot product of the two vectors.
     * @param {Vector2} vector other vector
     * @returns {number} resulting vector
     */
    dot (vector) {
        return (this.x * vector.x + this.y + vector.y)
    }

    /**
     * Linearly interpolates between vectors A and B by t
     * @param {Vector2} vector other vector
     * @param {number} t normalized amount (t = 0 returns A, t = 1 returns B)
     * @returns {Vector2} result
     */
    moveTowards (vector, t) {
        t = Math.min(t, 1) // still allow negative t
        const diff = vector.subtract(this)
        return this.add(diff.scale(t))
    }

    /**
     * Get the magnitude of the vector.
     * @returns {number}    magnitude.
     */
    magnitude () {
        return Math.sqrt(this.magnitudeSqr())
    }

    /**
     * Get the magnitude square of the vector.
     * @returns {number}    magnitude square
     */
    magnitudeSqr () {
        return (this.x * this.x + this.y * this.y)
    }

    /**
     * Get distance to another vector.
     * @param {Vector2} vector  the other vector
     * @returns {number}    distance
     */
    distance (vector) {
        return Math.sqrt(this.distanceSqr(vector))
    }

    /**
     * Get distance square to another vector.
     * @param {Vector2} vector  the other vector
     * @returns {number}    distance square
     */
    distanceSqr (vector) {
        const deltaX = this.x - vector.x
        const deltaY = this.y - vector.y
        return (deltaX * deltaX + deltaY * deltaY)
    }

    /**
     * Get normalized.
     * @returns {Vector2}   normalized vector
     */
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

    /**
     * Get the angle of the vector.
     * @returns {number}    angle (in radians)
     */
    angle () {
        return Math.atan2(this.y, this.x)
    }

    /**
     * Rotate the vector.
     * @param {number} alpha amount to rotatae
     * @returns {Vector2}   rotated vector.
     */
    rotate (alpha) {
        const cos = Math.cos(alpha)
        const sin = Math.sin(alpha)
        const vector = new Vector2()
        vector.x = this.x * cos - this.y * sin
        vector.y = this.x * sin + this.y * cos
        return vector
    }

    /**
     * Get a version of the vector with a particular precision.
     * @param {number} precision precision amount
     * @returns {Vector2}   adjusted vector.
     */
    toPrecision (precision) {
        const vector = this.clone()
        vector.x = parseFloat(vector.x.toFixed(precision))
        vector.y = parseFloat(vector.y.toFixed(precision))
        return vector
    }

    /**
     * Get the vector as a string.
     * @returns {string}    text representation.
     */
    toString () {
        const vector = this.toPrecision(1)
        return ('[' + vector.x + '; ' + vector.y + ']')
    }
}

export { Vector2 }
