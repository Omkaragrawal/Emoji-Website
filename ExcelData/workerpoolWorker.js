const workerpool = require('workerpool');

const downloadImg = (URL, DIR, FILE_NAME, WORKER_COUNT) => {
    return new Promise(async (resolve, reject) => {
        try {
console.time(`Time taken by WORKER ${WORKER_COUNT}: `);

            console.log("INSIDE OF WORKER THREAD");

            const axios = require('axios');
            const fs = require('fs');
            if (!fs.existsSync(DIR + "/" + FILE_NAME)) {
                const {
                    data
                } = await axios.get(URL, {
                    responseType: "stream"
                });
                fs.mkdirSync(DIR, {
                    recursive: true
                }, err => {
                    console.log(err);
                });
                data.pipe(fs.createWriteStream(DIR + "/" + FILE_NAME));
                console.log("Download Complete of:\t" + DIR + "/" + FILE_NAME);

            } else {
                console.log("Skipping Download of:\t" + FILE_NAME);
            }
            console.timeEnd(`Time taken by WORKER ${WORKER_COUNT}: `);
            console.log("\n");
            resolve("SUCCESS")
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