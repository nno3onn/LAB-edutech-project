const express = require('express');
const router = express.Router();

const db = require('../public/js/db.js');
const dbs = db.getDBs();

router.get('/mypage', (req, res, next) => {
  res.render('mypage');
});

// /mychart
router.get('/mychart', (req, res, next) => {
  const io = req.app.get('socketio');
  io.on('connection', async (socket) => {
    socket.emit('mychart-dbs', dbs);
  });
  res.render('mychart');
});

// /mychart/english
dbs.forEach(async(dbname) => {
  router.get(`/mychart/${dbname}`, (req, res, next) => {
    const io = req.app.get('socketio');

    io.on('connection', (socket) => {
      socket.on('mychart-uid', uid => { // client로부터 uid를 받아옴
        db.mychart(uid, dbname).then(tablesObj => {
          console.log(tablesObj)
          // data 보내기
          socket.emit('mychart', tablesObj);
        });
      });
    });
    res.render('mychartPage');
  });
});

// /study/study/english/day_1
//   tables.map(i => {
//     const table = i.name;
//     router.get(`/study/${dbname}/${table}`, async (req, res, next) => {
//       const io = req.app.get('socketio');
//       // console.log('/study',dbname,'/',table)
//       const list = await studyList(dbname, table);
//       // console.log('list:',list, dbname);
    
//       io.on('connection', async (socket) => {
//         socket.emit('study', list);
    
//         /* count o,x */
//         socket.on('study-oxCount', (data) => {
//           console.log('study-oxcount: ', data); // { dbname, table, h1, check, uid }
//           // db activity insert
//           db.activity(data);
//         });
//       });
//       res.render('studyPage');
//     });
//   });
// });

router.get('/setting', (req, res, next) => {
  res.render('setting');
});

module.exports = router;
