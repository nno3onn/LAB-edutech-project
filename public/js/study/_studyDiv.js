let socket = io();

function getData(data) {
  const { type, dbname, tables } = data;
  console.log(type, dbname, tables);

  if (window.location.href.split('/')[5] === dbname) {

    tables.map(table => {
      if (document.getElementsByClassName(table).length !== 0) return;

      let temp = `<button class="study ${table} btn btn-secondary" id="btn-study" onclick="location.href='/study/${type}/${dbname}/${table}'">${table}</button>`;
      $(".study-container").append(temp);
    });
  }
}
socket.emit('study-dbname', window.location.href.split('/')[5]);
socket.on('study-tables', getData);

