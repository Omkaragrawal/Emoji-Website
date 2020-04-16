const workerpool = require('workerpool');

const downloadImg = (URL, FILE_NAME, fileExtension, WORKER_COUNT) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.time(`Time taken by WORKER ${WORKER_COUNT}: `);
            console.log("INSIDE OF WORKER THREAD");

            const Jimp = require("jimp");
            const fs = require('fs');
            if (!fs.existsSync(FILE_NAME)) {
                console.log("Downloading in worker " + WORKER_COUNT + "  file:\t" + FILE_NAME + fileExtension);
                Jimp.read(URL)
                    .then(image => {
                        console.log("Image read successfull")
                        image
                            .quality(100)
                            .write(FILE_NAME + fileExtension);
                            console.log("Rewriting image 50 more times");
                        for (let index = 0; index < 50; index++) {
                            image.quality(100).write(FILE_NAME + "(" + index.toString() + ")" + fileExtension);
                        }
                        console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);
                        resolve("SUCCESS");

                    })
                    .catch(err => {
                        console.log("Image creation failed");
                        console.log(err)
                        // console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);
                        console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);
                        reject(err);
                    });
            } else {
                console.log("Skipping Download of:\t" + FILE_NAME);
                console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);
                resolve("SUCCESS");
            }
            // console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);
            console.log("\n");
        } catch (err) {
            console.log(err);
            console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);

            // console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);
            reject(err);
        }
    });
}

workerpool.worker({
    downloadImg: downloadImg
});