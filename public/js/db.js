/** setting DB
 * 
 */
const sqlite3 = require('sqlite3').verbose();


/** user.db 
*/
let userDB = new sqlite3.Database('./db/user.db', (err) => {
    if (err) return console.error(err);

    console.log('Connected to the mydb database');
});

/** session.db 
*/
let sessionDB = new sqlite3.Database('./db/session.db', (err) => {
    if (err) return console.error(err);

    console.log('Connected to the mydb database');
});

/** studyilst.db 
*/
let studylistDB = new sqlite3.Database('./db/studylist.db', (err) => {
    if (err) return console.error(err);

    console.log('Connected to the mydb database');
});

/** activity.db 
*/
let activvityDB = new sqlite3.Database('./db/activity.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);

    console.log('Connected to the mydb database');
});


/* db connection */
// let db = new sqlite3.Database('./db/my.db', sqlite3.OPEN_READWRITE, (err) => {
//     if (err) return console.error(err);

//     console.log('Connected to the mydb database');
// });


/* Create */
// create table
// db.run('CREATE TABLE student(id integer primary key, name text not null, email text unique)', (err) => {
//     if (err) return console.error(err);
// });

// insert one row into the table
// db.run(`INSERT INTO student(name, email) VALUES('조승우', 'snuJoe@gmail.com')`, function (err) {
//     if (err) return console.error(err);
//     console.log(`A row has been inserted with rowid ${this.lastID}`);
// });

/* Read */
// read Data
// let sql = `SELECT * from student
//             WHERE name = '조승우'`;

// db.all(sql, [], (err, rows) => {
//     if(err) return console.error(err);
    
//     rows.forEach((row) => {
//         console.log(row);
//     })
// });


/* Update */
// let sql = `UPDATE student
//             SET email = 'snuJoe@naver.com'
//             WHERE name = '조승우'`;
// db.run(sql, function (err) {
//     if(err) return console.error(err);

//     console.log(`Row(s) updated: ${this.changes}`);
// });


/* Delete */
// let rowID = 1;
// delete a row based on rowID
// db.run(`DELETE FROM student WHERE id=?`, rowID, function (err) {
//     if (err) return console.error(err);

//     console.log(`Row(s) deleted ${this.changes}`);
// })



/* close the db connection */
// db.close((err) => {
//     if (err) return console.error(err);
//     console.log('Close the db connection.');
// });
