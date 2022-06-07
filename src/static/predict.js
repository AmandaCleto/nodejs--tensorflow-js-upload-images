// the link to your model provided by Teachable Machine export panel
const URL = `tm-image-model/`;

let model, webcam, maxPredictions, joaninha, sad, borboleta;
let refresh = true;

// Load the image model and setup the webcam
async function init() {
    if (refresh) {

        refresh = false;
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);

        joaninha = document.getElementById("joaninha");
        borboleta = document.getElementById("borboleta");
        window.requestAnimationFrame(loop);
    }
    else {
        location.reload();
    }

}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].className == "Joaninha") {
            joaninha.innerHTML = prediction[i].probability.toFixed(2);
            document.getElementById("joaninha-progress").value = prediction[i].probability.toFixed(2);
        }

        if (prediction[i].className == "Borboleta") {
            borboleta.innerHTML = prediction[i].probability.toFixed(2);
            document.getElementById("borboleta-progress").value = prediction[i].probability.toFixed(2);
        }
    }
}