let socket = io();

socket.on('mychart-dbs', dbs => {
  dbs.map(db => {
    let temp = `<button class="study btn btn-secondary" id="btn-study" onclick="location.href='/accounts/mychart/${db}'">${db}</button>`;
    $(".mychart-container").append(temp);
  });
});
