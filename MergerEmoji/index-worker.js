const workerpool = require('workerpool');

const downloadImg = (UNICODE, WORKER_COUNT) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dir1 = './topEmojiDataset/ImageNew-Google/'
            const dir2 = './topEmojiDataset/Messengericons1/'
            const dir3 = './topEmojiDataset/appleunicode/'
            const dir4 = './topEmojiDataset/SamsungUnicode/'
            const saveDir = './topSelected/'
            console.time(`Time taken by WORKER ${WORKER_COUNT}: `);
            console.log("INSIDE OF WORKER THREAD");

            const Jimp = require("jimp");
            const fs = require('fs');
            const mergeImg = require('merge-img');

            const image1 = await Jimp.read(dir1 + UNICODE + '.png');
            const image2 = await Jimp.read(dir2 + UNICODE + '.png');
            const image3 = await Jimp.read(dir3 + UNICODE + '.png');
            const image4 = await Jimp.read(dir4 + UNICODE + '.png');

            await image1.resize(125, 125).background(0xffffffff);
            await image2.resize(125, 125).background(0xffffffff);
            await image3.resize(125, 125).background(0xffffffff);
            await image4.resize(125, 125).background(0xffffffff);

            await image1.writeAsync(saveDir + UNICODE + '/' + UNICODE + '(google).jpg');
            await image2.writeAsync(saveDir + UNICODE + '/' + UNICODE + '(Messenger).jpg');
            await image3.writeAsync(saveDir + UNICODE + '/' + UNICODE + '(apple).jpg');
            await image4.writeAsync(saveDir + UNICODE + '/' + UNICODE + '(samsung).jpg');

            const mergedImg1_0 = await mergeImg([
                saveDir + UNICODE + '/' + UNICODE + '(google).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(Messenger).jpg', 
                saveDir + UNICODE + '/' + UNICODE + '(apple).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(samsung).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(google).jpg', 
                saveDir + UNICODE + '/' + UNICODE + '(Messenger).jpg'
            ], {
                offset: 5,
                direction: false,
                color: 0xffffff01
            });
            const mergedImg1_1 = await mergeImg([
                saveDir + UNICODE + '/' + UNICODE + '(Messenger).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(apple).jpg', 
                saveDir + UNICODE + '/' + UNICODE + '(samsung).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(google).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(Messenger).jpg', 
                saveDir + UNICODE + '/' + UNICODE + '(google).jpg',
            ], {
                offset: 5,
                direction: false,
                color: 0xffffff01
            });
            const mergedImg1_2 = await mergeImg([
                saveDir + UNICODE + '/' + UNICODE + '(apple).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(samsung).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(google).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(Messenger).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(apple).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(samsung).jpg'
            ], {
                offset: 5,
                direction: false,
                color: 0xffffff01
            });
            const mergedImg1_3 = await mergeImg([
                saveDir + UNICODE + '/' + UNICODE + '(samsung).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(google).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(Messenger).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(apple).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(samsung).jpg',
                saveDir + UNICODE + '/' + UNICODE + '(apple).jpg'
            ], {
                offset: 5,
                direction: false,
                color: 0xffffff01
            });

            await mergedImg1_0;
            await mergedImg1_1;
            await mergedImg1_2;
            await mergedImg1_3;

            const finalImg = await mergeImg([mergedImg1_0, mergedImg1_1, mergedImg1_2, mergedImg1_3, mergedImg1_0], {
                direction: true,
                color: 0xffffff01
            });
            const finalImg1 = await mergeImg([mergedImg1_1, mergedImg1_2, mergedImg1_3, mergedImg1_0, mergedImg1_1], {
                direction: true,
                color: 0xffffff01
            });
            const finalImg2 = await mergeImg([ mergedImg1_2, mergedImg1_3, mergedImg1_0, mergedImg1_1, mergedImg1_2], {
                direction: true,
                color: 0xffffff01
            });
            const finalImg3 = await mergeImg([mergedImg1_3, mergedImg1_0, mergedImg1_1,  mergedImg1_2, mergedImg1_3], {
                direction: true,
                color: 0xffffff01
            });

            await finalImg.write(saveDir + UNICODE + '/' + UNICODE + '(final).jpg', _ => console.log("DONE" + WORKER_COUNT + "- 1"));
            await finalImg1.write(saveDir + UNICODE + '/' + UNICODE + '(final-1).jpg', _ => console.log("DONE" + WORKER_COUNT + "- 2"));
            await finalImg2.write(saveDir + UNICODE + '/' + UNICODE + '(final-2).jpg', _ => console.log("DONE" + WORKER_COUNT + "- 3"));
            await finalImg3.write(saveDir + UNICODE + '/' + UNICODE + '(final-3).jpg', _ => console.log("DONE" + WORKER_COUNT + "- 4"));

            fs.unlink(saveDir + UNICODE + '/' + UNICODE + '(google).jpg', _ => {});
            fs.unlink(saveDir + UNICODE + '/' + UNICODE + '(Messenger).jpg', _ => {});
            fs.unlink(saveDir + UNICODE + '/' + UNICODE + '(apple).jpg', _ => {});
            fs.unlink(saveDir + UNICODE + '/' + UNICODE + '(samsung).jpg', _ => {});

            console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);
            console.log("\n");
            resolve("SUCCESS");
        } catch (err) {
            console.log(err);
            console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);
            reject(err);
        }
    });
}

workerpool.worker({
    downloadImg: downloadImg
});