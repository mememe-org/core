const { homedir } = require('os')
const path = require('path')

module.exports = {
  templatesPath: path.join(homedir(), '.mememe/templates'),
  hubURL: 'http://meme.connek.tk'
}
