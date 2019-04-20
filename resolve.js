const fs = require('fs')
const yaml = require('js-yaml')
const deepAssign = require('deep-assign')
const { DEFAULT_TEXT, DEFAULT_IMAGE } = require('./defaults')

const loadTemplate = (templateId) => {
  return yaml.safeLoad( fs.readFileSync(`templates/${templateId}.yaml`) )
}

const resolve = (spec) => {
  if (spec.from !== undefined) {
    templateId = spec.from
    delete spec.from
    const merge = deepAssign( {}, resolve(loadTemplate(templateId)), spec )
    return merge
  } else {
    return spec
  }
}

const loadSpec = (spec) => {
  const resolvedSpec = resolve(spec)
  if (resolvedSpec.version === undefined) {
    resolvedSpec.version = 'latest'
  }

  if (resolvedSpec.size === undefined) {
    throw new Error('Size is undefined')
  }
  if (typeof(resolvedSpec.size) === 'string') {
    const [width, height] = resolvedSpec.size.split('x').map(Number)
    resolvedSpec.size = { width, height }
  } else if (resolvedSpec.size.width === undefined || resolvedSpec.size.height === undefined) {
    throw new Error('Width/height is undefined')
  }

  const { version, size, ...elements } = resolvedSpec
  const resolvedElements = Object.entries(elements)
    .map(([key, value]) => {
      if (typeof(value) === 'string') {
        return {
          [key]: {
            ...DEFAULT_TEXT,
            type: 'text',
            text: value,
          },
        }
      }
      if (value.text !== undefined) {
        return {
          [key]: deepAssign({}, DEFAULT_TEXT, value),
        }
      }
      if (value.image !== undefined) {
        return {
          [key]: deepAssign({}, DEFAULT_IMAGE, value),
        }
      }
    })
    .reduce((acc, curr) => ({
      ...acc,
      ...curr,
    }), {})

  return {
    version,
    size,
    ...resolvedElements,
  }
}

module.exports = {
  loadSpec,
}
