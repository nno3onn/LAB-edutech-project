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
  let dbs = new Array();
  files.forEach(file => {
    if(file.split('.')[1] === 'db') dbs.push(file.split('.')[0]);
  });
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
  types = ['study','quiz'];

  let so, sx, qo, qx;
  return new Promise(resolve => {
    types.forEach((type, index) => {
      const sql = `SELECT COUNT(*), SUM(ox) from activity where tb='${table}' AND db='${dbname}' AND f='${f}'`;
      db.all(sql, (err, row) => {
        if (err) return console.error(err);
        console.log(dbname, table, f, row)
        const total = row[0]['COUNT(*)'];
        const o = row[0]['SUM(ox)']===null ? 0 : row[0]['SUM(ox)'];
        const x = total - o;

        if (type==='study') {
          so = o; sx = x;
        } else {
          qo = o; qx = x;
        }

        console.log('length compare: ',type.length, index+1);
        if (types.length === index+1) resolve({so, sx, qo, qx});
      });
    });
    closeDB(db);
  });
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
  // console.log('getoxCount-1', dbname, table)
  return new Promise(resolve => {
    const db = openDB(`study/${dbname}`);
    
    let result = new Object();
    // f1, f2, f3의 max 값 구하기
    const sql = `SELECT MAX(f1), MAX(f2), MAX(f3) FROM ${table}`;
    db.all(sql, (err, maxs) => {
      if (err) return console.error(err);

      const f1 = maxs[0]['MAX(f1)'];
      const f2 = typeof(maxs[0]['MAX(f2)'])==='number' ? maxs[0]['MAX(f2)'] : false;
      const f3 = typeof(maxs[0]['MAX(f3)'])==='number' ? maxs[0]['MAX(f3)'] : false;
      
      // console.log(dbname, table, f1, f2, f3);

      // 모든 데이터 읽기
      const sql_2 = `SELECT * FROM ${table}`;
      db.all(sql_2, (err, rows) => {
        if (err) return console.error(err);

        new Promise(resolve => {

          rows.forEach((row, index) => {
            // console.log(row)
            result[row.f1] = [];

            let field = f2 
                      ? (f3 
                          ? `${row.f1}-${row.f2}-${row.f3}` 
                          : `${row.f1}-${row.f2}`) 
                      : row.f1;
            
            let f = f2
                  ? (f3
                      ? `${row.f2}-${row.f3}`
                      : `${row.f2}`)
                  : row.f1;

            // console.log(row.f1, row.f2, row.f3, f)
            oxcount(dbname, table, field).then(data => {
              result[row.f1].push({
                  h1: row.h1, 
                  f,
                  so: data.so, 
                  sx: data.sx,
                  qo: data.qo,
                  qx: data.qx});

              // console.log(index+1, rows.length)
              if (index+1 === rows.length) resolve(result);
            });
            
          });
        }).then(result => resolve(result))
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

  db.run(sql, function(err) {
    if (err) return console.error('logout error: ',err.message);
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  closeDB(db);
}

const activity = (data) => {
  if (!data) return console.error('no data');

  const { dbname, table, h1, type, check, uid } = data;
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
                  VALUES('${uid}', '${dbname}', '${table}', '${f}', '${type}', ${check}, '${getCurrentDate()}')`;
    db_2.run(sql_2, function(err) {
      if (err) return console.error(err);
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    closeDB(db_2);
  });
  closeDB(db);
}

const mychart = (uid, dbname) => {
  if (!uid) return console.error('no data');

  return new Promise(resolve => {
    let resultObj = new Object();
    getTables(dbname).then(tables => {
      tables.map((table) => {
        table = table.name;
        // get all h1s in db table
        getoxCount(dbname, table).then(result => {
          resultObj[table] = result;
          
          // resultObj에 모두 넣었을 때 resolve처리
          if (Object.keys(resultObj).length === tables.length) {
            // console.log(resultObj)
            resolve(resultObj);
          }
        });
      });
    });
  });
}

module.exports = { openDB, closeDB, getDBs, getTables, login, logout, activity, mychart };
