let socket = io();
let word_list;

socket.on('words', (data) => {
    word_list = data;
    listenWords(word_list); //
});

function listenWords(word_list) {
    // let music = '<i id="icon-listen" class="fas fa-music fa-2x"></i>';
    // $('#slide').append(music);
    
    word_list.forEach( word => {
        let en = word.word_en;
        let ko = word.word_ko;
        // console.log(en, ko);

        let ko_text = '';
        if(ko.length !== 1) {
            for(let i in ko) {
                ko_text += `${Number(i)+1}. ${ko[i]}</br>`
            }
        } else {
            ko_text = ko;
        }
        let temp = `<section>
                    <p id="word-en">${en}</p>
                    <p id="word-ko" class="fragment fade-in">${ko_text}</p>
                    <audio data-autoplay src="./resources/${en}.mp3"></audio>
                </section>`;
        $('#slide').append(temp);
    });    
}

function mixArrayRandom(array) {
    let length = array.length;
    while (length) {
        let index = Math.floor((length--) * Math.random());
        let temp = array[length];
        array[length] = array[index];
        array[index] = temp;
    }
    return array;
}

// Array.prototype.mixRandom = () => { // Array의 prototype을 지정해주고, shuffle이라는 이름을 가진 함수를 생성
//     let length = this.length;
//     // 아래에서 length 후위 감소 연산자를 사용하면서 결국 0이된다.
//     // 프로그래밍에서 0은 false를 의미하기에 0이되면 종료.
//     while (length) { // 랜덤한 배열 index 추출
//         let index = Math.floor((length--) * Math.random());
//         let temp = this[length]; // 배열의 끝에서부터 0번째 아이템을 순차적으로 대입
//         this[length] = this[index]; // 랜덤한 위치의 값을 맨뒤(this[length])부터 셋팅
//         this[index] = temp; // 랜덤한 위치에 위에 설정한 temp값 셋팅
//     }
//     return this; // 배열을 리턴해준다.
// };

$('#block-study').on('click', () => {
    listenWords(word_list);
    $('#home').attr('data-visibility','hidden');
});

$('#block-quiz').on('click', () => {

});

$('#icon-listen').on('click', () => {
    let word = $('.present #word-en').text();
    let audio = new Audio(`./resources/${word}.mp3`);
    audio.play();
});
