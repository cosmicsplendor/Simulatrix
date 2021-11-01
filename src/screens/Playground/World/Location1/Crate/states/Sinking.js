import { easingFns } from "@lib/utils/math"

class Sinking {
    t = 0
    timeToTouchdown = 2
    distToBottom = null
    sartingPosY = null
    pushdownArrow = null
    constructor(crate, bottomY, { pushdownArrow }) {
        this.crate = crate
        this.maxY = bottomY - crate.h
        this.pushdownArrow = pushdownArrow
    }
    onEnter() {
        this.startingPosY = this.crate.pos.y
        this.distToBottom = this.maxY - this.startingPosY
        this.pushdownArrow.show()
    }
    update(dt) {
        this.t += dt
        if (this.t >= this.timeToTouchdown) {
            return
        }
        this.crate.pos.y = this.startingPosY + this.distToBottom * easingFns.linear(this.t / this. timeToTouchdown)
        this.pushdownArrow.anchor(this.crate.pos.x, this.crate.pos.y, this.crate.w, this.crate.h)
    }
}

export default Sinking