const Jimp = require("jimp");

const data = [
    'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/google/241/kissing-face-with-smiling-eyes_1f619.png',
    'Kissing Face with Smiling Eyes'
];
const i = 1

Jimp.read(data[0])
    .then(image => {
        image
        .quality(100)
        .write(`newDataset/${data[1]}/${i.toString()}.jpg`);
    })
    .catch(err => {
        // Handle an exception.
        console.log(err)
    });