const axios = require('axios').default;
const fs = require('fs');
(
    async () => {
        const {
            data
        } = await axios.get('https://api.github.com/emojis')
        // console.log(Object.entries(data)[0])
        const array = Object.entries(data);

        const emojiArray = [];

        array.forEach(async element => {
            // console.table([element[0], element[1]])
            try {
            const imageData = await axios.get(element[1], {
                responseType: "stream"
            }, (err) => {
                console.log(err)
            });

            fs.mkdirSync('data/' + element[0], {
                recursive: true
            }, err => {
                console.log(err);
            });

            imageData.data.pipe(fs.createWriteStream('data/' + element[0] + "/" + element[0] + ".png"));
        } catch(err) {
            console.error(err);
            exit(0);
        }
        })
    })()