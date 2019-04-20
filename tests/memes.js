const yaml = require('js-yaml')
const fs = require('fs')
const { createCanvas } = require('canvas')
const { loadSpec } = require('../resolve')
const { render } = require('../render')

try {
  const meme = yaml.safeLoad(fs.readFileSync('memes/meme2.yaml', 'utf8'))
  const resolved = loadSpec(meme)
  const canvas = createCanvas()
  render(resolved, canvas)
    .then(() => {
      fs.writeFileSync('out.png', canvas.toBuffer())
    })
} catch (error) {
  console.log(error)
}
