const db = require('../db');

function studyList(dbname) {
  return new Promise((resolve, reject) => {
    const studyDB = db.openDB(`study/${dbname}`);
    // 모든 테이블명 읽어오기
    const sql = `SELECT name FROM sqlite_master WHERE type='table'`;
    studyDB.all(sql, (err, tables) => {
      if (err) return console.error(err);
      console.log(tables)
      // tables.map(i => {
        const i = tables[0]
        console.log(i);
        const table = i.name; //테이블명
        const sql = `SELECT * from ${table}`;

        studyDB.all(sql, (err, rows) => { //rows: word list
          if (err) return console.error(err);
            
          let list = new Array();
  
          rows.map(row => { //row: word
            let obj = new Object();
            ['h1', 'h2','d1','d2','d3'].map(v => {
              if (row[v]) obj[v] = row[v];
            });
            list.push(obj)
          });
          resolve(list);
        });
      // });
    });
  });
}

module.exports = studyList;