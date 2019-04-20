const { LATEST_VERSION } = require('./defaults')
const textTransformers = require('../transformers/text')
const imageTransformers = require('../transformers/image')

/* Warning: this is not thoroughly tested */
const createWordWrapper = (ctx) => {
  return (text, maxWidth) => {
    const result = text.split(' ')
      .reduce(({ lines, currentLine }, word, idx) => {
        const concatenatedLine = (idx === 0) ? word : currentLine.concat(' ', word)
        const width = ctx.measureText(concatenatedLine).width
        if (width < maxWidth) {
          return {
            lines,
            currentLine: concatenatedLine,
          }
        }
        return {
          lines: lines.concat(currentLine ),
          currentLine: word,
        }
      }, { lines: [], currentLine: '' })
    return result.lines.concat(result.currentLine).join('\n')
  }
}

/* Warning: this is not thoroughly tested */
const calculateAvailableWidth = (totalWidth, textAlign, direction, horizontalPosition) => {
  if (
    textAlign === 'left' ||
    (textAlign ==='start' && direction === 'ltr') ||
    (textAlign ==='end' && direction === 'rtl')
  ) {
    return totalWidth - horizontalPosition
  }
  if (textAlign === 'center') {
    return Math.min(horizontalPosition, totalWidth - horizontalPosition) * 2
  }
  if (
    textAlign === 'right' ||
    (textAlign ==='end' && direction === 'ltr') ||
    (textAlign ==='start' && direction === 'rtl')
  ) {
    return horizontalPosition
  }
  return totalWidth
}

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
      if (textTransformers[method] !== undefined) {
        return textTransformers[method](prev)
      }
      return prev
    }, text)

    const wrappedText = createWordWrapper(ctx)(
      transformedText,
      calculateAvailableWidth(canvas.width, textAlign, direction, position.x)
    )

    ctx.fillText(wrappedText, position.x, position.y)

    if (stroke !== undefined) {
      ctx.lineWidth = stroke.width
      ctx.strokeStyle = stroke.color
      ctx.strokeText(wrappedText, position.x, position.y)
    }
    resolve()
  })
}

const renderImageElement = (element, canvas, loadImage) => {
  const { image, transform, position, size } = element
  const ctx = canvas.getContext('2d')
  if (image === '') {
    return Promise.resolve()
  }
  return loadImage(image)
    .then(data => transform
      .reduce((prev, method) => {
        if (imageTransformers[method] !== undefined) {
          return prev.then(({ data: prevData, context }) => imageTransformers[method](prevData, context))
        }
        return prev
      }, Promise.resolve({ data, context: {} }))
    )
    .then(({ data: transformedImage }) => {
      ctx.drawImage(
        transformedImage,
        position.x,
        position.y,
        size.width || transformedImage.naturalWidth,
        size.height || transformedImage.naturalHeight
      )
    })
}

const render = (spec, canvas, loadImage) => {
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
          return prev.then(() => renderImageElement(element, canvas, loadImage))
        }
        return prev
      }, Promise.resolve())
  }
  throw new Error('Unsupported version')
}

module.exports = {
  render
}
