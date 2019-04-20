const DEFAULT_TEXT = {
  text: '',
  type: 'text',
  style: {
    textAlign: 'center',
    textTransform: 'uppercase',
    font: '60px Impact',
    color: 'white',
  },
  stroke: {
    width: 5,
    color: 'black',
  },
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
  DEFAULT_TEXT,
  DEFAULT_IMAGE,
}
