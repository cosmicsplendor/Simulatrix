import Timer from "@utils/Timer"

class Tugging {
    amp = 8
    constructor(crate) {
        this.crate = crate
        this.stages = {

        }
    }
    onEnter() {
        this.meanPosY = this.crate.pos.y
        const rockingTimer = new Timer(
            1.5,
            f => {
                this.crate.pos.y = this.meanPosY - this.amp * Math.sin(f * 2 * Math.PI)
            },
            () => {
                this.amp *= 0.9
                rockingTimer.reset()
            }
        )
        this.rockingTimer = rockingTimer
    }
    update(dt) {
        this.rockingTimer.update(dt)
    }
}

export default Tugging