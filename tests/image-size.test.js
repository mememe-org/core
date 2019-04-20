const yaml = require('js-yaml')
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const { resolveTemplate } = require('./utils')
const { render } = require('../renderer')

try {
  const meme = yaml.safeLoad(fs.readFileSync('tests/memes/image-size.yaml', 'utf8'))
  const canvas = createCanvas()
  render(meme, canvas, resolveTemplate, loadImage)
    .then(() => {
      fs.writeFileSync('out.png', canvas.toBuffer())
    })
} catch (error) {
  console.log(error)
}
