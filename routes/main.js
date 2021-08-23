const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  // const io = req.app.get('socketio');
  // io.on('connection', async (socket) => {
  //   socket.on('logout', (uid) => {
  //     console.log('socket on logout: ', uid);
  //     db.logout(uid);
  //   });
  // });
  res.render('main');
});

module.exports = router;
