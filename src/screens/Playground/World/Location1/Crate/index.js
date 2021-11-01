import { TexRegion } from "@lib/entities"

import FallingDown from "./states/FallingDown"
import Decelerating from "./States/Decelerating"
import Floating from "./states/Floating"
import Sinking from "./states/Sinking"

export default class Crate extends TexRegion {
    velY = 0
    constructor({ equilibriumY, surfaceY, bottomY, uiRoot, ...rest }) {
        super({ frame: "crate", ...rest })
        const states = {
            "falling-down": new FallingDown(this, surfaceY),
            "decelerating": new Decelerating(this, equilibriumY),
            "floating": new Floating(this),
            "sinking": new Sinking(this, bottomY, uiRoot)
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