import TiledLevel from "@lib/utils/TiledLevel"
import worldDataUrl from "./data/sequence1.cson"

class Location1 extends TiledLevel {
    static dataUrl = worldDataUrl
    constructor({ data, next }) {
        super({ data })
        this.next = next
    }
}

export default Location1