import imgBtn from "@screens/ui/imgBtn"
import { calcStacked } from "@utils/entity"

import styles from "./style.css"

const PUSHDOWN = "pushdown"
const PUSHUP = "pushup"
const WATER = "water"
const CRATE = "crate"
const TYRE = "tyre"

const createArrowWrapper = arrowDomEl => {
    return Object.freeze({
        show() {
            arrowDomEl.show()
        },
        hide() {
            arrowDomEl.hide()
        },
        anchor(x, y, width, height, side, yOffset) {
            arrowDomEl.pos = calcStacked({ x, y, width, height }, arrowDomEl, side, 0, yOffset)
        },
    })
}
const boundingBox = (id, width, height, color, style="") => {
    return `
        <div
            id = "${id}"
            class = "${styles.boundingBox}"
            style = "width: ${width}px; height: ${height}px; background: ${color}; color: whitesmoke;${style}"
        >
        </div>
    `
}
const initUI = (uiRoot, images) => {
    uiRoot.content = `
        ${imgBtn(PUSHDOWN, images.arrowRed, styles.pushdownArrow)}
        ${imgBtn(PUSHUP, images.arrowGreen, styles.pushupArrow)}
        ${boundingBox(WATER, 136, 136, "rgb(255 255 255 / 5%)")}
        ${boundingBox(CRATE, 136,136, "rgba(179, 77, 77, 0.2)")}
        ${boundingBox(TYRE, 136, 80, "rgba(0, 0, 0, 0.2)", "border-bottom:none;")}
    `
    const crateBounds = uiRoot.get(`#${CRATE}`)
    const tyreBounds = uiRoot.get(`#${TYRE}`)
    const waterBounds = uiRoot.get(`#${WATER}`)
    const pushdownArrow = uiRoot.get(`#${PUSHDOWN}`)
    const pushupArrow = uiRoot.get(`#${PUSHUP}`)

    return {
        pushdownArrow: createArrowWrapper(pushdownArrow),
        pushupArrow: createArrowWrapper(pushupArrow),
        crateBounds,
        tyreBounds,
        waterBounds,
        teardown: () => {
            uiRoot.clear()
        }
    }
}

export default initUI