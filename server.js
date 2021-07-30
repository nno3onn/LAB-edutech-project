const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const app = express();

/* https ssl */
const options = {
  key: fs.readFileSync("./public/ssl/private.key"),
  cert: fs.readFileSync("./public/ssl/certificate.crt"),
  ca: fs.readFileSync("./public/ssl/ca_bundle.crt"),
};

const { ttsEng } = require("./public/js/tts");
const readExcel = require("./js/readExcel"); // read word list by excel file
const { getSheet } = require("./public/js/googleSheets"); // read word list by googlesheets
const webhook = require("./public/js/webhook");

app.set("port", process.env.PORT || 8080); // express 서버 포트 설정
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static(__dirname));


/* 서버 생성 */
const server = http.createServer(app).listen(app.get('port'), () => {
  console.log(`Application Running: http://localhost:${server.address().port}`);
})

const server = https.createServer(options, app).listen(app.get("port"), () => {
  console.log(`Application Running: https://localhost:${server.address().port}`);
});

// const server = app.listen(app.get("port"), () => {
//   console.log(`Application Running: http://localhost:${server.address().port}`);
// });

/* 라우팅 모듈 선언 */
const routes = require('./routes');

/* request 요청 url와 처리 로직을 선언한 라우팅 모듈 매핑 */
app.use('/', routes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages'+'/home/index.html');
})
app.get('/study', async(req, res) => {
  res.sendFile(__dirname + '/pages/learn/study.html');
});
app.get('/quiz', (req, res) => {
  res.sendFile(__dirname + '/pages/learn/quiz.html');
});
app.get('/mypage', (req, res) => {
  res.sendFile(__dirname + '/pages/user/mypage.html');
});
app.get('/myChart', (req, res) => {
  res.sendFile(__dirname + '/pages/user/mychart.html');
})
app.post("/webhook", (req, res) => {
webhook(req, res, "seats", "seats");
});


function readGSSWords() {
  return new Promise(async (resolve, reject) => {
    let sheet = await getSheet("../grpckey.json",
                          "1Ak7DXz9kBoos5CW8_0aJ77ZeaG_uS_Uk6MGeD10L2Gg",
                          "eng");
    await sheet.getRows()
    .then((rows) => {
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
    const filePath = "./public/eng-words.xlsx";
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

chartData = async () => {
  let sheet = await getSheet("../grpckey.json",
                      "12-26cUuMVPdTMQfOwrYyhDB6xRdBPCNAVJDEuEk-W5Y",
                      "day1");
  return sheet.getRows();
}

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  socket = socket;
  console.log(`user connected: ${socket.id}`);

  socket.on('study', async () => {
    const sheetData = { keypath: "../grpckey.json",
                        docID: "1Ak7DXz9kBoos5CW8_0aJ77ZeaG_uS_Uk6MGeD10L2Gg",
                        title: "eng"
                      };
    const ttsData = { gender: 'FEMALE',
                      lang: 'en-US'
                    };
                    
    // await readGSSWords()
  await ttsEng(sheetData, ttsData)
    .then((words) => {
      socket.emit("words", words);
    });
  });

  socket.on('word-count', async (n, score) => {
    console.log(n, score);

    sheet = await getSheet("../grpckey.json",
            "12-26cUuMVPdTMQfOwrYyhDB6xRdBPCNAVJDEuEk-W5Y",
            "day1");
    await sheet.getRows()
    .then(async (rows) => {
      count = (score ? (rows[n].o) : (rows[n].x));
      if(!count) { 
        count = 0; 
      }
      score 
        ? rows[n].o = ++count
        : rows[n].x = ++count;
      console.log(count)
      await rows[n].save();
      
      chartData()
        .then(async (rows) => {
          let arr = [];
          await rows.forEach((row) => {
            arr.push([row.word, row.o, row.x]);
          });
          console.log(arr);
          socket.emit('mychart', arr);
        });
    });
  });


  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
  });
});
