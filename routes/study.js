let express = require('express');
let router = express.Router();

router.get('/', (err, req, res, next) => {
    if(err) return console.error('error: ', err);
    console.log('hi')
    // res.writeHead(200);
    res.send('hi');
    // res.sendFile(path.join(__dirname + "/study.html"));
});

module.exports = router;
