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
    console.log('socketId - mychart-dbs: ',socket.id)
    io.to(socket.id).emit('mychart-dbs', dbs);
  }); 
  res.render('mychart');
});

// /mychart/english
dbs.forEach(async(dbname) => {
  router.get(`/mychart/${dbname}`, (req, res, next) => {
    const io = req.app.get('socketio');

    io.on('connection', (socket) => {
      let dbName;
      socket.on('mychart-dbname', data => dbName = data);
      
      socket.on('mychart-uid', uid => { // client로부터 uid를 받아옴
        console.log('mychart-uid',uid, dbName, dbname)
        db.mychart(uid, dbName).then(tablesObj => {
          // console.log('--------------/mychart/dbname', dbname, JSON.stringify(tablesObj) )
          // data 보내기
          console.log('socketId - mychart: ', socket.id, JSON.stringify(tablesObj) )
          io.to(socket.id).emit('mychart', tablesObj);
        });
      });
    });
    res.render('mychartPage');
  });
});

router.get('/setting', (req, res, next) => {
  res.render('setting');
});

module.exports = router;
