import revealList from './revealStudyList.js';

let socket = io();

socket.emit('study-tableName', window.location.href.split('/')[6]);

socket.on('study', async (data) => {
  const { type, list } = data;
  console.log(type, list);

  if(document.getElementsByClassName('study-title').length !== 0) return;

  await revealList(type, list)
  .then(() => {
    $("#loading").remove();
    let start = `<p class="study-title">${type}</p>
                  <p class="study-detail fragment fade-in">start !</p>`;
    $("#first-page").append(start);
  });
});
