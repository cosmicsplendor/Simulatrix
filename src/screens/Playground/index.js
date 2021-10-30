import { Node } from "@lib"
import World from "./World"

class Playground extends Node {
    background = "#000000"
    curLevel = 0
    constructor({ game, uiRoot }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
        const addDirtyRect = (...params) => {
            game.renderer.addDirtyRect(...params)
        }
        const world = new World(addDirtyRect)
        this.add(world)
    }
    onEnter() {

    }
}

export default Playground