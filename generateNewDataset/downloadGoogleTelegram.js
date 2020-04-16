const workerpool = require('workerpool');
const axios = require('axios').default;


console.time("Time taken for all files: ");


const pool = workerpool.pool(__dirname + '/downloadGoogleTelegram-worker.js', {
    minWorkers: "max",
    workerType: "thread"
});

const files = ["./AppleEmojiListEmoji.xlsx", "./GoogleEmojiListEmoji.xlsx", "./FacebookEmojiListEmoji.xlsx"];

(async () => {
    let completeData = files.reduce((accumulator, currVal, currIndex) => {
        if (typeof (accumulator) != "object") {
            // console.log(accumulator)
            accumulator = []
        }
        const excelToJson = require('convert-excel-to-json');
        console.log(currVal);
        const result = excelToJson({
            sourceFile: currVal.replace('./', ''),
            header: {
                rows: 1
            },
            sheets: ["Sheet1"],
            columnToKey: {
                A: 'URL',
                B: 'FILE'
            }
        })["Sheet1"].map((val, index) => [val["URL"], val["FILE"]]);

        // console.log(result[20]);

        accumulator = accumulator.concat(result.map((unit, index) => {
            // if(index == 1e3) {
            //     console.log(unit[1].split(" ").join("_").split("'").join("").split(':').join(""));
            // }
            return [unit[0], unit[1].split(" ").join("_").split("'").join("").split(':').join("")]
        }));
        console.log(accumulator.length);
        // accumulator[1e3 * currIndex];
        return accumulator
    }, []);

    completeData = completeData.filter((imgUnit) => {
        return (!imgUnit[0].endsWith(".png")) ? false : true
    });
    console.log("Completed Data Lengeth is: " + completeData.length);
    // console.log(completeData[1.5e3]);

    //-----------------------------------------------------------------------------------------------------------------
    // let {
    //     data
    // } = await axios.get("http://www.emojitracker.com/api/rankings", {
    //     responseType: "json"
    // });

    // console.log(data.length);

    // data = data.sort((a, b) => {
    //     a = a.score;
    //     b = b.score;
    //     return b - a;
    // }).slice(0, 200);

    // const dataNames = data.map((emojiData) => {
    //     const name = emojiData.name.split(" ").join("_").split("'").join("").split(':').join("");
    //     return name;
    // })
    //----------------------------------------------------------------------------------------------------------------
    // completeData = [ //const
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/grinning-face_1f600.png", "Grinning_Face"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth_1f603.png", "Grinning_Face_with_Big_Eyes"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-smiling-eyes_1f604.png", "Grinning_Face_with_Smiling_Eyes"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/grinning-face-with-smiling-eyes_1f601.png", "Beaming_Face_with_Smiling_Eyes"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-tightly-closed-eyes_1f606.png", "Grinning_Squinting_Face"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-cold-sweat_1f605.png", "Grinning_Face_with_Sweat"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/rolling-on-the-floor-laughing_1f923.png", "Rolling_on_the_Floor_Laughing"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/face-with-tears-of-joy_1f602.png", "Face_with_Tears_of_Joy"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/grinning-face_1f600.png", "Grinning_Face"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth_1f603.png", "Grinning_Face_with_Big_Eyes"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-smiling-eyes_1f604.png", "Grinning_Face_with_Smiling_Eyes"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/grinning-face-with-smiling-eyes_1f601.png", "Beaming_Face_with_Smiling_Eyes"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-tightly-closed-eyes_1f606.png", "Grinning_Squinting_Face"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/smiling-face-with-open-mouth-and-cold-sweat_1f605.png", "Grinning_Face_with_Sweat"],
    //     ["https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/72/apple/237/rolling-on-the-floor-laughing_1f923.png", "Rolling_on_the_Floor_Laughing"],
    // ]

    console.time("Total Worker time: ");
    console.log(pool.stats());

    console.log("Starting Download");

    // console.log(dataNames);
    Promise.all(completeData.map((imgUnit, i) => {
            // let toDownload = false
            // for (let index = 0; index < dataNames.length; index++) {
            //     if(dataNames[index].toLowerCase() == imgUnit[1].toLowerCase()) {
            //         toDownload = true
            //     }
            // }
            // if (toDownload) {
                
            // } else{
            //     return Promise.resolve("Not in Top 200 List");
            // }
            console.log(imgUnit);
            console.log("Returning pool.exec for count: " + i);
            return pool.exec("downloadImg", [imgUnit[0], `newDataset/${imgUnit[1]}/${i.toString()}`, ".jpg", i]);

        })).then(success => {
            console.log("Success");
            console.log(success);
            console.timeEnd("Total Worker time: ");
            console.timeEnd("Time taken for all files: ");
            pool.terminate(true);
        })
        .catch(err => console.log(err));
})();