import { TexRegion } from "@lib/entities"

import arrowGreenId from "@assets/images/ui/arrow_green.png"
import arrowRedId from "@assets/images/ui/arrow_red.png"
import arrowBlueId from "@assets/images/ui/arrow_blue.png"

import FallingDown from "./states/FallingDown"
import Decelerating from "./States/Decelerating"
import Floating from "./states/Floating"
import Sinking from "./states/Sinking"
import Bubbling from "./states/Bubbling"
import SinkingUnderWeight from "./states/SinkingUnderWeight"
import Tugging from "./states/Tugging"
import initUI from "./initUI"

export default class Crate extends TexRegion {
    velY = 0
    constructor({ equilibriumY, surfaceY, uiRoot, assetsCache, ...rest }) {
        super({ frame: "crate", ...rest })
        const uiImages = {
            arrowGreen: assetsCache.get(arrowGreenId),
            arrowRed: assetsCache.get(arrowRedId),
            arrowBlue: assetsCache.get(arrowBlueId),
        }
        const ui = initUI(uiRoot, uiImages)
        const states = {
            "falling-down": new FallingDown(this, surfaceY),
            "decelerating": new Decelerating(this, equilibriumY),
            "floating": new Floating(this),
            "sinking": new Sinking(this, equilibriumY, ui.pushdownArrow),
            "bubbling": new Bubbling(this, ui.pushupArrow),
            "sinking-under-weight": new SinkingUnderWeight(this, surfaceY, equilibriumY),
            "tugging": new Tugging(this)
        }
        this.switchState = (name, ...params) => {
            this.state = states[name]
            if (this.state.onEnter) {
                this.state.onEnter(...params)
            }
        }
        this.switchState("falling-down")
    }
    update(dt) {
        this.state.update(dt)
    }
}