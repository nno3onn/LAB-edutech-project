const express = require('express');
const fs = require('fs');
const router = express.Router();

const db = require('../public/js/db.js');
const studyList = require('../public/js/study/studyList.js')

// list: [array] study list
const dbs = db.getDBs();

async function routeDB(type, dbname) {
  router.get(`/${type}/${dbname}`, async (req, res, next) => {    
    const io = req.app.get('socketio');

    io.on('connection', (socket) => {
      socket.on('study-dbname', (dbname) => {
        db.getTables(dbname).then(tables => {
          tables = tables.map(table => table.name);
          io.to(socket.id).emit(`study-tables`, { dbname, tables })
        });
      });
    });

    res.render(`studyDiv`);
  });
}

async function routeTable(type, dbname, table) {
  router.get(`/${type}/${dbname}/${table}`, async (req, res, next) => {
    const io = req.app.get('socketio');
  
    io.on('connection', (socket) => {
      /* send study list */
      socket.on('study-tableName', (tableName) => {
        studyList(dbname, tableName).then(list => io.to(socket.id).emit('study', list));
      });
  
      /* count o,x */
      socket.on('study-oxCount', (data) => {
        console.log('study-oxcount: ', data); // { dbname, table, h1, type, check, uid }
        db.activity(data);  // db activity insert
      });
    });

    res.render(`studyPage`);
  });
}

// routing
['study','quiz'].forEach(type => {
  router.get(`/${type}`, async (req, res, next) => {
    const io = req.app.get('socketio');
    io.on('connection', async (socket) => {
      io.to(socket.id).emit('study-dbs', dbs);
    });
    res.render('study');
  });

  dbs.forEach(async dbname => {
    // /study/study/english
    routeDB(type, dbname);

    const tables = await db.getTables(dbname);
    const tableNames = tables.map(i => {return i.name});
    // /study/study/english/day_1
    tableNames.map(tableName => {
      routeTable(type, dbname, tableName);
    });
  });
});

module.exports = router;
