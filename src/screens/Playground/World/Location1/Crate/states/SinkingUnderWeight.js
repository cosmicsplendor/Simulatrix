import { TexRegion } from "@lib"
import { easingFns } from "@utils/math"
import Timer from "@utils/Timer"

class SinkingUnderWeight {
    MAX_TYRES = 2
    tyresToStack = 2
    duration = 1
    constructor(crate, surfaceY, equilbriumY) {
        this.crate = crate
        this.surfaceY = surfaceY
        this.equilbriumY = equilbriumY

        this.sinkStep = surfaceY - equilbriumY - 8
    }
    stackTyre() {
        this.tyresToStack--
        const tyre = new TexRegion({ frame: "tyre" })
        tyre.pos.y = -tyre.h * (this.MAX_TYRES - this.tyresToStack)
        this.crate.add(tyre)
    }
    onEnter() {
        this.stackTyre()
        const sunkFrom = this.crate.pos.y
        this.timer = new Timer(
            this.duration,
            f => {
                this.crate.pos.y = sunkFrom + this.sinkStep * easingFns.smoothStep(f)
            },
            () => {
                if (this.tyresToStack < 1) return
                this.crate.switchState("sinking-under-weight")
            }
        )
    }
    update(dt) {
        this.timer.update(dt)
    }
}

export default SinkingUnderWeight