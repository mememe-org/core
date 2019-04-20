const { loadSpec } = require('./renderer/resolve')
const { render } = require('./renderer/render')

exports.render = (spec, canvas, resolveTemplate) => {
  const resolved = loadSpec(spec, resolveTemplate)
 
  return render(resolved, canvas)
}
