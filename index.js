const { loadSpec } = require('./resolve')
const { render } = require('./render')

exports.render = (spec, canvas, resolveTemplate) => {
  const resolved = loadSpec(spec, resolveTemplate)
 
  return render(resolved, canvas)
}
