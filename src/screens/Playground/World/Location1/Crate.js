import { TexRegion } from "@lib/entities"

const gravity = 2500
export default class Crate extends TexRegion {
    velY = 0
    constructor({ equilibriumY, ...rest }) {
        super({ frame: "crate", ...rest })
        this.equilibriumY = equilibriumY
        const states = {
            "falling-down": new FallingDown(this, gravity),
            "floating": new Floating(this, equilibriumY)
        }
        this.switchState = name => {
            this.state = states[name]
        }
        this.switchState("falling-down")
    }
    update(dt) {
        this.state.update(dt)
    }
}

class FallingDown {
    constructor(crate, gravity) {
        this.crate = crate
        this.gravity = gravity
    }
    update(dt) {
        const { equilibriumY } = this.crate
        this.crate.velY += 0.5 * this.gravity * dt
        this.crate.pos.y += 0.5 * this.crate.velY * dt
        if (this.crate.pos.y > equilibriumY) {
            this.crate.pos.y = equilibriumY
            this.crate.switchState("floating")
        }
    }
}

class Floating {
    constructor(crate, equilibriumY) {
        this.crate = crate

        this.meanY = equilibriumY
        this.period = Math.PI
        this.t = 0
        this.amp = 4
    }
    update(dt) {
        this.t += dt
        if (this.t > this.period) {
            this.t = 0
            this.amp = this.amp - 0 // amplitude decays exponentially
        }
        this.crate.pos.y = this.meanY + this.amp * Math.sin(2 * this.t)
    }
}