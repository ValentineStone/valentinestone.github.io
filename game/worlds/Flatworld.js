import { World } from '../engine.js'
import Bouncer from '../entity/Bouncer.js'
import Infusoria from '../entity/Infusoria.js'
import FPSCounter from '../ui/FPSCounter.js'

export default class Flatworld extends World {
  spawn() {
    this.background = '#0c0c0c'
    this.entities.push(new FPSCounter(0, 0))
    for (let i = 0; i < 20; i++)
      this.entities.push(new Bouncer().randomize(this))
    for (let i = 0; i < 20; i++)
      this.entities.push(new Infusoria(i * (this.canvas.width / 21) + this.canvas.width / 21, Math.floor(Math.random() * this.canvas.height)))
  }
}