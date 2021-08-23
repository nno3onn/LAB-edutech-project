const socket = io();

/** handle button Click
 * 
 * @param {*} id 버튼을 누른 단어명
 * @param {*} check true(correct), false(incorrect)
 */
const handleClick = (h1, check) => {
  const user = firebase.auth().currentUser;
  const uid = user.uid;
  const dbname = window.location.href.split('/')[5];
  const table = window.location.href.split('/')[6];

  const data = { dbname, table, h1, check, uid };
  socket.emit('study-oxCount', data);
}
