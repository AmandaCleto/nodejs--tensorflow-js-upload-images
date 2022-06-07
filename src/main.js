const tf = require('@tensorflow/tfjs-node');
const Jimp = require('jimp');


const MODEL_DIR_PATH = `${__dirname}/static/tm-image-model`;

const IMAGE_FILE_PATH = `${__dirname}/images/borboleta_2.jpg`;

(async () => {

  const labels = require(`${MODEL_DIR_PATH}/metadata.json`).labels;

  const model = await tf.loadLayersModel(`file://${MODEL_DIR_PATH}/model.json`);

  model.summary();

  const image = await Jimp.read(IMAGE_FILE_PATH);
  image.cover(224, 224, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

  const NUM_OF_CHANNELS = 3;
  let values = new Float32Array(224 * 224 * NUM_OF_CHANNELS);

  let i = 0;
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
    pixel.r = pixel.r / 127.0 - 1;
    pixel.g = pixel.g / 127.0 - 1;
    pixel.b = pixel.b / 127.0 - 1;
    pixel.a = pixel.a / 127.0 - 1;
    values[i * NUM_OF_CHANNELS + 0] = pixel.r;
    values[i * NUM_OF_CHANNELS + 1] = pixel.g;
    values[i * NUM_OF_CHANNELS + 2] = pixel.b;
    i++;
  });

  const outShape = [224, 224, NUM_OF_CHANNELS];
  let img_tensor = tf.tensor3d(values, outShape, 'float32');
  img_tensor = img_tensor.expandDims(0);

  const predictions = await model.predict(img_tensor).dataSync();

  for (let i = 0; i < predictions.length; i++) {
    const label = labels[i];
    const probability = predictions[i];
    console.log(probability);
    console.log(label);
  }

})();