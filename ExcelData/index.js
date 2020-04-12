const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
// const util = require('util');
const axios = require('axios').default;
const {
    Worker,
    isMainThread,
    parentPort,
    workerData
} = require('worker_threads');

const data = (file) => {
    try {
        const value = readXlsxFile(file, {
            "URL": {
                prop: "url",
                type: "URL"
            },
            "title": {
                prop: 'title',
                type: String
            }
        });
        return value;
    } catch (err) {
        console.log("Error:\n\n\n");
        console.log(err);
    }
};
const workerPath = './worker.js'

console.time("TOTAL TIME TAKEN FOR ALL THE PROCESS IS: ")
const workerCreator = (index, totalCount, ...sendData) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(workerPath, {
            workerData: sendData,
        });
        worker.on('message', message => {
            if (message === true) {
                worker.terminate();
                console.log(`Downloaded image ${index+1} / ${totalCount}: \t ${sendData[1] + "/" + sendData[2]}`);
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
            if (code !== 0) {
                console.log(`Failed downloading image ${index+1} / ${totalCount}: \t ${sendData[1] + "/" + sendData[2]}`);

                reject(new Error(`Worker stopped with exit code ${code}`));
            }
            else if (code == 0) {
                console.log(`Downloaded image ${index+1} / ${totalCount}: \t ${sendData[1] + "/" + sendData[2]}`);
                resolve("SUCCESS")
            }
        });
    })
}

// console.time("TOTAL TIME TAKEN FOR ALL THE PROCESS IS: ")
(async () => {
    let completeData = []
    console.log(completeData.concat(["url", "name"]))
    const files = ["./AppleEmojiListEmoji.xlsx", "./FacebookEmojiListEmoji.xlsx", "./GoogleEmojiListEmoji.xlsx", "./openEmojiListEmoji.xlsx", "./TwitterEmojiListEmoji.xlsx"]

    // files.forEach(async file => {
    //     let tempData = await data(file)
    //     // console.log(tempData[3])
    //     // tempData = ;
    //     console.log(tempData[5]);
    //     completeData = completeData.concat(tempData.slice(1).map(unit => [unit[0], unit[1].split(' ').join('_')]));
    //     console.log(completeData.length)
    // });

    for (let i = 0; i < files.length; i++) {
        let tempData = await data(files[i])
        // console.log(tempData[3])
        // tempData = ;
        // console.log(tempData[5]);
        completeData = completeData.concat(tempData.slice(1).map(unit => [unit[0], unit[1].split(' ').join('_')]));
        console.log(completeData.length)
    }
    console.log(completeData.length)

    // console.time("Total Worker time: ")

    console.log("Starting Download");
    Promise.all(completeData.map((imgUnit, i) => {
        return workerCreator(i, completeData.length, imgUnit[0], 'dataset/' + imgUnit[1], i.toString() + ".png")
    })).then(success => {
        console.log("Promise.all Successful");
        // console.log(success);
        console.timeEnd("TOTAL TIME TAKEN FOR ALL THE PROCESS IS: ");
    }).catch(err => {
        console.log("\n\n\nError returned");
        console.log(err);
        console.timeEnd("TOTAL TIME TAKEN FOR ALL THE PROCESS IS: ");
    });
})()