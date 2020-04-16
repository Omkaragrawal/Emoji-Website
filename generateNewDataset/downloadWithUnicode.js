const workerpool = require('workerpool');
const axios = require('axios').default;
const fs = require('fs');

console.time("Time taken for all files: ");

const pool = workerpool.pool(__dirname + '/downloadGoogleTelegram-worker.js', {
    minWorkers: "max",
    workerType: "thread"
});
const files = ["./ImageNew-Google.xlsx", "./Messengericons1.xlsx"];
// const files = ["./Messengericons1.xlsx"];

//---------------------------------------------------------------------------------------------------------------------

(async _ => {
    //-------------------------GET ALL THE FILE LINKS AND CODES------------------------------------------------
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
        })["Sheet1"].map((val, index) => [val["URL"], val["FILE"], currVal.replace('./', '')]);

        accumulator = accumulator.concat(result.map((resultCurrVal) => {
            return [resultCurrVal[0], resultCurrVal[1].toLowerCase(), resultCurrVal[2]]
        }));
        console.log(accumulator.length);
        // accumulator[1e3 * currIndex];
        return accumulator
    }, []);

    //-------------------------------------FILTER ONLY PNG FILES------------------------------------------------------    
    completeData = completeData.filter((imgUnit) => {
        return (!imgUnit[0].endsWith(".png")) ? false : true
    });

    completeData.slice(2e3, 2030);

    //------------------------------------------GET TO 200 EMOJI LIST--------------------------------------------------
    let {
        data
    } = await axios.get("http://www.emojitracker.com/api/rankings", {
        responseType: "json"
    });

    console.log(data.length);

    data = data.sort((a, b) => {
        a = a.score;
        b = b.score;
        return b - a;
    }).slice(0, 200);

    const topEmojiIds = data.map(emojiDeatils => {
        return [emojiDeatils.id.toLowerCase(), emojiDeatils.char];
    });

    // console.log(topEmojiIds);

    //-------------------------------------------------Writinng topEmoji.json-------------------------------------------

    fs.writeFileSync("./../ExcelData/topEmojis.json", JSON.stringify({"top200": data}));

    //----------------------------------------------------Start Fetching------------------------------------------------
    let allTrue = []
    Promise.all(completeData.map((imgUnit, i) => {
            let toDownload = false
            for (let i = 0; i < topEmojiIds.length; i++) {
                // if(imgUnit[1].includes(topEmojiIds[i][0]) || imgUnit[1].includes(topEmojiIds[i][1])) {
                //     // console.log(imgUnit, topEmojiIds[i]);
                //     toDownload = true
                //     break;
                // }

                if (imgUnit[1] == topEmojiIds[i][0] || imgUnit[1] == topEmojiIds[i][1]) {
                    // console.log(imgUnit, topEmojiIds[i]);
                    toDownload = true
                    break;
                }

                // if(imgUnit[0].includes(topEmojiIds[i][0]) || imgUnit[0].includes(topEmojiIds[i][1])) {
                //     // console.log(imgUnit, topEmojiIds[i]);
                //     toDownload = true
                //     break;
                // }

                // if(similar(imgUnit[1], topEmojiIds[i][0]) >= 60) {
                //         console.log(imgUnit, topEmojiIds[i]);
                //         toDownload = true
                //         break;
                // }

                // if(imgUnit[0].contains(topEmojiIds[i][0])) {
                //     console.log(imgUnit, topEmojiIds[i]);
                //         toDownload = true
                //         break;
                // }

            }

            // return (toDownload)? Promise.resolve("DOWNLOADED"): Promise.resolve("Not in top 200 list");

            if (!toDownload) {
                return Promise.resolve("Not in top 200 list");
            }

            console.log(imgUnit);
            console.log("Returning pool.exec for count: " + i);
            return pool.exec("downloadImg", [imgUnit[0], `topEmojiDataset/${imgUnit[2].split(".xlsx")[0]}/${imgUnit[1]}`, ".png", i]);

        }))
        .then(success => {
            console.log("Inside .then");
            console.log("Success");
            pool.terminate(true);
            allTrue = allTrue.concat(success.filter((val) => {
                return val == "SUCCESS"
            }));

            console.log(allTrue.length);
            console.timeEnd("Total Worker time: ");
            console.timeEnd("Time taken for all files: ");
        })
        .catch(err => {
            console.log("Inside .catch");

            allTrue = allTrue.concat(err.filter((val) => {
                return val == "DOWNLOADED"
            }));

            console.log(allTrue);
        });



})()