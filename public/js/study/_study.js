const socket = io();

function getData(dbs) {
  const type = window.location.href.split('/')[4];
  console.log(dbs)
  
  dbs.map(db => {
    if ($(`.${db}`).length !== 0) return;

    let temp = `<button class="study ${db} btn btn-secondary" id="btn-study" onclick="location.href='/study/${type}/${db}'">${db}</button>`;
    $(".study-container").append(temp);
  });

  socket.off('study-dbs')
}

socket.on('connect', () => {
  socket.on('study-dbs', getData);
});

