import revealList from './revealStudyList.js';

let socket = io();

socket.on('study', async (list) => {
  await revealList(list)
    .then(() => {
      $("#loading").remove();
      let start = `<p class="study-title">Day 1</p>
                   <p class="study-detail fragment fade-in">start !</p>`;
      $("#first-page").append(start);
    });
});
