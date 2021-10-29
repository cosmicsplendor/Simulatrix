import { Node } from "@lib"
import config from "@config"
import { PLAYGROUND } from "@screens/names"
import initUI from "./initUI"

class MainMenuScreen extends Node {
    background = "#000000"
    constructor({ game, uiRoot }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
    }
    onEnter() {
        const { uiRoot, game } = this
        this.teardownUI = initUI({ uiRoot, onPlay: () => {
            game.switchScreen(PLAYGROUND, true)
        }})
    }
    onExit() {
        this.teardownUI()
        config.viewport.off("change", this.realign)
    }
}

export default MainMenuScreen