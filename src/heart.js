const heart = ({ originX, originY }) => ({
  originX,
  originY,
  angle: 2 * Math.PI * Math.random(),
  size: Math.floor(Math.random() * 41 + 10),
  saturation: Math.floor(100 - Math.random() * 40),
  hue: (Math.random() >= 0.5) ? 350 : 0,
  alpha: 0.5,
  fadeOutStep: Math.floor(Math.random() * 4 + 1) / 100,

  draw(ctx) {
    if (!ctx) {
      return
    }

    const step = Math.floor(this.size * 0.25)

    ctx.save()
    ctx.translate(this.originX, this.originY)

    ctx.lineWidth = 15
    ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 50%, ${this.alpha})`
    ctx.rotate(this.angle)


    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-step, -step)
    ctx.bezierCurveTo(-step, -step, -step * 2.25, -step * 2, -step * 2, -step * 3)
    ctx.arc(-step, -step * 3, step, Math.PI, 0, false)
    ctx.moveTo(0, 0)
    ctx.lineTo(step, -step)
    ctx.bezierCurveTo(step, -step, step * 2.25, -step * 2, step * 2, -step * 3)
    ctx.arc(step, -step * 3, step, 0, Math.PI, true)

    ctx.fill()
    ctx.restore()

    this.alpha -= this.fadeOutStep
  }
})

export default heart
