const socket = io();

function getData(data) {
  const type = window.location.href.split('/')[4];
  const { dbname, tables } = data;
  console.log(type, dbname, tables);

  if (window.location.href.split('/')[5] === dbname) {

    tables.map(table => {
      if ($(`.${table}`).length !== 0) return;

      let temp = `<button class="study ${table} btn btn-secondary" id="btn-study" onclick="location.href='/study/${type}/${dbname}/${table}'">${table}</button>`;
      $(".study-container").append(temp);
    });
  }
  socket.off('study-tables')
}

socket.on('connect', () => {
  socket.emit('study-dbname', window.location.href.split('/')[5]);
  socket.on('study-tables', getData);
});
