import { easingFns } from "@utils/math"

class Bubbling {
    t = 0
    timeToSurface = 2
    constructor(crate, pushupArrow) {
        this.crate = crate
        this.pushupArrow = pushupArrow
    }
    onEnter() {
        this.posY0 = this.crate.pos.y
        this.pushupArrow.show()
        this.t = 0
    }
    update(dt) {
        this.t += dt
        if (this.t > this.timeToSurface) {
            this.pushupArrow.hide()
            return this.crate.switchState("floating", Math.PI / 2)
        }
        this.crate.pos.y = this.posY0 - this.crate.h * easingFns.quadOut(this.t / this.timeToSurface)
        this.pushupArrow.anchor(this.crate.pos.x, this.crate.pos.y, this.crate.w, this.crate.h)
    }
}

export default Bubbling