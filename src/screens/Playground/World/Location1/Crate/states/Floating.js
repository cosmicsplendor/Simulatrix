class Floating {
    timeout = 4
    meanY = null
    t = 0
    amp = 9
    period = Math.PI
    decayFactor = 0.8
    constructor(crate) {
        this.crate = crate
    }
    onEnter() {
        this.meanY = this.crate.pos.y
    }
    updateTimeout(dt) {
        this.timeout -= dt
        if (this.timeout < 0) {
            this.crate.switchState("sinking")
        }
    }
    update(dt) {
        this.t += dt

        this.updateTimeout(dt)

        if (this.t > this.period) {
            this.t = 0
            this.amp = this.amp * this.decayFactor // amplitude decays exponentially
        }
        this.crate.pos.y = this.meanY - this.amp * Math.sin(2 * this.t)
    }
}

export default Floating