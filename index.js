require('@tensorflow/tfjs-node');
const findEyes = require('./helpers/findEyes');
const { flareEyes } = require('./helpers/flareEyes');
const { sunGlasses, eyeBlock } = require("./helpers/sunGlasses");
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
    await eyeBlock(results, image);
  } catch (error) {
    console.log(error)
  }
})();
