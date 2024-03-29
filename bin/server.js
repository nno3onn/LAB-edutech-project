const app = require('../app.js');
const fs = require("fs");
const http = require('http');
const https = require("https");
const webhook = require('../public/js/study/webhook');

/* get fs modules */
// const db = require('../public/js/db.js'); // make tables in SQLite DB
const tts = require('../public/js/study/tts');

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


/* webhook */
app.post("/webhook", (req, res) => {
  webhook(req, res);
});

/* http || https 서버 생성 */
// const server = http.createServer(app)
//   .listen(app.get('port'), () => {
//   console.log(`Application Running: http://localhost:${server.address().port}`);
// });
const server = https.createServer(options, app)
  .listen(app.get("port"), () => {
  console.log(`Application Running: https://localhost:${server.address().port}`);
});

/** make tts files 
*/
(async() => {
  tts.dbToTTS('english', 'FEMALE')
})();

const io = require('socket.io')(server);

app.set('socketio', io);
app.locals.data = { quiz: false };

io.on('connection', async (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on('quiz-init', data => {
    console.log(data)
    const {quiz, present} = data;
    app.locals.data = { quiz, present };
    console.log('quiz-init:', app.locals.data)
  });

  socket.on('quiz-answer', present => {
    app.locals.data.present = present;
    console.log('quiz-answer:', app.locals.data)
  })

  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`);
  });
  // socket.on('logout', (uid) => {
  //   console.log('socket on logout: ', uid);
  //   db.logout(uid);
  // });
});
