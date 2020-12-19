import { vscode_colors_random, hex_to_rgba } from '../utils.js'

export default class Infusoria {
  constructor(x, y) {
    Object.assign(this, {
      x,
      y,
      color: vscode_colors_random(),
      lifeCycleLength: 30,
      lifeCycleCounter: Math.round(Math.random() * 30),
      spineCycleCounter: Math.round(Math.random() * 30),
      spineCount: 10,
      length: 50,
      width: 20,
      dy: Math.random() > 0.5 ? -1 : 1,
      flapCount: 1,
      heartbeat: 1
    })
    this.halfLength = this.length / 2
    this.halfWidth = this.width / 2
    this.shadeColor = hex_to_rgba(this.color, 0.2)
    this.accentColor = hex_to_rgba(this.color, 0.5)
  }
  render(ctx, d) {
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    //ctx.moveTo(this.x, this.y - this.halfLength)
    //ctx.lineTo(this.x, this.y + this.halfLength)
    let lastLength = 0
    let lastOffset = 0
    for (let i = 0; i < this.spineCount; i++) {
      const offset = i * this.length / (this.spineCount - 1)
      let length = Math.abs(Math.sin(i * Math.PI / (this.spineCount - 1))) * this.halfWidth // smooth wave

      ctx.strokeStyle = this.accentColor
      ctx.beginPath()
      ctx.moveTo(this.x - lastLength, this.y - this.halfLength + lastOffset)
      ctx.lineTo(this.x - length, this.y - this.halfLength + offset)
      ctx.moveTo(this.x + lastLength, this.y - this.halfLength + lastOffset)
      ctx.lineTo(this.x + length, this.y - this.halfLength + offset)
      ctx.stroke()
      lastLength = length
      lastOffset = offset

      length *= Math.abs(Math.sin(this.flapCount * (i + this.spineCycleCounter) * Math.PI / this.spineCount)) * 0.9 + 0.1 // pulse

      length *= 0.7 // width

      ctx.strokeStyle = this.color
      ctx.beginPath()
      ctx.moveTo(this.x - length, this.y - this.halfLength + offset)
      ctx.lineTo(this.x + length, this.y - this.halfLength + offset)
      ctx.stroke()
    }
  }
  update(game) {
    this.lifetime++
    this.spineCycleCounter = (this.spineCycleCounter + this.heartbeat * this.dy) % this.spineCount
    this.lifeCycleCounter = (this.lifeCycleCounter + this.heartbeat * this.dy) % this.lifeCycleLength
    this.puff = -Math.abs(this.lifeCycleCounter - (this.lifeCycleLength - 1) / 2) + (this.lifeCycleLength - 1) / 2
    this.y += this.dy// * ((this.lifeCycleLength-1) / 2 - this.puff)
    if (this.y + this.halfLength > game.canvas.height) {
      this.y = game.canvas.height - this.halfLength
      this.dy = -this.dy
    }
    if (this.y - this.halfLength < 0) {
      this.y = this.halfLength
      this.dy = -this.dy
    }
  }
}