import { calcAligned, calcStacked } from "@lib/utils/entity"
import config from "@config"
import levels from "@config/levels"
import imgBtn from "@screens/ui/imgBtn"
import loadingDot from "@screens/ui/loadingDot"
import styles from "./style.css"
import btn from "@screens/ui/btn"

const PREV = "prev-btn"
const NEXT = "next-btn"
const START = "start-btn"
const INFO = "lev-info"
const LOCK = "lock"
const LOADING = "loading"
const BEST_TIME = "best-time"
const ERROR = "err"
const RETRY = "retry"

const paddingX = config.isMobile ? 20: 60
const iconDims = Object.freeze({ width: 24, height: 24 })
const lock = `
<div id="${LOCK}" class="${styles.icon}">
    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffe6d5" width="${iconDims.width}" height="${iconDims.height}" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"/></svg>
</div>
`
const renderErr = (id, retryId, msg) => `
<div id="${id}" class="${styles.error} ${styles.hidden}">
    ${msg}
</div>
<div id="${retryId}" class="${styles.retry} ${styles.hidden}">
    RETRY
</div>
`
const renderBest = val => {
    return `Best Time: ${!!val ? val.toFixed(2) + "s": "n/a"}`
}
const render = (images, level, time) => {
    return `
        ${imgBtn(PREV, images.arrow, styles.prevBtn)}
        ${lock}
        <div class="${styles.infoTitle}" id="${INFO}">${"Level " + level}</div> 
        <div class="${styles.infoTitle} ${styles.infoSub}" id="${BEST_TIME}">${renderBest(time)}</div>
        ${imgBtn(NEXT, images.arrow)}
        ${btn(START, "START")}
    `
}

export default ({ onStart, uiRoot, storage, level, maxLevel, images, assetsCache, contSound, chSound, errSound }) => {
    let levelState = level
    uiRoot.content = render(images, level, storage.getHiscore(levelState))

    const prevBtn = uiRoot.get(`#${PREV}`)
    const nextBtn = uiRoot.get(`#${NEXT}`)
    const startBtn = uiRoot.get(`#${START}`)
    const levelInfo = uiRoot.get(`#${INFO}`)
    const lockInd = uiRoot.get(`#${LOCK}`)
    const bestTime = uiRoot.get(`#${BEST_TIME}`)

    const realignTxt = viewport => {
        const { width: tWidth, height: tHeight } = levelInfo.domNode.getBoundingClientRect()
        const { width: sWidth, height: sHeight } = bestTime.domNode.getBoundingClientRect()

        levelInfo.width = tWidth
        levelInfo.height = tHeight
        bestTime.width = sWidth
        bestTime.height = sHeight
        
        levelInfo.pos = calcAligned(viewport, levelInfo, "center", "center", 0, -10)
        bestTime.pos = calcStacked(levelInfo, bestTime, "bottom", 0, 8)
        lockInd.pos = calcStacked(bestTime, iconDims, "bottom", 0, 20)
    }
    const realign = viewport => {
        realignTxt(viewport)
        prevBtn.pos = calcAligned(viewport, prevBtn, "left", "center", paddingX)
        nextBtn.pos = calcAligned(viewport, nextBtn, "right", "center", -paddingX)
        startBtn.pos = calcStacked(bestTime, startBtn, "bottom", 0,  64)
    }
    const updateBtnVis = (level, maxLevel) => {
        lockInd.domNode.style.opacity = level <= maxLevel || level > levels.length ? 0: 1
        startBtn.domNode.style.opacity = level <= maxLevel ? 1: 0
    }
    const onPrevBtnClick = () => {
        if (levelState === 1) return errSound.play()
        levelState = Math.max(levelState - 1, 1)
        const best = storage.getHiscore(levelState)
        bestTime.content = renderBest(best)
        levelInfo.content = `Level ${levelState}`
        updateBtnVis(levelState, maxLevel)
        realignTxt(config.viewport)
        chSound.play()
    }
    const onNextBtnClick = () => {
        if (levelState > levels.length) return errSound.play()
        levelState = Math.min(levelState  + 1, levels.length + 1)
        const best = storage.getHiscore(levelState)
        levelInfo.content = levelState <= levels.length ? `Level ${levelState}`: "Coming Soon"
        bestTime.content = levelState <= levels.length ? renderBest(best): "new level every week"
        updateBtnVis(levelState, maxLevel)
        realignTxt(config.viewport)
        chSound.play()
    }
    const loadAndStart = () => {
        uiRoot.clear()
        const levelId = levels[levelState - 1].id
        if (!assetsCache.get(levelId)) { // if level data doesn't exist in the cache
            uiRoot.content = loadingDot(LOADING)

            const loadingInd = uiRoot.get(`#${LOADING}`)

            const onLoad = () => {
                onStart(levelState)
                assetsCache.off("error")
            }

            loadingInd.pos = calcAligned(config.viewport, loadingInd, "center", "center")

            levels.forEach(level => {
                assetsCache.unload(level.id)
            })

            assetsCache.load([ levelId ])

            assetsCache.once("load", onLoad)
            
            assetsCache.once("error", () => {
                assetsCache.off("load", onLoad)
                uiRoot.content = renderErr(ERROR, RETRY, "Connection Problem")
                const errMsg = uiRoot.get(`#${ERROR}`)
                const retryIcon = uiRoot.get(`#${RETRY}`)

                errMsg.pos = calcAligned(config.viewport, errMsg, "center", "center")
                retryIcon.pos = calcStacked(errMsg, retryIcon, "bottom", 0, 10)

                retryIcon.show()
                errMsg.show()

                retryIcon.on("click", loadAndStart)
            })
            return
        }
        onStart(levelState)
    }
    const onStartBtnClick = () => {
        if (levelState > maxLevel) { return  errSound.play() }
        config.viewport.off("change", realign)
        contSound.play()
        loadAndStart()
    }
    const onKeyDown = e => {
        const keyCode = e.which || e.keyCode
        if (!!keyCode) {
            switch(keyCode) {
                case 37: // left arrow
                case 65: // A
                    onPrevBtnClick()
                break
                case 39: // right arrow
                case 68: // D
                    onNextBtnClick()
                break
                case 32: // on one of enter and space the keys
                case 13:
                    onStartBtnClick()
                break
            }
            return
        }

        switch(e.key) {
            case "Left": // for IE and Older Versions of Edge
            case "ArrowLeft": // Standard
            case "A":
            case "a":
                onPrevBtnClick()
            break
            case "Right":
            case "ArrowRight":
            case "D":
            case "d":
                onNextBtnClick()
            break
            case " ":
            case "Enter":
                onStartBtnClick()
            break
        }
    }
    
    if (config.isMobile === false) document.addEventListener("keydown", onKeyDown)
    prevBtn.on("click", onPrevBtnClick)
    nextBtn.on("click", onNextBtnClick)
    startBtn.on("click", onStartBtnClick)
    config.viewport.on("change", realign)
    realign(config.viewport)
    return () => {
        if (config.isMobile === false) document.removeEventListener("keydown", onKeyDown)
        prevBtn.off("click", onPrevBtnClick)
        nextBtn.off("click", onNextBtnClick)
        startBtn.off("click", onStartBtnClick)
    }
}