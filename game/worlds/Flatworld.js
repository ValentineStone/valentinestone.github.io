import Bouncer from '../entity/Bouncer.js'
import Infusoria from '../entity/Infusoria.js'
import { vscode_colors } from '../utils.js'

export default class Flatworld {
  constructor(engine) {
    this.canvas = engine.canvas
    this.entities = []
    this.upsTarget = engine.ups
    this.upsCounter = 0
    this.fpsCounter = 0
    this.fps = '-'
    this.ups = this.upsTarget

    setInterval(() => {
      this.ups = this.upsCounter
      this.upsCounter = 0
    }, 1000)

    this.background = '#0c0c0c'

    for (let i = 0; i < 20; i++)
      this.entities.push(new Bouncer().randomize(this))
    for (let i = 0; i < 20; i++)
      this.entities.push(new Infusoria(i * (this.canvas.width / 21) + this.canvas.width / 21, Math.floor(Math.random() * this.canvas.height)))
  }
  update() {
    const sinceLastUpdated = performance.now() - this.lastUpdated
    this.fps = Math.round(this.fpsCounter / sinceLastUpdated * 1000)
    this.fpsCounter = 0
    this.upsCounter++
    this.lastUpdated = performance.now()
    for (let entity of this.entities)
      entity.update(this)
  }
  render(ctx) {
    this.fpsCounter++
    this.delta = (performance.now() - this.lastUpdated) / (1000 / this.upsTarget)
    ctx.fillStyle = this.background
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    for (let entity of this.entities)
      entity.render(ctx, this.delta)
    ctx.font = '20px monospace'
    ctx.fillStyle = vscode_colors[5]
    ctx.fillText('δ : ' + String(this.delta).slice(0, 5), 5, 20)
    ctx.fillStyle = vscode_colors[10]
    ctx.fillText('θ : ' + this.fps, 5, 40)
    ctx.fillStyle = vscode_colors[7]
    ctx.fillText('μ : ' + this.ups, 5, 60)

    for (let i = 0; i < vscode_colors.length; i++) {
      ctx.fillStyle = vscode_colors[i]
      ctx.fillText('■ : ' + vscode_colors[i], 5, i * 20 + 100)
    }

  }
}