import imgBtn from "@screens/ui/imgBtn"
import { calcStacked } from "@utils/entity"

import styles from "./style.css"

const PUSHDOWN = "pushdown"
const PUSHUP = "pushup"

const createArrowWrapper = (arrowDomEl, pos, yOffset) => {
    return Object.freeze({
        show() {
            arrowDomEl.show()
        },
        hide() {
            arrowDomEl.hide()
        },
        anchor(x, y, width, height) {
            arrowDomEl.pos = calcStacked({ x, y, width, height }, arrowDomEl, pos, 0, yOffset)
        }
    })
}
const initUI = (uiRoot, images) => {
    uiRoot.content = `
        ${imgBtn(PUSHDOWN, images.arrowRed, styles.pushdownArrow)}
        ${imgBtn(PUSHUP, images.arrowGreen, styles.pushupArrow)}
    `
    const pushdownArrow = uiRoot.get(`#${PUSHDOWN}`)
    const pushupArrow = uiRoot.get(`#${PUSHUP}`)

    return {
        pushdownArrow: createArrowWrapper(pushdownArrow, "top", -10),
        pushupArrow: createArrowWrapper(pushupArrow, "bottom", 10),
        teardown: () => {
            uiRoot.clear()
        }
    }
}

export default initUI