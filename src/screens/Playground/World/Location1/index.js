import TiledLevel from "@lib/utils/TiledLevel"
import worldDataUrl from "./data.cson"
import Crate from "./Crate"
import Surface from "./Surface"

const factories = {
    "crate": (x, y, props) => {
        return new Crate({ pos: {x, y}, ...props })
    },
    "surface": (x, y, props) => {
        return new Surface({ pos: { x, y }, numEl: props.numEl })
    }
}

class Location1 extends TiledLevel {
    static dataUrl = worldDataUrl
    constructor({ data, next }) {
        super({ data, factories })
        this.next = next
    }
}

export default Location1