import { easingFns } from "@lib/utils/math"

class Sinking {
    t = 0
    timeToTouchdown = 2
    timeout = 6
    distToBottom = null
    sartingPosY = null
    pushdownArrow = null
    constructor(crate, equilibriumY, pushdownArrow) {
        this.crate = crate
        this.maxY = equilibriumY + crate.h
        this.pushdownArrow = pushdownArrow
    }
    onEnter() {
        this.startingPosY = this.crate.pos.y
        this.distToBottom = this.maxY - this.startingPosY
        this.pushdownArrow.show()

        this.t = 0
        this.timeout = 4
    }
    update(dt) {
        this.t += dt
        this.timeout -= dt
        if (this.timeout < 0) {
            this.crate.switchState("bubbling")
            this.pushdownArrow.hide()
            return
        }
        if (this.t >= this.timeToTouchdown) {
            return
        }
        this.crate.pos.y = this.startingPosY + this.distToBottom * easingFns.sin(this.t / this. timeToTouchdown)
        this.pushdownArrow.anchor(this.crate.pos.x, this.crate.pos.y, this.crate.w, this.crate.h, "top", -10)
    }
}

export default Sinking