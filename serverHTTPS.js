const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

const http = require('http');

// REDIRECT  HTTP to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log('Redirecting all HTTP traffic to HTTPS');
});

const sslOptions = {
  key: fs.readFileSync('C:/Certbot/live/audio.cruck.store/privkey.pem'), 
  cert: fs.readFileSync('C:/Certbot/live/audio.cruck.store/fullchain.pem'), 
};

const soundsPath = path.join(__dirname, 'sounds');

app.use('/sounds', express.static(soundsPath));

app.get('/sounds', (req, res) => {
  fs.readdir(soundsPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading files');
    }

    const fileLinks = files
      .map((file) => `<li><a href="/sounds/${file}">${file}</a></li>`)
      .join('');
    const html = `
      <html>
        <head>
          <title>Available Audio Files</title>
        </head>
        <body>
          <h1>Available Audio Files</h1>
          <ul>
            ${fileLinks}
          </ul>
        </body>
      </html>
    `;
    res.send(html);
  });
});

const PORT = 443; // Port HTTPS
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Audio server started at https://audio.cruck.store`);
});

/*

TO INSTALL HTTPS YOU NEED DOMAIN
for my exemple its on vps windows i use 

npm install express https fs http

certbot certonly --manual --preferred-challenges dns -d audio.cruck.store

after say yes to all and you will see 


Successfully received certificate.
Certificate is saved at: C:\Certbot\live\audio.cruck.store\fullchain.pem
Key is saved at:         C:\Certbot\live\audio.cruck.store\privkey.pem
This certificate expires on 2025-03-24.
These files will be updated when the certificate renews.

After its good just "node server.js"

enjoy

By the way cert bot for windows :
https://github.com/certbot/certbot/releases/download/v2.9.0/certbot-beta-installer-win_amd64_signed.exe

*/
