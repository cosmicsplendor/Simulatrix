import { TexRegion } from "@lib"
import { easingFns } from "@utils/math"
import Timer from "@utils/Timer"

class SinkingUnderWeight {
    MAX_TYRES = 2
    tyresToStack = 2
    duration = 2
    constructor(crate, surfaceY, equilbriumY) {
        this.crate = crate
        this.surfaceY = surfaceY
        this.equilbriumY = equilbriumY

        this.sinkStep = (surfaceY - equilbriumY) * 0.5
    }
    stackTyre() {
        this.tyresToStack--
        const tyre = new TexRegion({ frame: "tyre" })
        tyre.pos.y = -tyre.h * (this.MAX_TYRES - this.tyresToStack)
        this.crate.add(tyre)
        tyre.alpha = 0
        Timer.attachedTo(tyre)(0.5, f => tyre.alpha = f)
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
                if (this.tyresToStack < 1) {
                    return this.crate.switchState("tugging")
                }
                this.crate.switchState("sinking-under-weight")
            },
            0.25
        )
    }
    update(dt) {
        this.timer.update(dt)
    }
}

export default SinkingUnderWeight