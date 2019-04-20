const yaml = require('js-yaml')
const fs = require('fs')

const resolveTemplate = (templateId) => {
  return yaml.safeLoad(fs.readFileSync(`templates/${templateId}.yaml`))
}

module.exports = {
  resolveTemplate,
}
