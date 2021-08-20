let socket = io();

socket.on('study-tables', (dbname, tables) => {
  if (window.location.href.split('/')[5] === dbname) {
    tables.map(table => {
      let temp = `<button class="study btn btn-secondary" id="btn-study" onclick="location.href='/study/study/english/${table}'">${table}</button>`;
      $(".study-container").append(temp);
    });
  }
});
