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
        db.run('CREATE TABLE user(email text unique, uid text primary key, createdAt integer, lastLoginAt int)')
        // session
        // .run('CREATE TABLE session(session text primary key, uid text, login text, logout text, ip text)')
        // contents
        .run(`CREATE TABLE contents(word text unique, wid integer primary key, title text, subtitle text, desc1 text, desc2 text, desc3 text)`)
        // activity
        .run('CREATE TABLE activity(uid text, wid integer, cnt integer, datetime int)')
        // comment
        .run('CREATE TABLE comment(wid integer, uid text unique, comment text, datetime int)')
        // relation
        .run('CREATE TABLE relation(wid integer, relatedwid integer)')
    });
    closeDB(db);
}

const insertWordHead = (tableName, wordHeads) => {
    let sql = `INSERT INTO ${tableName}(word) VALUES `;
    
    wordHeads.map((wordHead, index) => {
        sql += `('${wordHead}')`;
        if(index + 1 < wordHeads.length) sql += ',';
    });
    db.run(sql);
}

const closeDB = (db) => {
    /* close the db connection */
    db.close((err) => {
        if (err) return console.error(err);
        console.log('Close the db connection.');
    });
}

module.exports = { settingTables, insertWordHead };
