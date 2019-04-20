const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const config = require('./config')


exports.pullTemplate = (templateId) => {

}

exports.resolveTemplate = (templateId) => {
  console.log(`resolving template ${templateId}`)
  const templateLocation = path.join(config.templatesPath, `${templateId}.yaml`)
  return yaml.safeLoad( fs.readFileSync( templateLocation ))
}
