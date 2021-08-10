import revealStudyList from './revealStudyList.js';

let socket = io();
socket.emit('access-page', '/study/study');

socket.on("wordList", async(wordArray) => {
  console.log(wordArray)
  await revealStudyList(wordArray)
    .then(() => {
      $("#loading").remove();
      let start = `<p class="study-title">Day 1</p>
                   <p class="study-detail fragment fade-in">start !</p>`;
      $("#first-page").append(start);
    });
});
