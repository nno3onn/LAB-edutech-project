const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const provider = new firebase.auth.GoogleAuthProvider();

router.get('/signIn', (req, res, next) => {
  res.render('signIn');
});
router.get('/signUp', (req, res, next) => {
  res.render('signUp');
});
router.post('/sign', (req, res, next) => {
  firebase.auth().signInWithPopup(provider)
  .then((firebaseUser) => {
    res.render('home', {title: 'google 로그인 완료'});
  })
  .catch((err) => {
    console.log(err);
    res.redirect('signUp');
  })
});

module.exports = router;
