class Floating {
    timeout = 4
    meanY = null
    t = 0
    amp = 12
    period = Math.PI
    decayFactor = 0.8
    constructor(crate) {
        this.crate = crate
    }
    onEnter() {
        this.meanY = this.crate.pos.y
        this.timeout = 4
        this.t = 0
        this.amp = 12
    }
    update(dt) {
        this.t += dt
        this.timeout -= dt

        if (this.t > this.period) {
            this.t = 0
            this.amp = this.amp * this.decayFactor // amplitude decays exponentially
            if (this.timeout < 0) {
                this.crate.switchState("sinking")
            }
        }
        this.crate.pos.y = this.meanY - this.amp * Math.sin(2 * this.t)
    }
}

export default Floating