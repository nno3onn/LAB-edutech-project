/* 모든 라우팅 정의 */
const express = require('express');
const router = express.Router();

const main = require('./main');
const user = require('./user');
const study = require('./study');
const sign = require('./sign');

/*  get: 조희
    post: 저장
    put: 수정
    delete: 삭제    */
router.use('/', main);
router.use('/user', user);
router.use('/study', study);
router.use('/sign', sign);

// router.get('/', (req, res, next) => {
//     res.send('index page'); 
//     /*  send(): 문자열로 응답
//         json(): json 객체로 응답
//         render(): html 변환 템플릿을 렌더링(ejs)
//         sendfile(): 파일 다운로드               */
// });

module.exports = router;
