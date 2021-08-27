const { WebhookClient } = require("dialogflow-fulfillment");

module.exports = webhook = (req, res) => {
  console.log('webhook');
  const io = req.app.get('socketio');
  let agent = new WebhookClient({ request: req, response: res });

  function quizHandler(agent) {
    const { quiz } = req.app.locals.data;
    const answerInit = quiz ? '퀴즈를 시작합니다' : '퀴즈 화면을 띄워주세요.';  
    console.log(quiz, answerInit)
    agent.add(answerInit);
  }

  function quizCustomHandler(agent) {
    const context = agent.context.get("content");

    const h1 = context.parameters.content; // 답
    const { present } = req.app.locals.data;
    console.log('h1: ',h1, '/ present:', present);
    const check = h1===present ? 1 : 0;
    const answer = present 
                    ? check 
                        ? '정답입니다!' 
                        : '다시 풀어보세요.'
                    : '퀴즈 단어를 띄어주세요.';
    
    agent.add(answer);

    io.emit('quiz-correct', check);  // client에서 next page 넘어가기 (Reveal.right())
  }
  
  let intentMap = new Map();
  intentMap.set("quiz", quizHandler);
  intentMap.set("quiz - custom", quizCustomHandler);
  agent.handleRequest(intentMap);
};
