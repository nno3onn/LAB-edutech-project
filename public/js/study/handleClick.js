/** handle button Click
 * 
 * @param {*} id 버튼을 누른 단어명
 * @param {*} check true(correct), false(incorrect)
 */
 const handleClick = (id, check) => {
    console.log(id, check);
    const socket = io();

    socket.emit('study-oxCount', id, check);
  }
