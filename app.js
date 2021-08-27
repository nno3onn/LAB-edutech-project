const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/* 라우팅 모듈 선언 */
const routes = require('./routes');
const app = express();

/* view 경로 설정 */
app.set('views', [path.join(__dirname, 'views'),
                  path.join(__dirname, 'views/main'),
                  path.join(__dirname, 'views/study'),
                  path.join(__dirname, 'views/sign'),
                  path.join(__dirname, 'views/accounts')]);
                  
/* 화면 engine을 html로 설정 */
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* 기본 path를 public으로 설정 (css, js 등 파일 사용) */
app.use(express.static(path.join(__dirname, 'public')));
/* 라우팅 모듈 선언 */
app.use('/', routes);

/* webhook */
app.post("/webhook", (req, res) => {
  webhook(req, res);
})

/* catch 404 and forward to error handler */
// app.use((req, res, next) => {
//   next(createError(404));
// });


/* error handler */
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /* render the error page */
  res.status(err.status || 500);
  res.send('error')
});

module.exports = app;
