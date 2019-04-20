require('@tensorflow/tfjs-node');
const yaml = require('js-yaml')
const fs = require('fs')
const { resolve } = require('./resolve')
const { render } = require('./render')
const { Canvas } = require('canvas')
const findEyes = require('./helpers/findEyes');
const { flareEyes } = require('./helpers/flareEyes');
const can = require("canvas");

(async () => {
  try {
    const meme = yaml.safeLoad(fs.readFileSync('tests/meme2.yaml', 'utf8'))
    const resolved = resolve(meme)
    // console.log('resolved: ',resolved)
    const canvas = new Canvas()
    render(resolved, canvas).then(() => {
      fs.writeFileSync('out.png', canvas.toBuffer())
    })
    // console.log(await findEyes.run_test());
    
    const image = await can.loadImage("./images/bad-luck-brian.png");
    const results = await findEyes.run(image);
    console.log(results)
    const resultImage = await flareEyes(results, image);

  } catch (error) {
    console.log(error)
  }
})();
