const path = require('path')
const request = require('request')
const config = require('./config')
const fs = require('fs')

module.exports = (filename, username, templateID) => {
  if(templateID === undefined) {
    templateID = path.basename(filename, '.yaml')
  }

  const targetFile = path.join(process.cwd(), filename)

  request.post(`${config.hubURL}/${username}/${templateID}`, {
    body: fs.readFileSync(targetFile, 'utf8').toString(),
    headers: {
      'Content-Type': 'text/plain'
    }
  }, (err, res) => {
    console.log('pushed')
    console.log(err)
  })
}