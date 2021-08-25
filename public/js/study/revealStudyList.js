export default function revealList(type, list) {
  return new Promise((resolve, reject) => {
    list.map((word) => {
    if (document.getElementsByClassName(word.h1).length !== 0) return;

      let temp = `<section>
                  <audio data-autoplay src="../../../resources/${word.h1}.mp3"></audio>`;

      ['h1','h2'].map(v => {
        if (word[v] && typeof(word[v])!=='object') temp += `<p class="study-title">${word[v]}</p>`;
      });

      ['d1','d2','d3'].map(v => {
        if (word[v] && typeof(word[v])!=='object') temp += `<p class="study-detail fragment fade-in">${word[v]}</p>`;
      });

      temp += `<div class="fragment fade-in">
                <button id="${word.h1}" class="btn btn-success" onclick="handleClick(this.id, 1);">O</button>
                <button id="${word.h1}" class="btn btn-danger" onclick="handleClick(this.id, 0);">X</button>
              </div>
            </section>`;
      
      if (type==="quiz") $('#word.h1').css('display','none');

      /* quiz - 자동 ox count 및  */
      // type === 'quiz'인 경우에 서버에서 dialogflow 파라미터를 받고, 
      // 현재 페이지의 h1와 동일하면 response로 '정답입니다', 동일하지 않으면 '틀렸습니다'

      $("#slide").append(temp);
    });
    resolve();
  });
}
