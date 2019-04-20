const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const Canvas = require('canvas')

const mememe = require('../mememe')

const dependencies = require('./dependencies')

const build = async (filename, output) => {
  const absPath = path.join(process.cwd(), filename)
  console.log(`building ${absPath}`)

  // render the template
  const canvas = Canvas.createCanvas()
  await mememe.render(yaml.safeLoad(fs.readFileSync(filename)), canvas, dependencies.resolveTemplate)

  const outputPath = path.join(process.cwd(), output || 'meme.png')
  console.log(`output is at ${outputPath}`)
  fs.writeFileSync(outputPath, canvas.toBuffer())
}

module.exports = build