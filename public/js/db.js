const sqlite3 = require('sqlite3').verbose();

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

  return year + month + day + hour + minites + seconds;
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
    console.log(`Connected to the ${dbname} database`);
  });
  return db;
}

const closeDB = (db) => {
  /* close the db connection */
  db.close((err) => {
    if (err) return console.error(err);
    console.log('Close the db connection.');
  });
}



/** insert user data in db
 * 
 */
const signUp = (user, uid, createdAt, lastLoginAt) => {
  if (!user || !uid || !createdAt || !lastLoginAt) {
    return console.error('no data');
  }
  const db = openDB('user');
  const sql = `INSERT INTO user(user, uid, createdAt, lastLoginAt) 
                VALUES(${user}, ${uid}, ${createdAt}, ${lastLoginAt})`;

  db.run(sql, (err) => {
    if (err) return console.error(err);
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  closeDB(db);
}

const login = () => {

}

const logout = (uid, lastLoginAt) => {
  if(!uid || !lastLoginAt) {
    return console.error('no data');
  }
  const db = openDB('user');
  const sql = `UPDATE user
                SET lastLoginAt = ${lastLoginAt}
                WHERE uid = ${uid}`;

  db.run(sql, (err) => {
    if (err) return console.error(err);
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  closeDB(db);
}

const activity = (uid, wid, cnt) => {
  if (!uid || !wid || !cnt) {
    return console.error('no data');
  }
  const db = openDB('user');
  const sql = `INSERT INTO activity(uid, wid, cnt, datetime) 
                VALUES(${uid}, ${wid}, ${cnt}, ${getCurrentDate()})`;

  db.run(sql, (err) => {
    if (err) return console.error(err);
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  closeDB(db);
}

module.exports = { openDB, closeDB, signUp, login, logout, activity };
