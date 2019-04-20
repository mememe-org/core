const { render } = require('./renderer')

if (require.main === module) {
  (() => {
    let [memePath, outPath, ...rest] = process.argv.slice(2)
    if (memePath === undefined) {
      console.log('Usage: node index.js path/to/meme.yaml [path/to/output.png]')
      return
    }
    if (outPath === undefined) {
      outPath = 'out.png'
    }
    const yaml = require('js-yaml')
    const fs = require('fs')
    const { createCanvas, loadImage } = require('canvas')
    const { resolveTemplate } = require('./tests/utils')
    try {
      const meme = yaml.safeLoad(fs.readFileSync(memePath, 'utf8'))
      const canvas = createCanvas()
      render(meme, canvas, resolveTemplate, loadImage)
        .then(() => {
          fs.writeFileSync(outPath, canvas.toBuffer())
        })
    } catch (error) {
      console.log(error)
    }
  })()
}

module.exports = {
  render,
}
