const express = require('express');
const fs = require('fs');
const router = express.Router();

const db = require('../public/js/db.js'); // make tables in SQLite DB
const studyList = require('../public/js/study/studyList.js')
// const { ttsEng, dbToTTS } = require('../public/js/study/tts');

/* execute tts english word list */
// const sheetData = { keypath: "../grpckey.json",
//                     docID: "1Ak7DXz9kBoos5CW8_0aJ77ZeaG_uS_Uk6MGeD10L2Gg",
//                     title: "eng"
//                   };
// const ttsData = { gender: 'FEMALE',
//                   lang: 'en-US'
//                 };


// list: [array] study list
const files = fs.readdirSync('./db/study');
const dbs = files.map(file => file.split('.')[0]);

/* study page */
// /study/study
router.get('/study', async (req, res, next) => {
  res.render('study');
});
// /study/study/english
dbs.forEach(async(dbname) => {
  const tables = await db.getTables(dbname);

  router.get(`/study/${dbname}`, async (req, res, next) => {    
    const io = req.app.get('socketio');
    const table = tables.map(i => {return i.name});

    io.on('connection', async (socket) => {
      socket.emit('study-tables', dbname, table);
    });
    res.render('studyDiv');
  });
// /study/study/english/day_1
  tables.map(i => {
    const table = i.name;
    router.get(`/study/${dbname}/${table}`, async (req, res, next) => {
      const io = req.app.get('socketio');
      console.log('/study',dbname,'/',table)
      const list = await studyList(dbname, table);
      console.log('list:',list, dbname);
    
      io.on('connection', async (socket) => {
        socket.emit('study', list);
    
        /* count o,x */
        socket.on('study-oxCount', (id, check) => {
          console.log('study-oxcount: id-',id, 'check-',check);
          // db activity insert
          // dbname, 
        });
      });
      res.render('studyPage');
    });
  });
});

router.get('/quiz', (req, res, next) => {
  let io = req.app.get('socketio');
  io.on('connection', (socket) => {
    socket.emit('quiz', 'this is quiz page');
  })
  res.render('quiz');
});

module.exports = router;
