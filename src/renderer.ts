const getRandomIntInclusive = (min: number = 0, max: number = parseInt('FFFFFF', 16)) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const BASE_ANGLE = (45 * Math.PI) / 180
const COS_OF_BASE_ANGLE = Math.cos(BASE_ANGLE)
const SIN_OF_BASE_ANGLE = Math.sin(BASE_ANGLE)

const c_curve = (context: CanvasRenderingContext2D, depth: number, x0: number, y0: number, x1: number, y1: number) => {
  if (depth == 0) {
    context.moveTo(x0, y0)
    context.strokeStyle = `#${getRandomIntInclusive().toString(16)}`
    context.lineTo(x1, y1)
    if (depth % 2 === 0) {
      context.stroke()
      context.beginPath()
    }
  }

  const xx = COS_OF_BASE_ANGLE * ((x1 - x0) * COS_OF_BASE_ANGLE - (y1 - y0) * SIN_OF_BASE_ANGLE) + x0
  const yy = COS_OF_BASE_ANGLE * ((x1 - x0) * SIN_OF_BASE_ANGLE + (y1 - y0) * COS_OF_BASE_ANGLE) + y0
  setTimeout(() => {
    c_curve(context, depth - 1, x0, y0, xx, yy) //A1, A3
    c_curve(context, depth - 1, xx, yy, x1, y1) //A3, A2
  }, 100)
}

document.addEventListener('readystatechange', e => {
  if (document.readyState !== 'interactive') {
    return
  }

  var canvas = <HTMLCanvasElement>document.getElementById('plot')
  var context = canvas.getContext('2d')
  canvas.width = 800
  canvas.height = 800
  context.beginPath()
  c_curve(context, 17, 400, 250, 400, 550)
  context.stroke()
})
