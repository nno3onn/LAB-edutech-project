let socket = io();

socket.on('mychart-dbs', dbs => {
  console.log('mychart-dbs:',socket.id+' is connected')
  console.log(dbs);
  
  dbs.map(db => {
    if (document.getElementsByClassName(db).length !== 0 ) return;

    let temp = `<button class="study ${db} btn btn-secondary" id="btn-study" onclick="location.href='/accounts/mychart/${db}'">${db}</button>`;
    $(".mychart-container").append(temp);
  });
});
