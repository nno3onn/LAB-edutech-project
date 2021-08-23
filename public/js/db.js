const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { resolve } = require('path');

/**
 * 
 * @returns yyyyMMddhhmmss
 */
 function getCurrentDate() {
  let date = new Date();
  let year = date.getFullYear().toString();

  let month = date.getMonth() + 1;
  month = month < 10 ? '0' + month.toString() : month.toString();

  let day = date.getDate();
  day = day < 10 ? '0' + day.toString() : day.toString();

  let hour = date.getHours();
  hour = hour < 10 ? '0' + hour.toString() : hour.toString();

  let minites = date.getMinutes();
  minites = minites < 10 ? '0' + minites.toString() : minites.toString();

  let seconds = date.getSeconds();
  seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

  return `${year}-${month}-${day}-${hour}:${minites}:${seconds}`;
}


/**
 * 
 * @param {db path} db 
 * db directory 기준이므로, study db라면 'study/[dbname]' 으로 작성해야 한다.
 * 
 * @returns db
 */
const openDB = (dbname) => {
  /* db connection */
  const db = new sqlite3.Database(`./db/${dbname}.db`, (err) => {
    if (err) return console.error(err);
    // console.log(`Connected to the ${dbname} database`);
  });
  return db;
}

const closeDB = (db) => {
  /* close the db connection */
  db.close((err) => {
    if (err) return console.error(err);
    // console.log('Close the db connection.');
  });
}

const getDBs = () => {
  const files = fs.readdirSync('./db/study');
  const dbs = files.map(file => file.split('.')[0]);
  return dbs;
}

const getTables = (dbname) => {
  return new Promise(resolve => {
    const db = openDB(`study/${dbname}`);
    // 모든 테이블명 읽어오기
    const sql = `SELECT name FROM sqlite_master WHERE type='table'`;
    db.all(sql, (err, tables) => {
      if (err) return console.error(err);
      resolve(tables) ;
    });
  });
}

const oxcount = (dbname, table, f) => {
  const db = openDB('user');
  const sql = `SELECT COUNT(*), SUM(ox) from activity where tb='${table}' AND db='${dbname}' AND f='${f}'`;
  return new Promise(resolve => {
    db.all(sql, (err, row) => {
      if (err) return console.error(err);
      // console.log(dbname, table, f, row)
      const total = row[0]['COUNT(*)'];
      const o = row[0]['SUM(ox)']===null ? 0 : row[0]['SUM(ox)'];
      const x = total - o;
      resolve({o, x});
    });
    closeDB(db);
  });
}

const getoxCount = async(dbname, table) => {
  return new Promise(resolve => {
    const db = openDB(`study/${dbname}`);
    // 모든 h1 읽어오기
    const sql = `SELECT * FROM ${table} ORDER BY f1`; // 오름차순 정렬
    let result = new Object();
  
    db.all(sql, (err, rows) => {
      if (err) return console.error(err);
      // f1, f2, f3 여부검사 및 max 알기
      const lastRow = rows[rows.length-1]; // 마지막 row가 f1, f2, f3의 마지막 숫자
      let f1, f2, f3;
      f1 = lastRow.f1;
      if (lastRow.f2) f2 = lastRow.f2;
      if (lastRow.f3) f3 = lastRow.f3;
  
      let f;
      new Promise(resolve => {
        for (let i=1, r=0; i<=f1; i++) {
          if (f2) {
            result[i] = {};
            for (let j=1; j<=f2; j++) {
              if (f3) {
                result[i] = {};
                result[i][j] = {};
                for (let k=1; k<=f3; k++) {
                  f = `${i}-${j}-${k}`;
                  oxcount(dbname, table, f).then(data => {
                    result[i][j][k] = {h1: rows[r++].h1, o: data.o, x: data.x};
                    if (r === rows.length) resolve(result);
                  });
                }
              } else {
                f = `${i}-${j}`;
                oxcount(dbname, table, f).then(data => {
                  result[i][j] = {h1: rows[r++].h1, o: data.o, x: data.x};
                  if (r === rows.length) resolve(result);
                });
              }
            }
          } else {
            f = `${i}`;
            oxcount(dbname, table, f).then(data => {
              result[i] = {h1: rows[r++].h1, o: data.o, x: data.x};
              if (r === rows.length) resolve(result);
            });
          }
        }
      }).then(result => {
        console.log('result:',result)
        resolve(result);
      });
    });
    closeDB(db);
  })
}

/** insert user data in db
 * 
 */
const login = (email, uid, provider, createdAt, lastLoginAt) => {
  if (!email || !uid || !createdAt || !lastLoginAt) {
    return console.error('no data');
  }
  const db = openDB('user');
  // user db에 저장
  // 1. 현재 table에 uid가 있는지 검색
  const sql = `SELECT * from user WHERE uid = '${uid}'`;

  db.get(sql, [], (err, row) => {
    console.log('row: ', row);
    if (err) console.error(err.message);
    const sql2 = row 
      // 1-1. 있으면 lastLoginAt, on만 변경
      ? `UPDATE user
          SET [lastLoginAt]='${lastLoginAt}', [on]=1
          WHERE uid = '${uid}'`
      // 1-2. 없으면 전체 추가
      : `INSERT INTO "user"
          VALUES('${email}', '${uid}', '${provider}', ${createdAt}, ${lastLoginAt}, 1)`;
          
    console.log('sql2: ',sql2);

    db.run(sql2, function(err) {
      if (err) return console.error(err.message);
      console.log( row ? `Row(s) updated: ${this.changes}` : `A row has been inserted with rowid ${this.lastID}`);
    });
  });
  closeDB(db);
}

const logout = (uid) => {
  console.log('logout uid: ',uid);
  if(!uid) {
    return console.error('no data');
  }
  const db = openDB('user');
  const sql = `UPDATE user
                SET [on]=0
                WHERE uid='${uid}'`;

  db.run(sql, (err) => {
    if (err) return console.error('logout error: ',err.message);
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  closeDB(db);
}

const activity = (data) => {
  if (!data) return console.error('no data');

  const { dbname, table, h1, check, uid } = data;
  // console.log(data);
  // search f in dbname.db where f1, h1
  const db = openDB(`study/${dbname}`);
  const sql = `SELECT * from ${table} WHERE h1='${h1}'`;
  db.get(sql, [], (err, row) => {
    // console.log('row: ', row);
    if (err) console.error(err.message);
    
    let f = '';
    ['f1','f2','f3'].forEach(v => {
      if (typeof(row[v])!=='object') f += `${row[v]}-`;
    });
    while(f.charAt(f.length-1) === '-') f = f.slice(0, -1);
    // insert activity data in user db - activity table
    const db_2 = openDB('user');
    const sql_2 = `INSERT INTO "activity"
                  VALUES('${uid}', '${dbname}', '${table}', '${f}', ${check}, '${getCurrentDate()}')`;
    db_2.run(sql_2, (err) => {
      if (err) return console.error(err);
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    closeDB(db_2);
  });
  closeDB(db);
}

const mychart = (uid, dbname) => {
  if (!uid) return console.error('no data');

  // let result = new Object();
  return new Promise(resolve => {
    let resultObj = new Object();
    getTables(dbname).then(tables => {
      tables.map((table) => {
        table = table.name;
        // get all h1s in db table
        getoxCount(dbname, table).then(data => {
          resultObj[table] = data;
          
          // resultObj에 모두 넣었을 때 resolve처리
          if (Object.keys(resultObj).length === tables.length) { 
            resolve(resultObj);
          }
        });
      });
    });
  });
  // search all data user db - activity table uid, dbname
  // const db = openDB('user');
  // const result = dbs.map(dbname => {
  //   let objDB = new Object();
  //   objDB.dbname = dbname;
  //   getTables(dbname).then(tables => {
  //     let objData = new Object();
  //     // result.dbname = tables;
  //     objData = tables.map(table => {
  //       table = table.name;
  //       console.log(uid, dbname, table)
  //       const sql = `SELECT * from activity
  //                     WHERE uid='${uid}' AND db='${dbname}' AND table='${table}'`;
  //       db.all(sql, [], (err, row) => {
  //         if (err) return console.error(err);
  //         console.log(row);
  //       })
  //       // return { table: 데이터들} 
  //     });
  //     // return objDB.data = objData;
  //   });
  //   return objDB;
  // });
  // console.log('result: ', result)



  // let sql = `SELECT * from activity
  //             WHERE uid='${uid}', db='${dbname}' table='${table}'`;
  // db.all(sql, [], (err, row) => {
  //   if (err) return console.error(err);
  //   console.log('search result: ',row);
  // });
}

module.exports = { openDB, closeDB, getDBs, getTables, login, logout, activity, mychart };
