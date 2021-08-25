const socket = io();

const type = window.location.href.split('/')[4];
let present;
$(document).keydown((e) => {
  e = e.keyCode;
  // type === 'quiz'인 경우
  if(type === 'quiz') {
    // 현재 페이지의 h1와 동일하면 response로 '정답입니다', 동일하지 않으면 '틀렸습니다'
    if (e === 37 || e === 38 || e ===39 || e ===40) { // 방향키
      const d = $('.present').children('.study-title')['0'];
      if (d) {
        present = d.classList['0'];
      }
    }
  }
});

function geth1 (h1) {
  answer = (h1===present)
    ? '정답입니다!'
    : '다시 풀어보세요.';
  console.log(answer);
  socket.emit('quiz-answer', answer);
  socket.off('quiz');
}

// 서버에서 dialogflow 파라미터를 받고, 
socket.on('connect', () => {
  socket.on('quiz', geth1)
});
