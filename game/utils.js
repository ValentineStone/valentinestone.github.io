export class Rect {
  constructor(x, y, w, h, color) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color
  }
  render(ctx, d) {
    ctx.strokeStyle = this.color
    ctx.strokeRect(this.x + d * this.dx, this.y + d * this.dy, this.w, this.h)
  }
  update() { }
}

export const vscode_colors = [
  '#dcdcaa',
  '#4ec9b0',
  '#c586c0',
  '#9cdcfe',
  '#4fc1ff',
  '#ce9178',
  '#d16969',
  '#d7ba7d',
  '#569cd6',
  '#c8c8c8',
  '#b5cea8',
]
export const vscode_colors_random = () => {
  return vscode_colors[Math.floor(Math.random() * vscode_colors.length)]
}
export const hex_to_rgba = (color, a) => {
  const r = parseInt('0x' + color[1] + color[2])
  const g = parseInt('0x' + color[3] + color[4])
  const b = parseInt('0x' + color[5] + color[6])
  return `rgba(${r},${g},${b},${a})`
}