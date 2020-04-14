const workerpool = require('workerpool');
const axios = require('axios').default;


console.time("Time taken for all files: ");


const pool = workerpool.pool(__dirname + '/workerpoolWorker.js', {
    minWorkers: "max",
    workerType: "thread"
});

const files = ["./AppleEmojiListEmoji.xlsx", "./GoogleEmojiListEmoji.xlsx", "./FacebookEmojiListEmoji.xlsx"];

(async () => {
    let completeData = files.reduce((accumulator, currVal, currIndex) => {
        if (typeof (accumulator) != "object") {
            console.log(accumulator)
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

        console.log(result[20]);

        accumulator = accumulator.concat(result.map((unit, index) => {
            // if(index == 1e3) {
            //     console.log(unit[1].split(" ").join("_").split("'").join("").split(':').join(""));
            // }
            return [unit[0], unit[1].split(" ").join("_").split("'").join("").split(':').join("")]
        }));
        console.log(accumulator.length);
        accumulator[1e3 * currIndex];
        return accumulator
    }, []);

    completeData = completeData.filter((imgUnit) => {
        return (!imgUnit[0].endsWith(".png")) ? false : true
    });
    console.log(completeData.length);
    console.log(completeData[1.5e3]);
    //-----------------------------------------------------------------------------------------------------------------
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

    const dataNames = data.map((emojiData) => {
        emojiData.name = emojiData.name.split(" ").join("_").split("'").join("").split(':').join("");
    })
    //----------------------------------------------------------------------------------------------------------------

    console.time("Total Worker time: ");

    console.log("Starting Download");

    const fgh = ["uhasu", "jiu"]

    Promise.all(completeData.map((imgUnit, i) => {
            if (!dataNames.includes(imgUnit[1])) {
                return Promise.resolve("Not in Top 200 List")
            }
            console.log("Returning pool.exec for count: " + i);
            return pool.exec("downloadImg", [imgUnit[0], `newDataset/${imgUnit[1]}/${i.toString()}`, ".jpg"]);
        })).then(success => {
            console.log("Success");
            console.log(success);
            console.timeEnd("Total Worker time: ");
            console.timeEnd("Time taken for all files: ");
            pool.terminate(true);
        })
        .catch(err => console.log(err));
})();