const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const dependencies = require('./dependencies')

const collectDependencies = (templateID) => {
  if(!dependencies.checkDependency(templateID)) {
    console.log(`${templateID} does not exist locally, pulling from hub`)
    return dependencies.pullTemplate(templateID)
  }
  return {}
}

const installFromSpec = async (spec) => {
  if(spec.from !== undefined) {
    parentSpec = await collectDependencies(spec.from)
    installFromSpec(yaml.safeLoad(parentSpec))
  }
}

module.exports = (filename) => {
  spec = yaml.safeLoad(fs.readFileSync(filename))
  installFromSpec(spec)
}