import { Node } from "@lib"
import initUI from "./initUI"
import { MAIN_MENU } from "@screens/names"

class LoadingScreen extends Node {
    background = "#000000"
    constructor({ game, assets, uiRoot }) { 
        super()
        this.game = game
        this.uiRoot = uiRoot
        this.assets = assets
    }
    onEnter() {
        const { assetsCache } = this.game

        assetsCache.load(this.assets)

        assetsCache.once("load", () => {
            this.game.switchScreen(MAIN_MENU)
        })
    }
    onExit() {
        this.game.disposeScreen(this)
    }
}

export default LoadingScreen