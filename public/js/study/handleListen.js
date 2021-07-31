/** handle button icon-listen
 * 
 */
$("#icon-listen").on("click", () => {
    let title = $(".present .study-title").text();
    let audio = new Audio(`../../resources/${title}.mp3`);
    audio.play();
  });
