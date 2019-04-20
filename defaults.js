const LATEST_VERSION = '0.55555.55555555'

const DEFAULT_TEXT = {
  text: '',
  type: 'text',
  font: '60px Impact',
  textAlign: 'center',
  textBaseline: 'alphabetic',
  direction: 'ltr',
  color: 'white',
  stroke: {
    width: 5,
    color: 'black',
  },
  transform: [],
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
}

const DEFAULT_IMAGE = {
  image: '',
  type: 'image',
  transform: [],
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
}

module.exports = {
  LATEST_VERSION,
  DEFAULT_TEXT,
  DEFAULT_IMAGE,
}
