const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const ups = 20
let lastUpdated = 0
let delta = 0
let paused = false
const worlds = []

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

window.addEventListener('resize', resize)
resize()

function render() {
  delta = (performance.now() - lastUpdated) / (1000 / ups)
  for (const world of worlds)
    world.render(ctx, delta)
  requestAnimationFrame(render)
}

function update() {
  lastUpdated = performance.now()
  for (const world of worlds)
    world.update()
}

setInterval(update, 1000 / ups)
requestAnimationFrame(render)

window.addEventListener('keydown', event => {
  switch (event.code) {
    case "Space": {
      paused = !paused
      break
    }
  }
})

const engine = { canvas, ups }
export default (World) => worlds.push(new World(engine))

export class World {
  constructor(engine) {
    this.canvas = engine.canvas
    this.entities = []
    this.spawn()
  }
  update() {
    for (const entity of this.entities)
      entity.update(this)
  }
  render(ctx, delta) {
    ctx.fillStyle = this.background
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    for (const ent of this.entities) {
      if ('x' in ent) {
        ctx.save()
        ctx.translate(ent.x, ent.y)
        ent.render(ctx, delta)
        ctx.restore()
      }
      else {
        ent.render(ctx, delta)
      }
    }
  }
  spawn() { }
  despawn() { }
}