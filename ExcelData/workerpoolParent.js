const workerpool = require('workerpool');
const readXlsxFile = require('read-excel-file/node');


console.time("Time taken for all files: ");
const toUsed = "http://www.emojitracker.com/api/rankings"
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

const pool = workerpool.pool(__dirname + '/workerpoolWorker.js', {
    minWorkers: "max",
    workerType: "thread"
});

let completeData = []
console.log(completeData.concat(["url", "name"]))
const files = ["./AppleEmojiListEmoji.xlsx", "./FacebookEmojiListEmoji.xlsx", "./GoogleEmojiListEmoji.xlsx", "./openEmojiListEmoji.xlsx", "./TwitterEmojiListEmoji.xlsx"]
// for (let i = 0; i < files.length; i++) {
//     let tempData = await data(files[i])
//     completeData = completeData.concat(tempData.slice(1).map(unit => [unit[0], unit[1].split(' ').join('_')]));
//     console.log(completeData.length)
// }

// const abc = files.reduce((prev, currVal, currentIndex, currArray) => {
//     if (typeof prev != "object") {
//         prev = new Array(0);
//     }
//     // console.log(currVal)
//     console.log(typeof (prev) + "\t:At Line 41 Iteration: " + currentIndex);
//     try {
//         let tempData = readXlsxFile(currVal, {
//             "URL": {
//                 prop: "url",
//                 type: "URL"
//             },
//             "title": {
//                 prop: 'title',
//                 type: String
//             }
//         });
//         tempData = tempData.slice(1).map(unit => [unit[0], unit[1].split(' ').join('_').split("'").join("")]);
//         // console.log(typeof(prev))
//         prev = prev.concat(tempData);
//         console.log(prev.length + "\t: At line 50");
//         return prev;
//     } catch (err) {
//         console.log(err);
//         return new Error(err)
//     }
// });

const abc = files.reduce((accumulator, currVal, currIndex) => {
    if(typeof(accumulator) != "object") {
        console.log(accumulator)
        accumulator = []
    }
    const excelToJson = require('convert-excel-to-json');
        console.log(currVal);
    const result = excelToJson({
    sourceFile: currVal.replace('./', ''),
    header:{
        rows: 1
    },
    sheets: ["Sheet1"],
    columnToKey: {
        A: 'URL',
        B: 'FILE'
    }
})["Sheet1"].map((val, index) => [val["URL"], val["FILE"]]);

console.log(result[20]);

accumulator = accumulator.concat(result.map((unit, index) => {
    // if(index == 1e3) {
    //     console.log(unit[1].split(" ").join("_").split("'").join("").split(':').join(""));
    // }
    return [unit[0], unit[1].split(" ").join("_").split("'").join("").split(':').join("").split("-").join("")]
}));
console.log(accumulator.length);
accumulator[1e3 * currIndex];
return accumulator
}, []);
console.log(abc.length)
console.log(abc[1.5e3]);

abc.forEach((imgUnit, index) => {
    (! imgUnit[0].endsWith(".png"))?console.log(imgUnit[0], index):1
});

let True = abc.filter((imgUnit) => {
    return (! imgUnit[0].endsWith(".png"))?false: true
});

console.log(True.length)


// console.time("Total Worker time: ")

// console.log("Starting Download");



// Promise.all(completeData.map((imgUnit, i) => {
//         console.log("Returning pool.exec for count: " + i);
//         return pool.exec("downloadImg", [imgUnit[0], 'dataset/' + imgUnit[1], i.toString() + ".png", i]);
//     })).then(success => {
//         console.log("Success");
//         console.log(success);
//         console.timeEnd("Time taken for all files: ");
//         pool.terminate(true);
//     })
//     .catch(err => console.log(err));