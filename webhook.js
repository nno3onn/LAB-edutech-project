const https = require("https");
const fs = require("fs");
const express = require("express");
const path = require("path");
const { WebhookClient } = require("dialogflow-fulfillment");

const options = {
  key: fs.readFileSync("./public/ssl/private.key"),
  cert: fs.readFileSync("./public/ssl/certificate.crt"),
  ca: fs.readFileSync("./public/ssl/ca_bundle.crt"),
};

const app = express();
app.set("port", process.env.PORT || 8080);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/webhook.html"));
});

app.post("/webhook", (req, res) => {
  let agent = new WebhookClient({ request: req, response: res });
  // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  function storeFunctionHandler(agent) {
    const allContext = agent.contexts;
    console.log("allContext :" + JSON.stringify(allContext));

    const context = agent.context.get("time");
    console.log(context)
    // const context = agent.context.get("test-intent-followup");
    // console.log("context: ", context);
    let resrv = new Object();
    resrv.movie = agent.context.get("movie_name-followup").parameters.movie;
    resrv.datetime = context.parameters["date-time"].date_time;
    resrv.seats = context.parameters.seats;
    // resrv.product = context.parameters.productname;
    // resrv.datetime = context.parameters["date-time"].date_time;

    let movieResponse = `${resrv.datetime}에 시작하는 '${resrv.movie}' 영화가 ${resrv.seats}좌석에 예매되었습니다. 즐거운 관람되세요!`;
    // let repairResponse = `수리를 요청한 프로덕트는 ${context.parameters.productname}이며, 예약 일자는 ${context.parameters["date-time"].date_time} 입니다.`;
    io.emit("seats", resrv);
    agent.add(movieResponse);
  }

  let intentMap = new Map();
  intentMap.set("seats", storeFunctionHandler);
  // intentMap.set("test-intent - custom - yes", storeFunctionHandler);
  agent.handleRequest(intentMap);
});

const server = https.createServer(options, app).listen(app.get("port"), () => {
  console.log(
    `Application Running: https://localhost:${server.address().port}`
  );
});

// let resrv = {
//   movie: null,
//   datetime: null,
//   seats: null,
//   set seats(val) {
//     io.emit("seats", val, resrv);
//   },

//   //   set datetime(val) {
//   //     io.emit("resrvTime", val, resrv.product);
//   //   },
// };

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  // io.emit('words', words);

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
  });
});
