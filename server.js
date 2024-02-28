// SSL https
var express = require('express');
var https = require('https');
var fs = require('fs');

const app = express(); 

const httpsPort = 443;

var options = {
    key: fs.readFileSync('C:/sites/ssl/effyaws3.effyjewelry.com-key.pem'),
    cert: fs.readFileSync('C:/sites/ssl/effyaws3.effyjewelry.com-crt.pem')
};

app.enable('trust proxy');

const httpsServer = https.createServer(options, app);

httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS server running on port ${httpsPort}`);
});

// server.listen(443, (req, res, next) => {
//   console.log('Server running on port 443 with SSL');
// });

app.use((req, res, next) => {
    if (req.url === 'effyaws3.effyjewelry.com' && !req.secure){
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    return next();
});