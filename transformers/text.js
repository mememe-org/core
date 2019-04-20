const randomCase = require('random-case')
const rot13 = require('rot-13')
const piglatin = require('pig-latin')
const flip = require('lunicode-flip')
const mirror = require('lunicode-mirror')
const creepify = require('lunicode-creepify')
const dateformat = require('dateformat')

module.exports = {
  uppercase: (text) => {
    return text.toUpperCase()
  },
  lowercase: (text) => {
    return text.toLowerCase()
  },
  randomcase: (text) => {
    return randomCase(text)
  },
  rot13: (text) => {
    return rot13(text)
  },
  piglatin: (text) => {
    return piglatin(text)
  },
  flip: (text) => {
    return flip.encode(text)
  },
  mirror: (text) => {
    return mirror.encode(text)
  },
  creepify: (text) => {
    return creepify.encode(text)
  },
  dateformat: (text) => {
    return dateformat(new Date(), text)
  }
}
