let socket = io()

function getData(data) {
  const { type, dbs } = data;
  console.log(type, dbs)
  
  dbs.map(db => {
    if (document.getElementsByClassName(db).length !== 0) return;

    let temp = `<button class="study ${db} btn btn-secondary" id="btn-study" onclick="location.href='/study/${type}/${db}'">${db}</button>`;
    $(".study-container").append(temp);
  });
}

socket.on('study-dbs', getData);

