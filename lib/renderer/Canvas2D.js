import * as types from "@lib/entities/types"
import Rect from "@lib/entities/Rect"
import config from "@config"
import { getHitbox } from "@utils/entity"
import { CNV_2D } from "./apis"
import { rectBounds } from "@lib/utils/entity"
import { aabb } from "@utils/math"

class Canvas2DRenderer {
    api = CNV_2D
    _scene = null
    dirtyRects = []
    constructor({ cnvQry, scene, viewport, background="#ffffff", isStatic = true }) {
        const canvas = document.querySelector(cnvQry)
        this.canvas = canvas
        this.scene = scene
        this.ctx = canvas.getContext("2d")

        this.changeBackground(background)
        this.resize(viewport)
        this.isStatic = isStatic // whether the viewport is static (and not panning)
        viewport.on("change", this.resize.bind(this))
    }
    set scene(val) {
        this._scene = val
    }
    get scene() {
        return this._scene
    }
    addDirtyRect(x, y, width, height) {
        this.dirtyRects.push({ x, y, width, height })
    }
    changeBackground(newBackground) {
        this.canvas.style.background = newBackground
    }
    resize({ width, height }) {
        this.canvas.setAttribute("width", width * config.devicePixelRatio)
        this.canvas.setAttribute("height", height * config.devicePixelRatio)
        this.canvas.style.width = `${width}px`
        this.canvas.style.height = `${height}px`
    }
    setTexatlas(img, meta) {
        this.img = img
        this.meta = meta
    }
    render(node) {
        this.ctx.translate(node.smooth ? node.pos.x: Math.round(node.pos.x), node.smooth ? node.pos.y: Math.round(node.pos.y))
        if (node.initialRotation) {
            this.ctx.rotate(node.initialRotation)
            this.ctx.translate(node.initialPivotX, 0)
        }
    
        node.anchor && this.ctx.translate(node.anchor.x, node.anchor.y)
        node.rotation && this.ctx.rotate(node.rotation)
        node.anchor && this.ctx.translate(-node.anchor.x, -node.anchor.y)
        node.pivot && this.ctx.translate(node.pivot.x, node.pivot.y)
        node.scale && this.ctx.scale(node.scale.x, node.scale.y)
        switch(node.type) {
            case types.texregion:
                const meta = this.meta[node.frame]
                this.ctx.drawImage(this.img, meta.x, meta.y, node.w, node.h, 0, 0, node.w, node.h)
            break
            case types.texture:
                this.ctx.drawImage(node.img, 0, 0)
            break
            case types.rect:
                if (node.fill) {
                    this.ctx.fillStyle = node.fill
                    this.ctx.fillRect(0, 0, node.width, node.height)
                }
                if (node.stroke) {
                    this.ctx.strokeStyle = node.stroke
                    this.ctx.lineWidth = node.strokeWidth
                    this.ctx.strokeRect(0, 0, node.width, node.height)
                }
        }
    }
    isDirty(node) {
        if (!node.width || !node.height) return true
        if (this.isStatic) {
            for (let i = this.dirtyRects.length; i > -1; i--) {
                const rect = this.dirtyRects[i]
                if (aabb(rect, rectBounds(node))) {
                    return true
                }
            }
            return false
        }
        return this.scene.intersects(node)
    }
    _renderRecursively(node) {
        if (!this.isDirty(node)) { return }

        this.ctx.save()
        if (node.alpha) {
            this.ctx.globalAlpha = node.alpha
        }
        if (node.blendMode) {
            this.ctx.globalCompositeOperation = node.blendMode
        }
        this.render(node)
        if (node.debug) {
            const hitbox = node.hitbox || getHitbox(node)
            this.ctx.save()
            this.render(new Rect({ pos: { ...hitbox }, ...hitbox, stroke: "red", strokeWidth: 1  }))
            this.ctx.restore()
        }
        if (node.children) {
            for (let i = 0, len = node.children.length; i < len; i++) {
                this.renderRecursively(node.children[i])
            }
        }
        this.ctx.restore()
    }
    renderRecursively() {
        if (this.isStatic) {
            for (let rect of this.dirtyRects) {
                this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
            }
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }

        this._renderRecursively(this.scene)
        this.dirtyRects.length = 0
    }
}

export default Canvas2DRenderer