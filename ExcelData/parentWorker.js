const {
    Worker,
    isMainThread,
    parentPort,
    workerData
} = require('worker_threads');

let axios = require('axios')
let fs = require('fs');
const workerPath = './worker.js'


const workerCreator = async (...sendData) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(workerPath, {
            workerData: sendData,
        });
        worker.on('message', message => {
            if (message === true) {
                worker.terminate();
                resolve(true);
            } else {
                console.log(message)
            }
        });
        worker.on('error', err => {
            worker.terminate();
            reject(err);
        });
        worker.on('exit', code => {
            worker.terminate();
            // if (code == 1) resolve(true)
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    })
}
workerArray = Array(2)

if (isMainThread) {
    let completeData = [
        ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/grinning-face_1f600.png", "Grinning_Face"],
        ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth_1f603.png", "Grinning_Face_with_Big_Eyes"],
        ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-smiling-eyes_1f604.png", "Grinning_Face_with_Smiling_Eyes"]
    ];

    (async () => {
        console.time("Total Worker time: ")

        for (let i = 0; i < completeData.length; i++) {
            // console.log(`Downloading image ${i+1} / ${completeData.length}: \t ${completeData[i][1]}`);
            // await downloadImage(completeData[i][0], 'dataset/' + completeData[i][1], i.toString() + ".png")
            console.log("Creating a worker thread");
            workerCreator(completeData[i][0], 'dataset/' + completeData[i][1], i.toString() + ".png")
                .then(worker => {
                    console.log("Worker returned successfully")
                })
                .catch(returnData => {
                    console.log(returnData)
                });
        }

        console.timeEnd("Total Worker time: ")
    })()
    // module.exports = function parseJSAsync(script) {
    //   return new Promise((resolve, reject) => {
    //     const worker = new Worker(__filename, {
    //       workerData: 
    //     });
    //     worker.on('message', resolve);
    //     worker.on('error', reject);
    //     worker.on('exit', (code) => {
    //       if (code !== 0)
    //         reject(new Error(`Worker stopped with exit code ${code}`));
    //     });
    //   });
    // };
} // else {
//     const axios = require('axios')
//     const fs = require('fs');
//     const downloadImage = async (link, dir, file, log) => {
//         try {
//             const {
//                 data
//             } = await axios.get(link, {
//                 responseType: "stream"
//             });
//             fs.mkdirSync(dir, {
//                 recursive: true
//             }, err => {
//                 console.log(err);
//             });
//             data.pipe(fs.createWriteStream(dir + "/" + file));
//             console.log(log);
//         } catch (err) {
//             console.log(err)
//         }
//     }
//     const script = workerData;
//     console.log("In worker thread\n")
//     parentPort.postMessage(downloadImage(...script));

// }
