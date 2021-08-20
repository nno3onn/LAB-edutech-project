const db = require('../db');

function studyList(dbname, table) {
  return new Promise((resolve, reject) => {
    const studyDB = db.openDB(`study/${dbname}`);
    const sql = `SELECT * from ${table}`;

    studyDB.all(sql, (err, rows) => { //rows: word list
      if (err) return console.error(err);
      // console.log('rows',rows)
      let list = new Array();

      rows.map(row => { //row: word
        // console.log('row',row)
        let obj = new Object();
        ['h1', 'h2','d1','d2','d3'].map(v => {
          if (row[v]) obj[v] = row[v];
        });
        list.push(obj)
      });
      resolve(list);
    });
  });
}

module.exports = studyList;
