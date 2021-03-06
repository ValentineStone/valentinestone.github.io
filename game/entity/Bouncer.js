import { vscode_colors_random, Rect } from '../utils.js'

export default class Bouncer extends Rect {
  constructor(x, y, w, h, dx, dy, color) {
    super(x, y, w, h, color)
    this.dx = dx
    this.dy = dy
  }
  update(world) {
    this.x += this.dx
    this.y += this.dy

    if (this.x < 0) {
      this.x = 0
      this.dx *= -1
    }
    if (this.y < 0) {
      this.y = 0
      this.dy *= -1
    }
    if (this.x + this.w > world.canvas.width) {
      this.x = world.canvas.width - this.w
      this.dx *= -1
    }
    if (this.y + this.h > world.canvas.height) {
      this.y = world.canvas.height - this.h
      this.dy *= -1
    }
    let foundSelf = false
    for (const entity of world.entities) {
      if (!foundSelf) {
        if (entity == this)
          foundSelf = true
        continue
      }
      else
        this.bounceOff(entity)
    }
  }
  bounceOff(other) {
    if (this.x < other.x + other.w &&
      this.x + this.w > other.x &&
      this.y < other.y + other.h &&
      this.y + this.h > other.y
    ) {
      if (Math.abs(this.x - other.x) > Math.abs(this.y - other.y))
        [this.dx, other.dx] = [other.dx, this.dx]
      else
        [this.dy, other.dy] = [other.dy, this.dy]
    }
  }
  randomize(world) {
    this.w = Math.random() * 10 + 10
    this.h = Math.random() * 10 + 10
    this.x = Math.random() * world.canvas.width
    this.y = Math.random() * world.canvas.height
    this.color = vscode_colors_random()
    this.dx = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? -1 : 1)
    this.dy = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? -1 : 1)
    return this
  }
}