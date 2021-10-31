import { TexRegion } from "@lib/entities"

export default class Crate extends TexRegion {
    constructor({ equilibriumY, ...rest }) {
        super({ frame: "crate", ...rest })
        this.equilibriumY = equilibriumY
    }
}