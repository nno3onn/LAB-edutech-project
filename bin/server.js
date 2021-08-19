const app = require('../app.js');
const path = require('path');
const fs = require("fs");
const http = require('http');
const https = require("https");

/* get fs modules */
const db = require('../public/js/db.js'); // make tables in SQLite DB
const tts = require('../public/js/study/tts');
// const stt = require('../publicjs/study/stt');
// const webhook = require('../public/js/webhook'); // quiz
// const { getSheet } = require('../public/js/googleSheets');

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
// const server = http.createServer(app)
//   .listen(app.get('port'), () => {
//   console.log(`Application Running: http://localhost:${server.address().port}`);
// });
const server = https.createServer(options, app)
  .listen(app.get("port"), () => {
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

/** make tts files 
*/
// let wordList;
// (async() => {
  // tts.tts('en-US', 'FEMALE', 'hello world');
  //  .then(a => console.log(a))
  // await ttsEng(sheetData, ttsData)
  // .then((data) => {
    // db.insertWordHead('studyEng', wordHead);
    // wordList = data.wordList;
  // });
// })();

const io = require('socket.io')(server);

app.set('socketio', io);
io.on('connection', async (socket) => {
  console.log(`user connected: ${socket.id}`);

  /* display studyList in Reveal.js */
  // socket.on('access-page', async (page) => {
  //   switch (page) {
  //     case '/study/study':
  //       socket.emit('wordList', wordList);
  //   }
  // });

  /** LOGIN SCREEN
   * 
   */
  // /* get user data */
  // socket.on('login', (user) => {
  //   const { uid, email, providerData, lastLoginAt, createdAt } = user;
  //   const providerId = providerData[0].providerId.split('.')[0];
  //   console.log('login data:',uid, email, providerId, lastLoginAt, createdAt);

  //   // db.
  // });

  // /** STUDY SCREEN
  // * 
  // */
  // /* count o,x */
  // socket.on('study-oxCount', (id, check) => {
  //   console.log('study-oxcount: id-',id, 'check-',check);
  // });


  // /** QUIZ SCREEN
  //  * 
  //  */
  // socket.on('disconnect', () => { console.log(`user disconnected: ${socket.id}`);
  
  // });
});

