const { loadSpec } = require('./parse')
const { render } = require('./render')

/*
 * spec: Object of meme configuration
 * canvas: Canvas
 * resolveTemplate: function (templateId) => Object of meme configuration
*/
module.exports = {
  render: (spec, canvas, resolveTemplate) => render(loadSpec(spec, resolveTemplate), canvas),
}
