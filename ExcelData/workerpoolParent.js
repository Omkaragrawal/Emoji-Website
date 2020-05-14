const workerpool = require('workerpool');

const pool = workerpool.pool(__dirname + '/workerpoolWorker.js', {
    minWorkers: "max",
    workerType: "thread"
});

const completeData = [
    ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/grinning-face_1f600.png", "Grinning_Face"],
    ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth_1f603.png", "Grinning_Face_with_Big_Eyes"],
    ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-smiling-eyes_1f604.png", "Grinning_Face_with_Smiling_Eyes"],
    ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/grinning-face_1f600.png", "Grinning_Face"],
    ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth_1f603.png", "Grinning_Face_with_Big_Eyes"],
    ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-smiling-eyes_1f604.png", "Grinning_Face_with_Smiling_Eyes"],
    ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/grinning-face_1f600.png", "Grinning_Face"],
    ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth_1f603.png", "Grinning_Face_with_Big_Eyes"],
    ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-smiling-eyes_1f604.png", "Grinning_Face_with_Smiling_Eyes"]
];
console.time("Time taken for all files: ")
Promise.all(completeData.map((imgUnit, i) => {
    console.log("Returning pool.exec for count: " + i);
    return pool.exec("downloadImg", [imgUnit[0], 'dataset/' + imgUnit[1], i.toString() + ".png", i]);
})).then(success => {
    console.log("Success");
    console.log(success);
    console.timeEnd("Time taken for all files: ");
    pool.terminate(true);
})
.catch(err => console.log(err));

