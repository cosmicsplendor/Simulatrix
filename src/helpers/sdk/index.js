class SDK {
    constructor(strategy) {
        this.strat = strategy
    }
    adSupported() {
        if (!this.strat) return
        return this.strat.ads
    }
    setLoadProg(val) {
        if (!this.strat) return
        this.strat.setLoadProg(val)
    }
    signalLoad() {
        if (!this.strat) return Promise.resolve()
        return this.strat.signalLoad()
    }
    playRva() {
        if (!this.strat) return Promise.reject()
        return this.strat.playRva()
    }
    playIntstAd() {
        if (!this.strat) return Promise.reject()
        return this.strat.playIntstAd()
    }
    setOnPause(fn) {
        if (!this.strat) return
        this.strat.setOnPause(fn)
    }
    setOnResume(fn) {
        if (!this.strat) return
        this.strat.setOnResume(fn)
    }
}

export default SDK