const mergeImg = require('merge-img');
const Jimp = require("jimp");
const fs = require('fs');

// mergeImg(["./1f606.png", "./1f606.png", "./1f606.png", "./1f606.png", "./1f606.png", "./1f606.png"], {
//     offset: 5,
//     direction: false,
//     color: 0xffffff01
// }).then ( img1 => {
//     mergeImg(["./1f606.png", "./1f606.png", "./1f606.png", "./1f606.png", "./1f606.png", "./1f606.png"], {
//         offset: 5,
//         direction: false,
//         color: 0xffffff01
//     }). then ( img2 => {
//         mergeImg([img1, img2], {
//             direction: true,
//         color: 0xffffff01
//         }).then(imgFinal => {
//             imgFinal.write('unicode.jpg', () => console.log("Done"))
//         }) .catch( err => console.log(err));
//     }).catch( err => console.log(err));
// }) .catch( err => console.log(err));


// (async () => {
//     try {
//         const image = await Jimp.read('./1f606.png');

//         await image.resize(125, 125).background(0xffffffff);

//         await image.writeAsync('./1f606(trial).jpg');

//         const mergedImg = await mergeImg(['./1f606(trial).jpg', './1f606(trial).jpg', './1f606(trial).jpg', './1f606(trial).jpg', './1f606(trial).jpg', './1f606(trial).jpg'], {
//             offset: 5,
//             direction: false,
//             color: 0xffffff01
//         });
//         await mergedImg;
//         const finalImg = await mergeImg([mergedImg, mergedImg, mergedImg, mergedImg, mergedImg], {
//             direction: true,
//             color:0xffffff01
//         });

//         await finalImg.write("./1f606(final).jpg", _ => console.log("DONE"));
//         await finalImg.write("./1f606(final-1).jpg", _ => console.log("DONE"));
//     } catch (err) {
//         console.log(err)
//     }

// })()

(async _ =>{
    const dir1 = './topEmojiDataset/ImageNew-Google/'
    const dir2 = './topEmojiDataset/Messengericons1/'
    const saveDir = './topSelected/'
    let topList = JSON.parse(fs.readFileSync('./todownload.json'))["top200"].filter(imgUnit => {
        if (fs.existsSync(dir1 + imgUnit.id.toLowerCase() + ".png") && (fs.existsSync(dir2 + imgUnit.id.toLowerCase() + ".png"))) {
            return true;
        } else {
            return false;
        }
    }).map(imgUnit => imgUnit.id.toLowerCase())

    try {
        for (let i = 0; i < topList.length; i++) {
            const image1 = await Jimp.read(dir1 + topList[i] + '.png');
            const image2 = await Jimp.read(dir2 + topList[i] + '.png');

            await image1.resize(125, 125).background(0xffffffff);
            await image2.resize(125, 125).background(0xffffffff);

            await image1.writeAsync(saveDir + topList[i] + '/' + topList[i] + '(google).jpg');
            await image2.writeAsync(saveDir + topList[i] + '/' + topList[i] + '(Messenger).jpg');

            const mergedImg1_0 = await mergeImg([
                saveDir + topList[i] + '/' + topList[i] + '(google).jpg', saveDir + topList[i] + '/' + topList[i] + '(Messenger).jpg',
                saveDir + topList[i] + '/' + topList[i] + '(google).jpg', saveDir + topList[i] + '/' + topList[i] + '(Messenger).jpg',
                saveDir + topList[i] + '/' + topList[i] + '(google).jpg', saveDir + topList[i] + '/' + topList[i] + '(Messenger).jpg'
            ], {
                offset: 5,
                direction: false,
                color: 0xffffff01
            });
            const mergedImg1_1 = await mergeImg([
                saveDir + topList[i] + '/' + topList[i] + '(Messenger).jpg', saveDir + topList[i] + '/' + topList[i] + '(google).jpg',
                saveDir + topList[i] + '/' + topList[i] + '(Messenger).jpg', saveDir + topList[i] + '/' + topList[i] + '(google).jpg',
                saveDir + topList[i] + '/' + topList[i] + '(Messenger).jpg', saveDir + topList[i] + '/' + topList[i] + '(google).jpg'
            ], {
                offset: 5,
                direction: false,
                color: 0xffffff01
            });

            await mergedImg1_0;
            await mergedImg1_1;

            const finalImg = await mergeImg([mergedImg1_0, mergedImg1_1, mergedImg1_0, mergedImg1_1, mergedImg1_0], {
                direction: true,
                color: 0xffffff01
            });
            const finalImg1 = await mergeImg([mergedImg1_1, mergedImg1_0, mergedImg1_1, mergedImg1_0, mergedImg1_0], {
                direction: true,
                color: 0xffffff01
            });

            await finalImg.write(saveDir + topList[i] + '/' + topList[i] + '(final).jpg', _ => console.log("DONE" + i + "- 0"));
            await finalImg1.write(saveDir + topList[i] + '/' + topList[i] + '(final-1).jpg', _ => console.log("DONE" + i + "- 1"));

            fs.unlinkSync(saveDir + topList[i] + '/' + topList[i] + '(google).jpg');
            fs.unlinkSync(saveDir + topList[i] + '/' + topList[i] + '(Messenger).jpg');

        }
    } catch (err) {
        console.log(err)
    };

    console.log(topList.length);
})()