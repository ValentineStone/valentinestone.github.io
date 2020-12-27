import { vscode_colors_random } from '../utils.js'

export default class Infusoria {
  constructor(x, y) {
    Object.assign(this, {
      x,
      y,
      color: vscode_colors_random(),
      lifeCycleLength: 30,
      lifeCycleCounter: Math.round(Math.random() * 30),
      spineCycleCounter: Math.round(Math.random() * 30),
      spineCount: 40,
      length: 50,
      width: 20,
      dy: (Math.random() > 0.5 ? -1 : 1) * (5 * Math.random() + 1),
      flapCount: 1,
      heartbeat: 1
    })
    this.halfLength = this.length / 2
    this.halfWidth = this.width / 2
    this.shadeColor = this.color// + '11'
    this.accentColor = this.color + '44'
  }
  render(ctx, d) {
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    //ctx.moveTo(0, -this.halfLength)
    //ctx.lineTo(0, this.halfLength)
    let lastLength = 0
    let lastOffset = 0
    for (let i = 0; i < this.spineCount; i++) {
      const offset = i * this.length / (this.spineCount - 1)
      let length = Math.abs(Math.sin(i * Math.PI / (this.spineCount - 1))) * this.halfWidth // smooth wave

      ctx.strokeStyle = this.accentColor
      ctx.beginPath()
      ctx.moveTo(-lastLength, -this.halfLength + lastOffset)
      ctx.lineTo(-length, -this.halfLength + offset)
      ctx.moveTo(lastLength, -this.halfLength + lastOffset)
      ctx.lineTo(length, -this.halfLength + offset)
      ctx.stroke()
      lastLength = length
      lastOffset = offset

      length *= Math.abs(Math.sin(this.flapCount * (i + this.spineCycleCounter) * Math.PI / this.spineCount)) * 0.9 + 0.1 // pulse

      length *= 0.7 // width

      ctx.strokeStyle = this.color
      ctx.beginPath()
      ctx.moveTo(-length, -this.halfLength + offset)
      ctx.lineTo(length, -this.halfLength + offset)
      ctx.stroke()
    }
  }
  update(world) {
    this.lifetime++
    this.spineCycleCounter = (this.spineCycleCounter + this.heartbeat * this.dy / 5) % this.spineCount
    this.lifeCycleCounter = (this.lifeCycleCounter + this.heartbeat * this.dy / 5) % this.lifeCycleLength
    this.puff = -Math.abs(this.lifeCycleCounter - (this.lifeCycleLength - 1) / 2) + (this.lifeCycleLength - 1) / 2
    this.y += this.dy// * ((this.lifeCycleLength-1) / 2 - this.puff)
    if (this.y + this.halfLength > world.canvas.height) {
      this.y = world.canvas.height - this.halfLength
      this.dy = -this.dy
    }
    if (this.y - this.halfLength < 0) {
      this.y = this.halfLength
      this.dy = -this.dy
    }
  }
}