const { WebhookClient } = require("dialogflow-fulfillment");

module.exports = webhook = (request, response) => {
  let agent = new WebhookClient({ request, response });
  // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
  function quizHandler(agent) {
    // const allContext = agent.contexts;
    // console.log("allContext :" + JSON.stringify(allContext));
    const context = agent.context.get("quiz");
    // const context = agent.context.get("test-intent-followup");
    // console.log("Context :" + JSON.stringify(context));
    console.log("context: ", context);

    const response = '';
    agent.add(response);
  }

  let intentMap = new Map();
  intentMap.set("quiz - custom", quizHandler);
  agent.handleRequest(intentMap);
};




