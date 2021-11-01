import { easingFns } from "@lib/utils/math"

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

export default Sinking