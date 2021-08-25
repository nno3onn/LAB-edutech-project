import revealList from './revealStudyList.js';

const socket = io();

socket.on('connect', () => {
  const type = window.location.href.split('/')[4];
  const tableName = window.location.href.split('/')[6];

  socket.emit('study-tableName', tableName);

  socket.on('study', (list) => {  
    if(document.getElementsByClassName('study-title').length !== 0) return;
  
    revealList(type, list)
    .then(() => {
      $("#loading").remove();
      let start = `<p class="study-intro">${type}</p>
                    <p class="study-detail fragment fade-in">start !</p>`;
      $("#first-page").append(start);
    });

    socket.off('study');
  });
});
