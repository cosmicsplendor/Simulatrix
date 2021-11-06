class Floating {
    meanY = null
    period = Math.PI
    decayFactor = 0.8
    constructor(crate) {
        this.crate = crate
    }
    onEnter(nextState, t = 0, timeout = Math.PI * 2.25, amp = 12) {
        if (!nextState) {
            throw new Error(`Floating state needs nextState to be passed`)
        }
        this.meanY = this.crate.pos.y
        this.timeout = timeout
        this.t = t
        this.amp = amp
        this.nextState = nextState
    }
    update(dt) {
        this.t += dt
        this.timeout -= dt
        
        if (this.timeout < 0) {
            this.crate.switchState(this.nextState)
            this.beenHereAlready = true
            return
        }
        if (this.t > this.period) {
            this.t = 0
            this.amp = this.amp * this.decayFactor // amplitude decays exponentially
        }
        this.crate.pos.y = this.meanY - this.amp * Math.sin(2 * this.t)
    }
}

export default Floating