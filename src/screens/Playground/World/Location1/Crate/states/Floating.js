class Floating {
    timeout = Math.PI * 2.25
    meanY = null
    t = 0
    amp = 12
    period = Math.PI
    decayFactor = 0.8
    constructor(crate) {
        this.crate = crate
    }
    onEnter(t = 0) {
        this.meanY = this.crate.pos.y
        this.timeout = Math.PI * 2.25
        this.t = t
        this.amp = 12
    }
    update(dt) {
        this.t += dt
        this.timeout -= dt
        
        if (this.timeout < 0) {
            this.crate.switchState("sinking")
        }
        if (this.t > this.period) {
            this.t = 0
            this.amp = this.amp * this.decayFactor // amplitude decays exponentially
        }
        this.crate.pos.y = this.meanY - this.amp * Math.sin(2 * this.t)
    }
}

export default Floating