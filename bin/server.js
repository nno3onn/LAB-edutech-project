const app = require('../app');
const path = require('path');
const fs = require("fs");
const http = require('http');
const https = require("https");
const dotenv = require('dotenv');

/** .env 파일 자동으로 인식하여 환경변수 설정하기
 */
dotenv.config();

/* get fs modules */
const db = require('../public/js/db.js'); // make tables in SQLite DB
const { ttsEng } = require('../public/js/study/tts');
// const stt = require('../publicjs/study/stt');
// const webhook = require('../public/js/webhook');
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
// const server = http.createServer(app).listen(app.get('port'), () => {
//   console.log(`Application Running: http://localhost:${server.address().port}`);
// });
const server = https.createServer(options, app).listen(app.get("port"), () => {
  console.log(`Application Running: https://localhost:${server.address().port}`);
});

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

  let wordList;

  /** make tts datas */
  await ttsEng(sheetData, ttsData)
  .then(({ wordList, wordHead}) => {
    db.insertWordHead('studyEng', wordHead);
    wordList = wordList;
  });

  

  /* display studyList in Reveal.js */
  socket.on('access-page', async (page) => {
    switch (page) {
      case '/study/study':
        socket.emit('wordList', wordList);
    }
  });

  /** STUDY SCREEN
  * 
  */
  /* count o,x */
  socket.on('study-oxCount', (id, check) => {
    console.log(id, check);

  });


  /** QUIZ SCREEN
   * 
   */
  socket.on('disconnect', () => { console.log(`user disconnected: ${socket.id}`);
  });
});
