const fs = require('fs')
const Canvas = require('canvas')
const path = require('path')

const renderTextComponent = (canvas, component) => {
  const { text:_text, upper, style, location } = component
  const ctx = canvas.getContext('2d')
  if(upper) {
    text = _text.toUpperCase()
  } else {
    text = _text
  }
  if(style === undefined) {
    ctx.textAlign = "left"
    ctx.fillStyle = "#000"
    ctx.font = "30px Arial"
  } else {
    ctx.textAlign = style.align
    ctx.font = style.font
    if(style.stroke !== undefined) {
      ctx.strokeStyle = style.stroke.color || '#000',
      ctx.lineWidth = style.stroke.width || 1
      ctx.strokeText(text || "", location.x, location.y)
    }
    ctx.fillStyle = style.color || '#000'
  }
  ctx.fillText(text || "", location.x, location.y)
}

const renderComponent = (canvas, component) => {
  if(component.location === undefined || component.location.x === undefined || component.location.y === undefined) {
    throw new Error('invalid component location specification')
  }
  if(component.text !== undefined) {
    renderTextComponent(canvas, component)
  }
}

const renderBackground = (spec, canvas) => {
  return new Promise((resolve) => {
    const bg = new Canvas.Image()
    console.log(`reading ${spec.background}...`)
    const bgData = fs.readFileSync(spec.background)
    
    bg.onload = () => {
      console.log(`loaded ${spec.background}`)
      canvas.width = bg.width
      canvas.height = bg.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bg, 0, 0)
      resolve(canvas)
    }
    bg.src = bgData
  })
}

const render = async (spec, canvas) => {
  // resolve background
  if(spec.background === undefined) {
    throw new Error('spec object has no background field.')
  }
  
  try {
    await renderBackground(spec, canvas)
  } catch (e) {
    throw e
  }
  // render each other component in spec
  const clone = { ...spec }
  delete clone.background
  // console.log(Object.values(clone))
  Object.values(clone).forEach(component => renderComponent(canvas, component))

  return canvas
}

module.exports = {
  render
}
