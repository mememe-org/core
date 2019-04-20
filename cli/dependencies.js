const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const request = require('request-promise-native')

const config = require('./config')

const checkDependency = (templateId) => {
  if(templateId.indexOf('/') < 0) {
    templateId = '_/' + templateId
  }

  return fs.existsSync(path.join(config.templatesPath, `${templateId}.yaml`))
}

exports.checkDependency = checkDependency

exports.pullTemplate = (templateId) => {
  if(templateId.indexOf('/') < 0) {
    templateId = '_/' + templateId
  }

  return request.get(`${config.hubURL}/${templateId}`).then(body => {
    const template = body

    const [username, templateName] = templateId.split('/')

    const targetFolder = path.join(config.templatesPath, username)

    if(!fs.existsSync(config.templatesPath)) {
      const mkdirp = require('mkdirp')
      mkdirp(config.templatesPath, () => {
        if(!fs.existsSync(targetFolder)) {
          fs.mkdirSync(targetFolder)
        }
        fs.writeFileSync(path.join(targetFolder, `${templateName}.yaml`), template)    
      })
    }
    
    fs.writeFileSync(path.join(targetFolder, `${templateName}.yaml`), template)    
    return template
  })
}

exports.resolveTemplate = (templateId) => {
  
  if(!checkDependency(templateId)) {
      throw new Error(`template ${templateId} not found. Try running: install or pull ${templateId}`)
    }
    
    if(templateId.indexOf('/') < 0) {
      templateId = '_/' + templateId
    }

    const templateLocation = path.join(config.templatesPath, `${templateId}.yaml`)

  return yaml.safeLoad( fs.readFileSync( templateLocation ))
}
