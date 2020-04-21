// const dir1 = './topEmojiDataset/ImageNew-Google/'
// const dir2 = './topEmojiDataset/Messengericons1/'
// const dir3 = './topEmojiDataset/appleunicode/'
// const dir4 = './topEmojiDataset/SamsungUnicode/'

const fs = require('fs');

// let topList = JSON.parse(fs.readFileSync('./todownload.json'))["top200"].filter(imgUnit => {
//     if (fs.existsSync(dir1 + imgUnit.id.toLowerCase() + ".png") && (fs.existsSync(dir2 + imgUnit.id.toLowerCase() + ".png")) && (fs.existsSync(dir3 + imgUnit.id.toLowerCase() + ".png")) && (fs.existsSync(dir4 + imgUnit.id.toLowerCase() + ".png"))) {
//         return true;
//     } else {
//         return false;
//     }
// }).map(imgUnit => imgUnit.id.toLowerCase());

// let totalList = JSON.parse(fs.readFileSync('./todownload.json'))["top200"]

// console.log(topList.length);
// console.log(totalList.length);

fs.unlink('./topSelected.zip', param => console.log(param));