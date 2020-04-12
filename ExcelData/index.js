const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
// const util = require('util');
const axios = require('axios').default;

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

const downloadImage = async (link, dir, file) => {
    try{
        if(!fs.existsSync(dir + "/" + file)) {
    const {
        data
    } = await axios.get(link, {
        responseType: "stream"
    });
    fs.mkdirSync(dir, {
        recursive: true
    }, err => {
        console.log(err);
    });
    data.pipe(fs.createWriteStream(dir + "/" + file));
} else {
    console.log("Skipping Download of:\t" + file + "\n")
}
} catch(err) {
    console.log(err)
}
}
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

    for (let i = 0; i<files.length; i++) {
        let tempData = await data(files[i])
        // console.log(tempData[3])
        // tempData = ;
        // console.log(tempData[5]);
        completeData =  completeData.concat(tempData.slice(1).map(unit => [unit[0], unit[1].split(' ').join('_')]));
        console.log(completeData.length)
    }
    console.log(completeData.length)

    for(let i = 0; i< completeData.length; i++) {
        console.log(`Downloading image ${i+1} / ${completeData.length}: \t ${completeData[i][1]}`);
        await downloadImage(completeData[i][0], 'dataset/' + completeData[i][1] , i.toString() + ".png")
        // await downloadImage(completeData[i][0], 'dataset/' + completeData[i][1] , )
    }


    // fs.writeFileSync('appleEmojiJSON1.json', JSON.stringify({
    //     "content": completeData
    // }));
})()