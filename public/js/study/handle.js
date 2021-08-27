// const socket = io();

/** handle button Click
 * 
 * @param {*} id 버튼을 누른 단어명
 * @param {*} check true(correct), false(incorrect)
 */
const handleClick = (h1, check) => {
  const user = firebase.auth().currentUser;
  const uid = user.uid;
  const type = window.location.href.split('/')[4];
  const dbname = window.location.href.split('/')[5];
  const table = window.location.href.split('/')[6];

  const data = { dbname, table, h1, check, uid, type };

  if ((type==='quiz'&&check===1) || type==='study'){
    Reveal.right();
  }

  socket.emit('study-oxCount', data);
}

/** handle button icon-listen
 * 
 */
 $("#icon-listen").on("click", () => {
  let title = $(".present .study-title").text();
  let audio = new Audio(`../../../resources/${title}.mp3`);
  audio.play();
});
