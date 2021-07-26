// const { WebhookClient } = require("dialogflow-fulfillment");

// module.exports = webhook = (req, res, intentName, contextName) => {
//   let agent = new WebhookClient({ request: req, response: res });
//   // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
//   // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
//   function storeFunctionHandler(agent) {
//     // const allContext = agent.contexts;
//     // console.log("allContext :" + JSON.stringify(allContext));
//     const context = agent.context.get(contextName);
//     // const context = agent.context.get("test-intent-followup");
//     // console.log("allContext :" + JSON.stringify(allContext));
//     console.log("context: ", context);
//     const response = `${context.parameters["date-time"].date_time}에 시작하는 '${context.parameters.movie}' 영화가 ${context.parameters.seats}좌석에 예매되었습니다. 즐거운 관람되세요!`;
//     agent.add(response);
//   }

//   let intentMap = new Map();
//   intentMap.set(intentName, storeFunctionHandler);
//   agent.handleRequest(intentMap);
// };
