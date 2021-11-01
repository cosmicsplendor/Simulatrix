class FallingDown {
    gravity = 2500
    constructor(crate, surfaceY) {
        this.crate = crate
        this.maxY = surfaceY - crate.h
    }
    update(dt) {
        this.crate.velY += 0.5 * this.gravity * dt
        this.crate.pos.y += 0.5 * this.crate.velY * dt
        if (this.crate.pos.y > this.maxY) {
            this.crate.velY = 0
            this.crate.pos.y = this.maxY
            this.crate.switchState("decelerating")
        }
    }
}

export default FallingDown