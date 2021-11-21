import Timer from "@utils/Timer"

class Tugging {
    amp = 8
    constructor(crate, ui) {
        this.crate = crate
        this.ui = ui
    }
    anchorDownArrow() {
        this.ui.pushdownArrow.anchor(this.crate.pos.x, this.crate.pos.y, this.crate.w, this.crate.h, "bottom", 10)
    }
    anchorUpArrow() {
        this.ui.pushupArrow.anchor(this.crate.pos.x, this.crate.pos.y, this.crate.w, this.crate.h, "top", -90)
    }
    syncBounds() {
        this.ui.crateBounds.x = this.crate.pos.x
        this.ui.crateBounds.y = this.crate.pos.y

        this.ui.tyreBounds.x = this.crate.pos.x
        this.ui.tyreBounds.y = this.crate.pos.y - 80
    }
    onEnter() {
        this.meanPosY = this.crate.pos.y

        this.anchorUpArrow()
        this.ui.pushupArrow.show()

        this.anchorDownArrow()
        this.ui.pushdownArrow.show()

        const addTimer = Timer.attachedTo(this.crate)

        addTimer(
            8,
            f => {
                this.crate.pos.y = this.meanPosY - this.amp * Math.sin(3 * (f * 2 * Math.PI)) * (1 - f)
            },
            () => {
                this.ui.pushdownArrow.hide()
                this.ui.pushupArrow.hide()
                
                this.ui.waterBounds.pos = this.crate.pos
                this.ui.waterBounds.show()

                addTimer(
                    6,
                    f => {
                        this.ui.waterBounds.x = Math.min(this.crate.pos.x + 180 * 2 * f, this.crate.pos.x + 180)
                    },
                    () => {
                        this.ui.waterBounds.content = "60 L"
                        addTimer(
                            4,
                            null,
                            () => {
                                this.ui.waterBounds.content = "60 KG"
                                addTimer(
                                    3,
                                    null,
                                    () => {
                                        this.ui.crateBounds.show()
                                        this.ui.crateBounds.content = "10 KG"
                                        addTimer(
                                            3,
                                            null,
                                            () => {
                                                this.ui.tyreBounds.show()
                                                this.ui.tyreBounds.content = "50 KG"


                                                addTimer(
                                                    4,
                                                    null,
                                                    () => {
                                                        this.ui.tyreBounds.hide()
                                                        this.ui.crateBounds.hide()
                                                        this.ui.waterBounds.hide()
                                                        addTimer(
                                                            0.25,
                                                            f => {
                                                                const opacity = 1 - f
                                                                for (let child of this.crate.children) {
                                                                    child.alpha = opacity
                                                                }
                                                            },
                                                            () => {
                                                                for (let child of this.crate.children) {
                                                                    child.remove()
                                                                }
                                                            }
                                                        )
                                                    }
                                                )
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    },
                    0.25
                )
            }
        )
    }
    update(dt) {
        // this.rockingTimer.update(dt)
        this.anchorDownArrow()
        this.anchorUpArrow()
        this.syncBounds()
    }
}

export default Tugging