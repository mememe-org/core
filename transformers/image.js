if(process.env.IMAGE_TRANSFORMER_ENABLED) {
  const findEyes = require('../helpers/findEyes')
  const { flareEyes } = require('../helpers/flareEyes')
  const { sunGlasses: sunglasses, eyeBlock: eyeblock } = require('../helpers/sunGlasses');

  module.exports = {
    hyperify: (image) => {
      return findEyes.run(image)
        .then(results => flareEyes(results, image))
    },
    sunglasses: (image) => {
      return findEyes.run(image)
        .then(results => sunglasses(results, image))
    },
    eyeblock: (image) => {
      return findEyes.run(image)
        .then(results => eyeblock(results, image))
    },
  }
} else {
  module.exports = {}
}
