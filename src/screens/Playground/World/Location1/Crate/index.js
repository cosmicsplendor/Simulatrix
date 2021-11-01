import { TexRegion } from "@lib/entities"
import { easingFns } from "@lib/utils/math"

export default class Crate extends TexRegion {
    velY = 0
    constructor({ equilibriumY, surfaceY, bottomY, ...rest }) {
        super({ frame: "crate", ...rest })
        const states = {
            "falling-down": new FallingDown(this, surfaceY),
            "decelerating": new Decelerating(this, equilibriumY),
            "floating": new Floating(this),
            "sinking": new Sinking(this, bottomY)
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

class Decelerating {
    t = 0
    timeToTouchdown = 1.2
    initialY = null
    distToFall = null
    constructor(crate, equilibriumY) {
        this.crate = crate
        this.equilibriumY = equilibriumY
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
    timeout = 4
    meanY = null
    t = 0
    amp = 9
    period = Math.PI
    decayFactor = 0.9
    constructor(crate) {
        this.crate = crate
    }
    onEnter() {
        this.meanY = this.crate.pos.y
    }
    updateTimeout(dt) {
        this.timeout -= dt
        if (this.timeout < 0) {
            this.crate.switchState("sinking")
        }
    }
    update(dt) {
        this.t += dt

        this.updateTimeout(dt)

        if (this.t > this.period) {
            this.t = 0
            this.amp = this.amp * this.decayFactor // amplitude decays exponentially
        }
        this.crate.pos.y = this.meanY - this.amp * Math.sin(2 * this.t)
    }
}

class Sinking {
    t = 0
    timeToTouchdown = 2
    distToBottom = null
    sartingPosY = null
    constructor(crate, bottomY) {
        this.crate = crate
        this.maxY = bottomY - crate.h
    }
    onEnter() {
        this.startingPosY = this.crate.pos.y
        this.distToBottom = this.maxY - this.startingPosY
    }
    update(dt) {
        this.t += dt
        if (this.t >= this.timeToTouchdown) {
            return
        }
        this.crate.pos.y = this.startingPosY + this.distToBottom * easingFns.smoothStep(this.t / this. timeToTouchdown)
    }
}