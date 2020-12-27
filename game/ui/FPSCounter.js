import { vscode_colors } from '../utils.js'

export default class FPSCounter {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.upsCounter = 0
    this.fpsCounter = 0
    this.fps = undefined
    this.ups = undefined
    this.upsInterval = setInterval(() => {
      this.ups = this.upsCounter
      this.upsCounter = 0
    }, 1000)
  }
  update() {
    const sinceLastUpdated = performance.now() - this.lastUpdated
    this.fps = Math.round(this.fpsCounter / sinceLastUpdated * 1000)
    this.fpsCounter = 0
    this.upsCounter++
    this.lastUpdated = performance.now()
  }
  render(ctx, delta) {
    this.fpsCounter++
    ctx.font = '20px monospace'
    ctx.fillStyle = vscode_colors[5]
    ctx.fillText('δ : ' + delta.toFixed(3), 5, 20)
    ctx.fillStyle = vscode_colors[10]
    ctx.fillText('θ : ' + this.fps, 5, 40)
    ctx.fillStyle = vscode_colors[7]
    ctx.fillText('μ : ' + this.ups, 5, 60)
    for (let i = 0; i < vscode_colors.length; i++) {
      ctx.fillStyle = vscode_colors[i]
      ctx.fillText('■ : ' + vscode_colors[i], 5, i * 20 + 100)
    }
  }

  despawn() {
    clearInterval(this.upsInterval)
  }
}