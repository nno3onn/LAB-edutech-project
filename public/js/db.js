/** setting DB
 * 
 */
const sqlite3 = require('sqlite3').verbose();

/* db connection */
let db = new sqlite3.Database('./db/my.db', (err) => {
    if (err) return console.error(err);
    console.log('Connected to the mydb database');
});

const settingTables = () => {
    /* create tables */
    db.parallelize(() => {
        // user
        db.run('CREATE TABLE user(user text primary key, uid text unique)')
        // session
        .run('CREATE TABLE session(session text primary key, uid text, login text, logout text, ip text)')
        // activity
        .run('CREATE TABLE activity(uid text, wid integer, count integer, datetime text)');
    });
    closeDB(db);
}

const createTable = (tableName) => {
    db.run(`CREATE TABLE ${tableName}(word text unique, wid integer primary key)`);
    // closeDB(db);
}

const insertWordHead = (tableName, wordHeads) => {
    let sql = `INSERT INTO ${tableName}(word) VALUES `;
    
    wordHeads.map((wordHead, index) => {
        sql += `('${wordHead}')`;
        if(index + 1 < wordHeads.length) sql += ',';
    });
    db.run(sql)
}

const closeDB = (db) => {
    /* close the db connection */
    db.close((err) => {
        if (err) return console.error(err);
        console.log('Close the db connection.');
    });
}

module.exports = { settingTables, createTable, insertWordHead }
