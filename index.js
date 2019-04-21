// const { render } = require('./renderer')

// if (require.main === module) {
//   (() => {
//     let [memePath, outPath, ...rest] = process.argv.slice(2)
//     if (memePath === undefined) {
//       console.log('Usage: node index.js path/to/meme.yaml [path/to/output.png]')
//       return
//     }
//     if (outPath === undefined) {
//       outPath = 'out.png'
//     }
//     const yaml = require('js-yaml')
//     const fs = require('fs')
//     const { createCanvas, loadImage } = require('canvas')
//     const { resolveTemplate } = require('./tests/utils')
//     try {
//       const meme = yaml.safeLoad(fs.readFileSync(memePath, 'utf8'))
//       const canvas = createCanvas()
//       render(meme, canvas, resolveTemplate, loadImage)
//         .then(() => {
//           fs.writeFileSync(outPath, canvas.toBuffer())
//         })
//     } catch (error) {
//       console.log(error)
//     }
//   })()
// }

// module.exports = {
//   render,
// }

const findEyes = require('./helpers/findEyes');
// const { flareEyes } = require('./helpers/flareEyes');
const { addHat } = require("./helpers/sunGlasses");
const can = require("canvas");

(async () => {
  try {
    const image = await can.loadImage("./images/IMG_20190420_185621.jpg");
    // const image = await can.loadImage("./images/one-does-not-simply.png");
    // const image = await can.loadImage("./images/bad-luck-brian.png");
    const results = await findEyes.run(image);
    // console.log(results)
    // const resultImage = await flareEyes(results, image);
    // await sunGlassesTest();
    await addHat(results, image);
  } catch (error) {
    console.log(error)
  }
})();
