import imgBtn from "@screens/ui/imgBtn"
import { calcStacked } from "@utils/entity"

import styles from "./style.css"

const PUSHDOWN = "pushdown"
const initUI = (uiRoot, images) => {
    uiRoot.content = imgBtn(PUSHDOWN, images.arrowRed, styles.pushdownArrow)
    const pushdownArrow = uiRoot.get(`#${PUSHDOWN}`)

    return {
        pushdownArrow: Object.freeze({
            show() {
                pushdownArrow.show()
            },
            hide() {
                pushdownArrow.hide()
            },
            anchor(x, y, width, height) {
                pushdownArrow.pos = calcStacked({ x, y, width, height }, pushdownArrow, "top", 0, -10)
            }
        }),
        teardown: () => {
            uiRoot.clear()
        }
    }
}

export default initUI