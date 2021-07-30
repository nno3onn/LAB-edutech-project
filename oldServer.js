const https = require("https");
const fs = require("fs");
const express = require("express");

const tts = require("./js/tts");
// const readExcel = require("./js/readExcel");
const spreadSheet = require("./js/spreadSheet");
const webhook = require("./js/webhook");

const mainRouter = require('./routes/main');
const studyRouter = require('./routes/study');
const quizRouter = require('./routes/quiz');

const options = {
  key: fs.readFileSync("./static/ssl/private.key"),
  cert: fs.readFileSync("./static/ssl/certificate.crt"),
  ca: fs.readFileSync("./static/ssl/ca_bundle.crt"),
};

const app = express();
app.set("port", process.env.PORT || 8080);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

app.get("/", (req, res) => {
  res.render("index");
});

app.use('/main', mainRouter);
app.use('/study', studyRouter);
app.use('/quiz', quizRouter);

// app.post("/webhook", (req, res) => {
// webhook(req, res, "seats", "seats");
// });

const server = https.createServer(options, app).listen(app.get("port"), () => {
  console.log(
    `Application Running: https://localhost:${server.address().port}`
  );
});

// const server = app.listen(app.get("port"), () => {
//   console.log(`Application Running: http://localhost:${server.address().port}`);
// });

function readGSSWords() {
  return new Promise(async (resolve, reject) => {
    await spreadSheet(
      "../grpckey.json",
      "1Ak7DXz9kBoos5CW8_0aJ77ZeaG_uS_Uk6MGeD10L2Gg",
      "eng"
    ).then((rows) => {
      let words = [];

      Promise.all(
        rows.map(async (row) => {
          const word = row.word;
          const mean1 = row.mean1;
          const mean2 = row.mean2;
          const mean3 = row.mean3;
          words = words.concat([{ word, mean1, mean2, mean3 }]);
          await tts("en-US", "FEMALE", word);
        })
      );

      console.log("finished TTS.");
      resolve(words);
    });
  });
}

function getWords() {
  return new Promise(async (resolve, reject) => {
    const filePath = "./static/eng-words.xlsx";
    await readExcel(filePath).then((words) => {
      // console.log(words);
      Promise.all(
        words.map((word) => {
          let en = word.word_en;
          tts("en-US", "FEMALE", en);
        })
      );
      resolve(words);
    });
  });
}

(async () => {
  // const words = await getWords(); // get excel file
  const words = await readGSSWords(); // get google spreadsheet

  const io = require("socket.io")(server);
  io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);

    io.emit("words", words);

    socket.on("disconnect", () => {
      console.log("user disconnected: ", socket.id);
    });
  });
})();