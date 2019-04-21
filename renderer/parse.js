const merge = require('lodash.merge')
const { DEFAULT_TEXT, DEFAULT_IMAGE } = require('./defaults')

const resolveSpec = (spec, resolveTemplate) => {
  if(spec.from !== undefined) {
    const templateId = spec.from
    delete spec.from
    const merged = merge( {}, resolveSpec(resolveTemplate(templateId), resolveTemplate), spec )
    return merged
  } else {
    return spec
  }
}

const loadSpec = (spec, resolveTemplate) => {
  const resolvedSpec = resolveSpec(spec, resolveTemplate)
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
          [key]: merge({}, DEFAULT_TEXT, value),
        }
      }
      if (value.image !== undefined) {
        const image = merge({}, DEFAULT_IMAGE, value)
        if (typeof(image.size) === 'string') {
          const [imageWidth, imageHeight] = image.size.split('x').map(Number)
          image.size = { width: imageWidth, height: imageHeight }
        }
        return {
          [key]: image,
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
  loadSpec
}
