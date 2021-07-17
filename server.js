const https = require('https');
const fs = require('fs');
const express = require('express');

const { WebhookClient } = require('dialogflow-fulfillment');
const { readExcel } = require('./js/readExcel');
const { tts } = require('./js/tts');

const app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(__dirname));

const options = {
    key: fs.readFileSync('./static/ssl/private.key'),
    cert: fs.readFileSync('./static/ssl/certificate.crt'),
    ca: fs.readFileSync('./static/ssl/ca_bundle.crt'),
}

app.get('/', (req, res) => {
    res.writeHead(200);
    res.render('index');
});

app.post('/webhook', (req, res) => {
    let agent = new WebhookClient({request: req, response: res});
    // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    function storeFunctionHandler(agent) {
        // const allContext = agent.contexts;
        const context = agent.context.get('test-intent-followup');
        // console.log('allContext :' + JSON.stringify(allContext));
        console.log('context: ',context);
        agent.add(`수리를 요청한 프로덕트는 ${context.parameters.productname}이며 
            예약 일자는 ${context.parameters['date-time'].date_time} 입니다.`);
    }

    let intentMap = new Map();
    intentMap.set('test-intent - custom - yes', storeFunctionHandler);
    agent.handleRequest(intentMap);
});



const server = https.createServer(options, app).listen(app.get('port'), () => {
    console.log(`Application Running: https://localhost:${server.address().port}`);
});

(async() => {
    let word_list;
    async function getWords() {
        const filePath = './static/eng-words.xlsx';
        await readExcel(filePath)
            .then((words) => { 
                // console.log(words);
                Promise.all(words.map(word => {
                    let en = word.word_en;
                    tts('en-US', 'FEMALE', en)
                }))
                return words;
            })
            .then((words) => { word_list = words; })
    };

    
    await getWords();
    // console.log(word_list)

    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log(`user connected: ${socket.id}`);

        io.emit('words', word_list);

        socket.on('disconnect', () => {
            console.log('user disconnected: ', socket.id);
        });
    });
})();
