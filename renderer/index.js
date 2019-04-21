const { loadSpec } = require('./parse')
const { render } = require('./render')

/*
 * spec: Object of meme configuration
 * canvas: Canvas
 * resolveTemplate: function (templateId) => Object of meme configuration
 * loadImage: function (imageSource) => Promise(Image)
*/
module.exports = {
  render: (spec, canvas, resolveTemplate, loadImage) => render(loadSpec(spec, resolveTemplate), canvas, loadImage),
}
