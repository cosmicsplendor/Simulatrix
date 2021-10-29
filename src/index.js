import "@lib/polyfills.js"
import Game from "@utils/Game"
import UI from "@utils/UI"
import createRenderer from "@lib/renderer/create"
import AssetsCache from "@utils/AssetsCache"
import TexRegion from "@lib/entities/TexRegion"

import config from "@config"
import * as screenNames from "@screens/names"
import MainMenuScreen from "@screens/MainMenu"
import LoadingScreen from "@screens/Loading"
import PlaygroundScreen from "@screens/Playground"

import soundSprite from "@assets/audio/sprite.mp3"
import soundMeta from "@assets/audio/sprite.cson"
import texatlasId from "@assets/images/texatlas.png"
import atlasmetaId from "@assets/images/atlasmeta.cson"
import bgDataId from "@assets/levels/background.cson"
import particlesId from "@assets/particles/all.cson"

const { viewport } = config
const renderer = createRenderer({ cnvQry: "#arena", scene: null, background: "#000000", viewport }) // scene will be injected by game
const assetsCache = new AssetsCache()
const uiRoot = UI.query("#ui-layer")
const assets = [
    { url: particlesId, msg: "loading particles" },
    { url: soundSprite, msg: "loading audio sprite" },
    { url: soundMeta, msg: "loading audio sprite metadata"},
    { url: texatlasId, msg: "loading images" },
    { url: atlasmetaId, msg: "loading texture atlas" },
]

if (!config.isMobile) {
    assets.push(bgDataId)
}

const screenFactories = {
    [screenNames.LOADING]: game => new LoadingScreen({ game, uiRoot, assets }),
    [screenNames.MAIN_MENU]: game => new MainMenuScreen({ game, uiRoot }),
    [screenNames.PLAYGROUND]: game => new PlaygroundScreen({ game, uiRoot }),
}
const game = new Game({
    renderer,
    assetsCache,
    screenFactories,
})

assetsCache.once("prog-end", () =>  { // listening to "progress-end" instead of "load" to ensure critical engine setup tasks happen before emission of load event
    const atlasmeta = assetsCache.get(atlasmetaId)
    renderer.setTexatlas(
        assetsCache.get(texatlasId),
        atlasmeta
    )
    TexRegion.injectAtlasmeta(atlasmeta)
})
game.switchScreen(screenNames.LOADING)
game.start()