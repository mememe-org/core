const findEyes = require('../helpers/findEyes')
const { flareEyes } = require('../helpers/flareEyes')

module.exports = {
  hyperify: (image) => {
    return findEyes.run(image)
      .then(results => flareEyes(results, image))
  },
}
