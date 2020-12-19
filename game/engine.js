const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const ups = 20

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

window.addEventListener('resize', resize)
resize()

const worlds = []

function render() {
  for (const world of worlds)
    world.render(ctx)
  requestAnimationFrame(render)
}

function update() {
  for (const world of worlds)
    world.update()
}

requestAnimationFrame(render)
setInterval(update, 1000 / ups)

const engine = { canvas, ups }
export default (World) => worlds.push(new World(engine))