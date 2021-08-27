import revealList from './revealStudyList.js';

const socket = io();

socket.on('connect', () => {
  const type = window.location.href.split('/')[4];
  const tableName = window.location.href.split('/')[6];

  socket.emit('study-tableName', tableName);

  socket.on('study', (list) => {  
    if($('.study-title').length !== 0) return;
  
    revealList(type, list)
    .then(() => {
      $("#loading").remove();
      let start = `<p class="study-intro">${type}</p>
                    <p class="study-detail fragment fade-in">start !</p>`;
      $("#first-page").append(start);
    });

    socket.off('study');
  });


  const d = $('.present').children('.study-title')['0'];
  const present = d ? d.classList['0'] : false;

  const quiz = type==='quiz' ? true : false;
  socket.emit('quiz-init', {quiz, present} );
});
