import { easingFns } from "@lib/utils/math"

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

export default Decelerating
