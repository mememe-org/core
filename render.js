const fs = require('fs')
const { loadImage } = require('canvas')
const path = require('path')
const { LATEST_VERSION } = require('./defaults')

const renderTextElement = (element, canvas) => {
  return new Promise(resolve => {
    const { text, font, textAlign, textBaseline, direction, color, stroke, transform, position } = element
    const ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.textAlign = textAlign
    ctx.textBaseline = textBaseline
    ctx.direction = direction
    ctx.fillStyle = color
    ctx.fillText(text, position.x, position.y)

    if (stroke !== undefined) {
      ctx.lineWidth = stroke.width
      ctx.strokeStyle = stroke.color
      ctx.strokeText(text, position.x, position.y)
    }
    resolve()
  })
}

const renderImageElement = (element, canvas) => {
  const { image, transform, position } = element
  const ctx = canvas.getContext('2d')
  return loadImage(image)
    .then(data => {
      ctx.drawImage(data, position.x, position.y)
    })
}

const render = async (spec, canvas) => {
  const { version, size, ...elements } = spec
  if (version === 'latest' || version === LATEST_VERSION) {
    canvas.width = size.width
    canvas.height = size.height

    await Object.values(elements)
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
          return prev.then(renderTextElement(element, canvas))
        }
        if (element.type === 'image') {
          return prev.then(renderImageElement(element, canvas))
        }
        return prev
      }, Promise.resolve())
    return canvas
  }
  throw new Error('Unsupported version')
}

module.exports = {
  render
}
