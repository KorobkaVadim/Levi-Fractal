const getRandomIntInclusive = (min: number = 0, max: number = parseInt('FFFFFF', 16)) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const BASE_ANGLE = (45 * Math.PI) / 180
const COS_OF_BASE_ANGLE = Math.cos(BASE_ANGLE)
const SIN_OF_BASE_ANGLE = Math.sin(BASE_ANGLE)

const drowLevy = (context: CanvasRenderingContext2D, depth: number, x1: number, y1: number, x2: number, y2: number) => {
  if (depth == 0) {
    context.moveTo(x1, y1)
    context.strokeStyle = `#${getRandomIntInclusive().toString(16)}`
    context.lineTo(x2, y2)
  } else {
    const x3 = (x1 + x2) / 2 - (y2 - y1) / 2
    const y3 = (y1 + y2) / 2 + (x2 - x1) / 2
    drowLevy(context, depth - 1, x1, y1, x3, y3)
    drowLevy(context, depth - 1, x3, y3, x2, y2)
  }
}

const c_curve = (context: CanvasRenderingContext2D, depth: number, x0: number, y0: number, x1: number, y1: number) => {
  if (depth <= 0) {
    context.moveTo(x0, y0)
    context.strokeStyle = `#${getRandomIntInclusive().toString(16)}`
    context.lineTo(x1, y1)
    if (depth % 2 === 0) {
      context.stroke()
      context.beginPath()
    }
    return
  }

  const xx = COS_OF_BASE_ANGLE * ((x1 - x0) * COS_OF_BASE_ANGLE - (y1 - y0) * SIN_OF_BASE_ANGLE) + x0
  const yy = COS_OF_BASE_ANGLE * ((x1 - x0) * SIN_OF_BASE_ANGLE + (y1 - y0) * COS_OF_BASE_ANGLE) + y0
  setTimeout(() => {
    c_curve(context, depth - 1, x0, y0, xx, yy) //A1, A3
    c_curve(context, depth - 1, xx, yy, x1, y1) //A3, A2
  }, 100)
}

const draw = (depth: number) => {
  const canvas = <HTMLCanvasElement>document.getElementById('plot')
  const context = canvas.getContext('2d')
  canvas.width = 800
  canvas.height = 800
  context.beginPath()
  const selected = Array.from(document.querySelectorAll('input[name="curve"]')).find((i: any) => i.checked)
  console.log(selected)
  if (selected.getAttribute('id') === 'curve_line') {
    c_curve(context, depth, 400, 250, 400, 550)
  } else {
    drowLevy(context, depth, 600, 650, 200, 650)
  }
  context.stroke()
}

document.addEventListener('readystatechange', e => {
  if (document.readyState !== 'interactive') {
    return
  }
  const form = <HTMLFormElement>document.querySelector('#depth-form')
  const submitButton = form.querySelector('button')
  const input = <HTMLInputElement>document.querySelector('#depth')
  let isDrawing = false
  form.addEventListener('submit', e => {
    e.preventDefault()
    if (isDrawing) {
      return
    }

    const depth = +input.value
    if (isNaN(depth)) {
      alert('Depth should be a number!')
      return
    }
    submitButton.setAttribute('disabled', 'disabled')
    isDrawing = true
    draw(depth)
    submitButton.removeAttribute('disabled')
    isDrawing = false
  })
})
