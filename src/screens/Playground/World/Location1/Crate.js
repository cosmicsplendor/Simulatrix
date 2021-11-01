import { TexRegion } from "@lib/entities"
import { easingFns } from "@lib/utils/math"

const gravity = 2500
export default class Crate extends TexRegion {
    velY = 0
    constructor({ equilibriumY, surfaceY, ...rest }) {
        super({ frame: "crate", ...rest })
        const states = {
            "falling-down": new FallingDown(this, gravity, surfaceY - this.h),
            "decelerating": new Decelerating(this, equilibriumY),
            "floating": new Floating(this)
        }
        this.switchState = (name, ...params) => {
            this.state = states[name]
            if (this.state.onEnter) {
                this.state.onEnter(...params)
            }
        }
        this.switchState("falling-down")
    }
    update(dt) {
        this.state.update(dt)
    }
}

class FallingDown {
    constructor(crate, gravity, maxY) {
        this.crate = crate
        this.gravity = gravity
        this.maxY = maxY
    }
    update(dt) {
        this.crate.velY += 0.5 * this.gravity * dt
        this.crate.pos.y += 0.5 * this.crate.velY * dt
        if (this.crate.pos.y > this.maxY) {
            this.crate.pos.y = this.maxY
            this.crate.switchState("decelerating")
        }
    }
}

class Decelerating {
    initialY = null
    distToFall = null
    constructor(crate, equilibriumY) {
        this.crate = crate
        this.equilibriumY = equilibriumY

        this.t = 0
        this.timeToTouchdown = 1.2
    }
    onEnter() {
        this.initialY = this.crate.pos.y
        this.distToFall = this.equilibriumY - this.initialY
    }
    update(dt) {
        this.t += dt
        if (this.t > this.timeToTouchdown) {
            this.crate.switchState("floating")
        }
        this.crate.pos.y = this.initialY + this.distToFall * easingFns.quadOut(this.t / this.timeToTouchdown)
    }
}

class Floating {
    meanY = null
    constructor(crate) {
        this.crate = crate

        this.period = Math.PI
        this.t = 0
        this.amp = 9
    }
    onEnter() {
        this.meanY = this.crate.pos.y
    }
    update(dt) {
        this.t += dt
        if (this.t > this.period) {
            this.t = 0
            this.amp = this.amp * 0.9 // amplitude decays exponentially
        }
        this.crate.pos.y = this.meanY - this.amp * Math.sin(2 * this.t)
    }
}