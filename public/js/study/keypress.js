const socket = io();
const type = window.location.href.split('/')[4];
let present;

function findPresent() {
  const d = $('.present').children('.study-title')['0'];
  const present = d ? d.classList['0'] : false;
  return present;
}

$(document).keydown((e) => {
  // type === 'quiz'인 경우
  if(type === 'quiz') {
    e = e.keyCode;  console.log(e);
                              // 현재 페이지의 h1와 동일하면 response로 '정답입니다', 동일하지 않으면 '틀렸습니다'
    // 현재 페이지의 h1을 소켓전송함
    if (e === 37 || e === 38 || e ===39 || e ===40) { // 방향키
      socket.emit('quiz-answer', findPresent());
    }
  }
});

socket.on('quiz-correct', (check) => { 
  console.log(check?'correct!':'incorrect...');
  handleClick(findPresent(), check);

  socket.emit('quiz-answer', findPresent());
 });
