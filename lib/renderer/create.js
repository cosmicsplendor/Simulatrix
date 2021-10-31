import Canvas2dRenderer from "./Canvas2D"
import Webgl2Renderer from "./Webgl2"

export default params => {
    return new Webgl2Renderer(params)
}