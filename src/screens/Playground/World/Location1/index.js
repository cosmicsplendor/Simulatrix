import TiledLevel from "@lib/utils/TiledLevel"
import worldDataUrl from "./data.cson"
import Crate from "./Crate"

const factories = {
    "crate": (x, y) => {
        return new Crate({ pos: {x, y } })
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