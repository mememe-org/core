const assert = require('assert')
const { loadSpec } = require('../resolve')

try {
  loadSpec({})
} catch (error) {
  assert.strictEqual(error.message, 'Size is undefined')
}

let spec = loadSpec({
  size: '100x200',
})
assert.deepStrictEqual(spec, {
  version: 'latest',
  size: {
    width: 100,
    height: 200,
  },
})

spec = loadSpec({
  size: {
    width: 100,
    height: 200,
  },
})
assert.deepStrictEqual(spec, {
  version: 'latest',
  size: {
    width: 100,
    height: 200,
  },
})

spec = loadSpec({
  size: '100x200',
  foo: 'The quick brown fox jumps over the lazy dog',
})
assert.deepStrictEqual(spec, {
  version: 'latest',
  size: {
    width: 100,
    height: 200,
  },
  foo: {
    type: 'text',
    text: 'The quick brown fox jumps over the lazy dog',
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
  },
})

spec = loadSpec({
  size: '100x200',
  foo: {
    text: 'The quick brown fox jumps over the lazy dog',
  },
})
assert.deepStrictEqual(spec, {
  version: 'latest',
  size: {
    width: 100,
    height: 200,
  },
  foo: {
    type: 'text',
    text: 'The quick brown fox jumps over the lazy dog',
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
  },
})

spec = loadSpec({
  size: '100x200',
  bar: {
    image: 'http://some.url/image/path',
  },
})
assert.deepStrictEqual(spec, {
  version: 'latest',
  size: {
    width: 100,
    height: 200,
  },
  bar: {
    image: 'http://some.url/image/path',
    type: 'image',
    transform: [],
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  }
})
