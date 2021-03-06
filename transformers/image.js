if (process.env.IMAGE_TRANSFORMER_ENABLED) {
  const findEyes = require('../helpers/findEyes')
  const { flareEyes } = require('../helpers/flareEyes')
  const {
    sunGlasses: sunglasses,
    eyeBlock: eyeblock,
    addHat: addhat,
    addStupidHat: addstupidhat,
    addBand: addband
} = require('../helpers/sunGlasses');

  module.exports = {
    hyperify: async (image, context = {}) => {
      let { eyes } = context
      if (eyes === undefined) {
        eyes = await findEyes.run(image)
      }
      const data = await flareEyes(eyes, image)
      return {
        data,
        context: {
          ...context,
          eyes,
        },
      }
    },
    sunglasses: async (image, context = {}) => {
      let { eyes } = context
      if (eyes === undefined) {
        eyes = await findEyes.run(image)
      }
      const data = await sunglasses(eyes, image)
      return {
        data,
        context: {
          ...context,
          eyes,
        },
      }
    },
    eyeblock: async (image, context = {}) => {
      let { eyes } = context
      if (eyes === undefined) {
        eyes = await findEyes.run(image)
      }
      const data = await eyeblock(eyes, image)
      return {
        data,
        context: {
          ...context,
          eyes,
        },
      }
    },
    addhat: async (image, context = {}) => {
      let { eyes } = context
      if (eyes === undefined) {
        eyes = await findEyes.run(image)
      }
      const data = await addhat(eyes, image)
      return {
        data,
        context: {
          ...context,
          eyes,
        },
      }
    },
    addstupidhat: async (image, context = {}) => {
      let { eyes } = context
      if (eyes === undefined) {
        eyes = await findEyes.run(image)
      }
      const data = await addstupidhat(eyes, image)
      return {
        data,
        context: {
          ...context,
          eyes,
        },
      }
    },
    addband: async (image, context = {}) => {
      let { eyes } = context
      if (eyes === undefined) {
        eyes = await findEyes.run(image)
      }
      const data = await addband(eyes, image)
      return {
        data,
        context: {
          ...context,
          eyes,
        },
      }
    },
  }
} else {
  module.exports = {}
}
