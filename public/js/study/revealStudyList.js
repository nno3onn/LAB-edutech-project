export default function revealList(type, list) {
  return new Promise((resolve, reject) => {
    list.map((word) => {
    if (document.getElementsByClassName(word.h1).length !== 0) return;

      let temp = `<section>`;
      temp += type==='study' ? `<audio data-autoplay src="../../../resources/${word.h1}.mp3"></audio>` : '';
                  
      if (type === 'study') {
        $('#icon-listen').show();

        ['h1','h2'].map(v => {
          if (word[v] && typeof(word[v])!=='object') temp += `<p class="study-title">${word[v]}</p>`;
        });

        ['d1','d2','d3'].map(v => {
          if (word[v] && typeof(word[v])!=='object') temp += `<p class="study-detail fragment fade-in">${word[v]}</p>`;
        });


      } else if (type === 'quiz') {
        $('#icon-listen').hide();

        ['d1','d2','d3'].map(v => {
          if (word[v] && typeof(word[v])!=='object') temp += `<p class="${word.h1} study-title">${word[v]}</p>`;
        });
      }

      temp += `<div `; temp += type==='quiz' ? 'style="display:none"' : `class="fragment fade-in"`; temp += `>
                <button id="${word.h1}" class="btn btn-success" onclick="handleClick(this.id, 1);">O</button>
                <button id="${word.h1}" class="btn btn-danger" onclick="handleClick(this.id, 0);">X</button>
              </div>
            </section>`;

      $("#slide").append(temp);
    });
    resolve();
  });
}
