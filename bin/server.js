const app = require('../app');
const fs = require("fs");
const http = require('http');
const https = require("https");

/* get fs modules */
const { ttsEng } = require('../public/js/tts');
// const webhook = require('../public/js/webhook');
// const stt = require('../public/js/stt');
const readExcel = require('../public/js/readExcel');
const { getSheet } = require('../public/js/googleSheets');

/* https ssl */
const options = {
  key: fs.readFileSync("./public/ssl/private.key"),
  cert: fs.readFileSync("./public/ssl/certificate.crt"),
  ca: fs.readFileSync("./public/ssl/ca_bundle.crt"),
};

/**
 * Get port from environment and store in Express.
 */
app.set("port", process.env.PORT || 8080); // express 서버 포트 설정
/* http || https 서버 생성 */
const server = http.createServer(app).listen(app.get('port'), () => {
  console.log(`Application Running: http://localhost:${server.address().port}`);
});
// const server = https.createServer(options, app).listen(app.get("port"), () => {
//   console.log(`Application Running: https://localhost:${server.address().port}`);
// });

/* execute tts english word list */
const sheetData = { keypath: "../grpckey.json",
                    docID: "1Ak7DXz9kBoos5CW8_0aJ77ZeaG_uS_Uk6MGeD10L2Gg",
                    title: "eng"
                  };
const ttsData = { gender: 'FEMALE',
                  lang: 'en-US'
                };

const io = require('socket.io')(server);
io.on('connection', async (socket) => {
  console.log(`user connected: ${socket.id}`);

  await ttsEng(sheetData, ttsData)
    .then((wordList) => {
      console.log(wordList)
      socket.emit('words', wordList);
    });

  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`);
  })
});
