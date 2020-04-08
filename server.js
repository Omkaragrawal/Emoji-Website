const express = require("express");
const helmet = require('helmet')
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyparser = require('body-parser');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 8080;

const  year = 3.154e+7;
app.use(helmet.hsts({
    maxAge: year
  }))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'UI')));
app.use(express.static(path.join(__dirname, '.well-known')));
app.use(compression());
app.use(function(request, response, next){
    if(!request.secure){
      response.redirect("https://" + request.headers.host + request.url);
    }
    else {
        next();
    }
  });

app.listen(port, () => {
    console.log(`App started at ${port}`);
})

app.all('/.well-known/pki-validation/', (req, res) => {
    res.sendFile(path.join(__dirname, ".well-known", "pki-validation", "92462F2BCF76C55CE5F9DA7B92646C34.txt"))
});

app.all('/.well-known/pki-validation/92462F2BCF76C55CE5F9DA7B92646C34.txt', (req, res) => {
    res.sendFile(path.join(__dirname, ".well-known", "pki-validation", "92462F2BCF76C55CE5F9DA7B92646C34.txt"))
})

module.exports = app;

// https.createServer({
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem'),
//     passphrase: 'YOUR PASSPHRASE HERE'
// }, app)  git clone \
    // https://github.com/GoogleCloudPlatform/nodejs-docs-samples
// .listen(port);