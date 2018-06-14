const fs = require('fs')
const canvas = require('canvas')
const path = require('path')

const resolveImagePath = (imageName) => {
  return path.join('images', imageName)
}

const renderTextComponent = (ctx, component) => {
  const { text:_text, upper, style, location } = component
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

const renderComponent = (ctx, component) => {
  if(component.location === undefined || component.location.x === undefined || component.location.y === undefined) {
    throw new Error('invalid component location specification')
  }
  if(component.text !== undefined) {
    renderTextComponent(ctx, component)
  }
}

const render = (spec, target="out.png") => {
  // resolve background
  if(spec.background === undefined) {
    throw new Error('spec object has no background field.')
  }
  const imgPath = resolveImagePath(spec.background)
  const bg = new canvas.Image()
  console.log(`reading ${imgPath}...`)
  const bgData = fs.readFileSync(imgPath)
  bg.onload = () => {
    console.log(`loaded ${imgPath}`)
    const cnv = new canvas(bg.width, bg.height)
    const ctx = cnv.getContext('2d')
    ctx.drawImage(bg, 0, 0)
    // render each other component in spec
    const clone = { ...spec }
    delete clone.background
    
    console.log(Object.values(clone))
    Object.values(clone).forEach(component => renderComponent(ctx, component))
    // save
    fs.writeFileSync(target, cnv.toBuffer())
  }
  bg.src = bgData
}

module.exports = {
  render
}
