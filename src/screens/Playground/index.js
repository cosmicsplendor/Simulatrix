import { Node } from "@lib"
import { GAME } from "@screens/names"
import resumeImgId from "@assets/images/ui/resume.png"
import arrowImgId from "@assets/images/ui/arrow.png"
import SoundSprite from "@utils/Sound/SoundSprite"
import soundSpriteId from "@assets/audio/sprite.mp3"
import soundMetaId from "@assets/audio/sprite.cson"
import levels from "@config/levels"

import initUI from "./initUI"

class Playground extends Node {
    background = "#000000"
    curLevel = 0
    constructor({ game, uiRoot, storage }) {
        super()
        this.game = game
        this.uiRoot = uiRoot
    }
    onEnter() { // second level tells whether to advance to the next level (relative to the current one)

    }
}

export default Playground