const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const provider = new firebase.auth.GoogleAuthProvider();

const db = require('../public/js/db.js');

/** LOGIN SCREEN
 * 
 */
router.get('/', (req, res, next) => {
  let io = req.app.get('socketio');
  io.on('connection', async (socket) => {
    /* get user data */
    socket.on('login', (user) => {
      const { uid, email, providerData, lastLoginAt, createdAt } = user;
      const providerId = providerData[0].providerId.split('.')[0];
      console.log('login success:',uid, email, providerId, lastLoginAt, createdAt);

      db.login(email, uid, providerId, createdAt, lastLoginAt);
    });
  });
  res.render('sign');
});


router.post('/', (req, res, next) => {
  firebase.auth().signInWithPopup(provider)
  .then((firebaseUser) => {
    res.render('home', {title: '로그인 완료'});
  })
  .catch((err) => {
    console.error(err);
    alert('ERROR! ', err);
    res.redirect('sign');
  })
});

module.exports = router;
