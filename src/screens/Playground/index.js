import { Node } from "@lib"
import World from "./World"

class Playground extends Node {
    background = "#000000"
    curLevel = 0
    constructor({ game, uiRoot }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
        const { assetsCache } = game
        const addDirtyRect = (...params) => {
            game.renderer.addDirtyRect(...params)
        }
        game.renderer.tint = [ 0.05, -0.025, -0.0125, 0 ]
    }
    onEnter() {
        const world = new World({ assetsCache: this.game.assetsCache })
        this.add(world)
    }
}

export default Playground