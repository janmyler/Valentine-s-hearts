const soundHeart = ({ originX, originY, size }) => ({
  originX,
  originY,
  size,
  draw(ctx, alpha = 1) {
    if (!ctx) {
      return
    }

    const step = Math.floor(this.size * 0.25)

    ctx.save()
    ctx.translate(this.originX, this.originY)

    ctx.lineWidth = 15
    ctx.strokeStyle = `hsla(0, 60%, 40%, ${alpha})`
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-step, -step)
    ctx.bezierCurveTo(-step, -step, -step * 2.25, -step * 2, -step * 2, -step * 3)
    ctx.arc(-step, -step * 3, step, Math.PI, 0, false)
    ctx.moveTo(0, 0)
    ctx.lineTo(step, -step)
    ctx.bezierCurveTo(step, -step, step * 2.25, -step * 2, step * 2, -step * 3)
    ctx.arc(step, -step * 3, step, 0, Math.PI, true)

    ctx.stroke()
    ctx.restore()
  }
})

export default soundHeart
