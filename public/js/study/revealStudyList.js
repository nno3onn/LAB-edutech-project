export default function reveal(list) {
  return new Promise((resolve, reject) => {

    for (const [k, v] of Object.entries(list)) {
      list.map((word) => {
        let temp = `<section>
                    <audio data-autoplay src="../resources/${word.h1}.mp3"></audio>`;

        ['h1','h2'].map(v => {
          if (word[v] && typeof(word[v])!=='object') temp += `<p class="study-title">${word[v]}</p>`;
        });

        ['d1','d2','d3'].map((v,i) => {
          if (word[v] && typeof(word[v])!=='object') temp += `<p class="study-detail fragment fade-in">${word[v]}</p>`;
        });

        temp += `<div class="fragment fade-in">
                    <button id="${word.h1}" class="btn btn-success" onclick="handleClick(this.id, 1);">O</button>
                    <button id="${word.h1}" class="btn btn-danger" onclick="handleClick(this.id, 0);">X</button>
                  </div>
                </section>`;
        $("#slide").append(temp);
      });
    }
    resolve();
  });
}

// function revealstudyList(studyArray) {
//   return new Promise((resolve, reject) => {
//     studyArray.map((studyLine) => {
//       let studyObj = { title: '', detail: '' };
//       let index = 0;
  
//       for (const [key, value] of Object.entries(studyLine)){
//         /* 제일 처음에 오는 글자는 크게 나타낼 글자이므로 title에 저장, 
//         나머지는 title의 설명 글이므로 detail에 저장*/ 
//         const checkNum = (Object.keys(studyLine).length === 2 ? true : false);
  
//         if(key === 'head') {
//           studyObj.title = value;
//         } else {
//           if (checkNum) { // detail이 하나 뿐이면,
//             studyObj.detail = value;
//           } else { // detail이 하나 이상이면
//             studyObj.detail += `${(++index)}. ${value}</br>`;
//           }
//         }
//       }
//       let temp = `<section>
//                     <audio data-autoplay src="../resources/${studyObj.title}.mp3"></audio>
//                     <p class="study-title">${studyObj.title}</p>
//                     <p class="study-detail fragment fade-in">${studyObj.detail}</p>
//                     <div class="fragment fade-in">
//                       <button id="${studyObj.title}" class="btn btn-success" onclick="handleClick(this.id, 1);">O</button>
//                       <button id="${studyObj.title}" class="btn btn-danger" onclick="handleClick(this.id, 0);">X</button>
//                     </div>
//                   </section>`;
//       $("#slide").append(temp);
//     });
//     resolve();
//   });
// }
