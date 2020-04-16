const axios = require('axios');
const fs = require('fs');
const util = require("util");

(async () => {
    let {
        data
    } = await axios.get("http://www.emojitracker.com/api/rankings", {
        responseType: "json"
    });

    // console.log(data.length);

    data = data.sort((a, b) => {
        a = a.score;
        b = b.score;
        return b - a;
    }).slice(0, 100);

    const dataNames = data.map((emojiData) => {
        const name = emojiData.name.split(" ").join("_").split("'").join("").split(':').join("");
        return name.toLowerCase();
    });

    // console.log(dataNames);
    let toSaveDir = [];
    const directories = fs.readdir("./newDataset", (err, files) => {
        // console.log(util.inspect(files));

        files = files.map(dirName => dirName.toLowerCase())
        // toSaveDir = dataNames.map(name => {
        //     return files.find(name.toLowerCase());
        // });
        
        // toSaveDir = dataNames.map(emoji => {
        //     console.log(emoji.toLowerCase())
        //     files.findIndex(dir => {
        //         console.log(dir.toLowerCase())
        //         emoji.toLowerCase() == dir.toLowerCase()
        //     });

    // });
        let abc = files.filter((val) => {
            console.log(val)
            for (let i = 0; i < dataNames.length; i++) {
                if (val.contains(dataNames[i])) {
                    toSaveDir.push(val);
                    return true;
                }
            }
        });

        console.log("ABC:")
        console.log(abc);

        console.log("\n\n\n toSaveDir");
        //     dataNames.forEach((element) => {
        //         for(let i = 0; i< files.length; i++) {
        //             if (files[i].includes(element)) {
        //                 toSaveDir.push(files[i])
        //             }
        //         }
        //     });
        
        console.log(toSaveDir);
        });





    // console.log(toSaveDir.length);
    // fs.writeFileSync("./abc.json", JSON.stringify(toSaveDir));
})()
// console.log(util.inspect(directories));