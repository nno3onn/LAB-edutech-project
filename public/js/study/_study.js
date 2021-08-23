let socket = io();

socket.on('study-dbs', dbs => {
  dbs.map(db => {
    let temp = `<button class="study btn btn-secondary" id="btn-study" onclick="location.href='/study/study/${db}'">${db}</button>`;
    $(".study-container").append(temp);
  });
});
