const fs = require('fs')
const yaml = require('js-yaml')
const deepAssign = require('deep-assign')

const resolveTemplateFn = (templateId) => {
  return yaml.safeLoad( fs.readFileSync(`templates/${templateId}.yaml`) )
}

const resolve = (spec, resolveTemplate = resolveTemplateFn) => {
  if(spec.template !== undefined) {
    templateId = spec.template
    delete spec.template
    const merge = deepAssign( {}, resolve(resolveTemplate(templateId)), spec )
    return merge
  } else {
    return spec
  }
}

module.exports = {
  resolve
}
