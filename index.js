const { resolve } = require('./resolve')
const { render } = require('./render')

exports.render = (spec, canvas, resolveTemplate) => {
  const resolved = resolve(spec, resolveTemplate)
 
  return render(resolved, canvas)
}
