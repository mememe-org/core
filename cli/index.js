const program = require('commander')

const build = require('./build')
const push = require('./push')
const pull = require('./dependencies').pullTemplate
const install = require('./install')

program.version('0.55555.55555555')

program.command('install <filename>')
  .action((filename) => {
    install(filename)
  })

program.command('push <filename> <username> [templateID]')
  .action((filename, username, templateID) => {
    push(filename, username, templateID)
  })

program.command('pull <templateID>')
  .action((templateID) => {
    pull(templateID)
  })

program.command('build <filename> [output]')
  .action((filename, output) => {
    build(filename, output)
  })

program.parse(process.argv)
