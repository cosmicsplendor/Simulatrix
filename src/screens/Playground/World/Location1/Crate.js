import { TexRegion } from "@lib/entities"

const gravity = 2500
export default class Crate extends TexRegion {
    velY = 0
    constructor({ equilibriumY, ...rest }) {
        super({ frame: "crate", ...rest })
        this.equilibriumY = equilibriumY
        this.states = {
            "falling-down": new FallingDown(this, gravity),
            "floating": new Floating(this)
        }
        this.switchState = name => {
            this.state = this.states[name]
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
            this.crate.switchState("floating")
            this.crate.pos.y = equilibriumY
        }
    }
}

class Floating {
    constructor(crate) {
        this.crate = crate
    }
    update() {

    }
}