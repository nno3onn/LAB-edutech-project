const express = require('express');
const router = express.Router();

const db = require('../public/js/db.js'); // make tables in SQLite DB
const studyList = require('../public/js/study/studyList.js')
// const { ttsEng, dbToTTS } = require('../public/js/study/tts');

/* execute tts english word list */
const sheetData = { keypath: "../grpckey.json",
                    docID: "1Ak7DXz9kBoos5CW8_0aJ77ZeaG_uS_Uk6MGeD10L2Gg",
                    title: "eng"
                  };
const ttsData = { gender: 'FEMALE',
                  lang: 'en-US'
                };

/* study page */
// router.get('/study', (req, res, next) => {
//   // let io = req.app.get('socketio');

//   // io.on('connection', async (socket) => {
//   // });
//   res.render('study');
// });                

router.get('/study', async (req, res, next) => {
  // const list = await studyList('english');
  const list = await studyList('bible');
  // console.log(list)

  let io = req.app.get('socketio');
  io.on('connection', async (socket) => {
    socket.emit('study', list);

    /* count o,x */
    socket.on('study-oxCount', (id, check) => {
      console.log('study-oxcount: id-',id, 'check-',check);
    });
    
  });
  res.render('study');
});

router.get('/quiz', (req, res, next) => {
  let io = req.app.get('socketio');
  io.on('connection', (socket) => {
    socket.emit('quiz', 'this is quiz page');
  })
  res.render('quiz');
});

module.exports = router;
