const { WebhookClient } = require("dialogflow-fulfillment");

module.exports = webhook = (req, res) => {
  const io = req.app.get('socketio');

  let agent = new WebhookClient({ request: req, response: res });
  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

  function quizHandler(agent) {
    const allContext = agent.contexts;
    console.log("allContext :" + JSON.stringify(allContext));
    const context = agent.context.get("quiz");
    console.log("Context :" + JSON.stringify(context));
    console.log("context: ", context);
    console.log('parameters:', context.parameters);

    const h1 = ''; // 답

    io.on('connection', (socket) => {
      io.to(socket.id).emit('quiz', h1);
      socket.on('quiz-answer', response => agent.add(response));
    });


  }

  let intentMap = new Map();
  intentMap.set("quiz - custom", quizHandler);
  agent.handleRequest(intentMap);
};




