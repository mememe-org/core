const { loadImage } = require('canvas')
const { LATEST_VERSION } = require('./defaults')
const { uppercase } = require('../transformers/text')
const { hyperify } = require('../transformers/image')

const renderTextElement = (element, canvas) => {
  return new Promise(resolve => {
    const { text, font, textAlign, textBaseline, direction, color, stroke, transform, position } = element
    const ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.textAlign = textAlign
    ctx.textBaseline = textBaseline
    ctx.direction = direction
    ctx.fillStyle = color

    const transformedText = transform.reduce((prev, method) => {
      if (method === 'uppercase') {
        return uppercase(prev)
      }
      return prev
    }, text)

    ctx.fillText(transformedText, position.x, position.y)

    if (stroke !== undefined) {
      ctx.lineWidth = stroke.width
      ctx.strokeStyle = stroke.color
      ctx.strokeText(transformedText, position.x, position.y)
    }
    resolve()
  })
}

const renderImageElement = (element, canvas) => {
  const { image, transform, position } = element
  const ctx = canvas.getContext('2d')
  return loadImage(image)
    .then(data => transform
      .reduce((prev, method) => {
        if (method === 'hyperify') {
          return prev.then((result) => hyperify(result))
        }
      }, Promise.resolve(data))
    )
    .then(transformedImage => {
      ctx.drawImage(transformedImage, position.x, position.y)
    })
}

const render = (spec, canvas) => {
  const { version, size, ...elements } = spec
  if (version === 'latest' || version === LATEST_VERSION) {
    canvas.width = size.width
    canvas.height = size.height

    return Object.values(elements)
      .sort((a, b) => {
        if (a.z < b.z) {
          return -1
        }
        if (a.z === b.z) {
          return 0
        }
        return 1
      })
      .reduce((prev, element) => {
        if (element.type === 'text') {
          return prev.then(() => renderTextElement(element, canvas))
        }
        if (element.type === 'image') {
          return prev.then(() => renderImageElement(element, canvas))
        }
        return prev
      }, Promise.resolve())
  }
  throw new Error('Unsupported version')
}

module.exports = {
  render
}
