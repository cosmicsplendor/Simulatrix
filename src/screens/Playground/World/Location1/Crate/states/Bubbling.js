import { easingFns } from "@utils/math"

class Bubbling {
    t = 0
    timeToSurface = 2
    constructor(crate) {
        this.crate = crate
    }
    onEnter() {
        this.posY0 = this.crate.pos.y

        this.t = 0
    }
    update(dt) {
        this.t += dt
        if (this.t > this.timeToSurface) {
            return this.crate.switchState("floating")
        }
        this.crate.pos.y = this.posY0 - this.crate.h * easingFns.quadOut(this.t / this.timeToSurface)
    }
}

export default Bubbling