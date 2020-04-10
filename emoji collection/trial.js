const fs = require('fs');
const axios = require('axios').default;

// fs.mkdirSync('data', {recursive: true}, (err) => {
//     console.log(err);
// });

(async () => {
    const {
        data
    } = await axios.get('https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png?v8', {
        responseType: "stream"
    });

    data.pipe(fs.createWriteStream('data/abc.png'));
})()