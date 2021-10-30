class World extends Node {
    children = []
    constructor(locations) {
        const next = () => {
            if (locations.length === 0) { return }
            const NextLocationConstructor = locations.pop()
            const newLocation = NextLocationConstructor(next)
            this.children.forEach(child => child.remove()) // clear and destroy children
            this.add(newLocation) // add new child
        }
        next()
    }
}

export default World