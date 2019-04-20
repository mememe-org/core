const program = require('commander')

const build = require('./build')

program.version('0.55555.55555555')

program.command('install')
  .action(() => {
    console.log('issuing install')
  })

program.command('pugsh')
  .action(() => {
    console.log('issuing push')
  })

program.command('pull')
  .action(() => {
    console.log('issuing pull')
  })

program.command('build <filename> [output]')
  .action((filename, output) => {
    build(filename, output)
  })

program.parse(process.argv)