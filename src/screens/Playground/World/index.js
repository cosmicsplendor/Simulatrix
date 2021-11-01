import { Node } from "@lib"
import Location1 from "./Location1"
class World extends Node {
    children = []
    constructor({ assetsCache, uiRoot }) {
        super({ })
        const locations = [ Location1 ]
        const next = () => {
            if (locations.length === 0) { return }
            const NextLocationConstructor = locations.pop()
            const dataUrl = NextLocationConstructor.dataUrl
            assetsCache.load([ dataUrl ])
            assetsCache.once("load", () => {
                const data = assetsCache.get(dataUrl)
                const newLocation = new NextLocationConstructor({ data, uiRoot, next })
                this.children.forEach(child => child.remove()) // clear and destroy children
                this.add(newLocation) // add new child
                assetsCache.off("error")
            })
            assetsCache.once("error", console.log)
        }
        next()
    }
}

export default World