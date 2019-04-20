const { resolve } = require('./renderer/resolve')
const { render } = require('./renderer/render')

exports.render = (spec, canvas, resolveTemplate) => {
  const resolved = resolve(spec, resolveTemplate)

  return render(resolved, canvas)
}
