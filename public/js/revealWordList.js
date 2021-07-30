export default function revealWordList(wordList) {
// const revealWordList = (wordList) => {
  wordList.map((word) => {
    // console.log(word);
    for (const w of Object.entries(word)){
      console.log(w)
    }
    // for(let w of word) {
      /* 제일 처음에 오는 글자는 크게 나타낼 글자이므로 title에 저장, 
      나머지는 title의 설명 글이므로 detail에 저장*/ 
      // console.log(w)
      // (w===0) ? 
    // }
  });
  // new Promise((resolve, reject) => {
  //   wordList.
  //   for (let word in wordList) {

  //   }
  // })
  //   .then(() => {

  //   })
}

const words = [
  { head: 'efface', detail1: '지우다', detail2: '없애다' },
  { head: 'resurrect', detail1: '부활시키다' },
  { head: 'reverend', detail1: '목사' },
  { head: 'allude', detail1: '암시하다', detail2: '시사하다' },
  { head: 'alleviate', detail1: '완화하다' },
  { head: 'exacerbate', detail1: '악화시키다' },
  { head: 'absorb', detail1: '흡수하다' },
  { head: 'gauge', detail1: '측정하다', detail2: '판단하다' },
  { head: 'considerably', detail1: '상당히' },
  { head: 'postulate', detail1: '상정하다' },
  { head: 'enlighten', detail1: '계몽시키다' },
  { head: 'revere', detail1: '숭배하다' },
  { head: 'ameliorate', detail1: '개선시키다' },
  { head: 'allure', detail1: '매력' },
  { head: 'aggravate', detail1: '악화시키다' },
  { head: 'deduction', detail1: '추론', detail2: '연역', detail3: '공제' },
  { head: 'despise', detail1: '경멸하다' },
  { head: 'impassable', detail1: '통과할 수 없는', detail2: '폐쇄된' },
  { head: 'posit', detail1: '상정하다' },
  { head: 'populate', detail1: '거주하다', detail2: '이주시키다' },
  { head: 'absolute', detail1: '절대적인' },
  { head: 'propose', detail1: '제시하다' },
  { head: 'investment', detail1: '투자' },
  { head: 'revenue', detail1: '이익' }
];
// revealWordList(words);
