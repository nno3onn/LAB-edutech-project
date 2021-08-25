const fs = require('fs');
const text = require('@google-cloud/text-to-speech');
const db = require('../db');
// const { getSheet } = require('../googleSheets');

const projectId = 'edutech-318507';
const keyFilename = './public/key.json';
const client = new text.TextToSpeechClient({
    projectId,
    keyFilename
});

const voiceLists = async () => {
  const [ result ] = await client.listVoices({});
  const voices = result.voices;

  console.log('Voices:');
  voices.forEach(voice => {
    console.log(`Name: ${voice.name}`);
    console.log(`  Natural Sample Rate Hertz: ${voice.naturalSampleRateHertz}`);
    console.log('  Supported languages:');
    voice.languageCodes.forEach(languageCode => {
      console.log(`    ${languageCode}`);
    });
  });
}

// tts('en-US', 'FEMALE', 'hello world');
const tts = (lang, gender, text) => {
  return new Promise((resolve, reject) => {
    const request = {
      input: { text },
      voice: { languageCode: lang, ssmlGender: gender },
      audioConfig: {audioEncoding: 'MP3'},
    };
    
    client.synthesizeSpeech(request, (err, res) => {
      if (err) {
        console.error('ERROR:', err);
        return;
      }
      fs.writeFile(`./public/resources/${text}.mp3`, res.audioContent, 'binary', err => {
        if (err) return console.error('ERROR:', err);
        console.log(`Audio content written to file: ${text}.mp3`);
      });
    });
  });
}

/** searchFile
 * - 해당 디렉터리에 파일 이름이 있는지 확인한다.
 * @param {*} filepath : 디렉터리
 * @param {*} filename : 찾고자 하는 파일명
 * @returns true(파일이 존재함)
 * 
 */
function searchFile(filepath, filename) {
  let result = false;

  fs.readdirSync(filepath).forEach(file => {
    if (file.split('.')[0] === filename) {
      result = true;
    }
  });
  return result;
}

function checkLang(text) {
  i = text.charCodeAt(0);
  return ((64 < i && i < 91) || (96 < i && i < 123)) 
    ? 'en-US'
    : 'ko-KR';
}




/** ttsEng
 * - 영단어 학습을 담고 있는 googleSheets를 읽고, 영어와 한글을 tts하여 mp3파일을 생성한다.
 * 
 * OUTPUT
  - words

 * @param {*} sheetData = { keypath, docID, title }
 * @param {*} ttsData = { gender, lang }
 * @returns words
 *    - type: Array
        - Array의 element는 object
        - ex) { word: 'english', mean1: '영어', mean2: '뜻2', mean3: '뜻3', ... }
        - googleSheets > excel headers에 작성된 수 만큼 있음.
 */
// const ttsEng = ( sheetData, ttsData ) => {
//   return new Promise(async(resolve, reject) => {
//     let sheet = await getSheet(sheetData.keypath, sheetData.docID, sheetData.title);
    
//     await sheet.getRows()
//       .then((rows) => {
//         let wordList = new Array();
//         let wordHead = new Array();

//         rows.map(async(row) => {
//           let obj = new Object();

//           for (const header of sheet.headerValues) {
//             const text = row[header];
//             if (text) { // 데이터가 있는 경우
//               obj[header] = text;

//               if(header===sheet.headerValues[0]) {
//                 wordHead.push(text);
//               }
//               /* 이미 해당 단어의 mp3 파일이 있다면 생략 */
//               if (!searchFile('./public/resources', text)) {
//                 console.log(`make ${text}.mp3 file`);
//                 await tts((header===sheet.headerValues[0]) ? ttsData.lang : 'ko-KR',
//                           ttsData.gender,
//                           text);
//               }
//             }
//           }
//           wordList.push(obj);
//         });
//         console.log('tts-eng finished.');
//         resolve({ wordList, wordHead });
//       });
//   });
// }

/**
 * 
 * @param {object} List 
 * @param {string} gender (FEMALE, MALE, NEUTRAL)
 */
const dbToTTS = (dbname, gender) => {
  return new Promise(() => {
    const studyDB = db.openDB(`study/${dbname}`);
    // 모든 테이블명 읽어오기
    const sql = `SELECT name FROM sqlite_master WHERE type='table'`;
    studyDB.all(sql, (err, rows) => {
      if (err) return console.error(err);
      rows.map(i => {
        const table = i.name;
        const sql = `SELECT * from ${table}`;
        
        studyDB.all(sql, (err, rows) => {
          if (err) return console.error(err);
  
          rows.map(row => {
            for (const [k, v] of Object.entries(row)) {
              if (['h1','h2','d1','d2','d3'].includes(k) && v!==null) {
                // console.log(v)
                if (!searchFile('./public/resources', v)) {
                  const lang = checkLang(v)
                  // console.log(v, lang)
                  tts(lang, gender, v);
                }
              }
            }
            // for (let i of row) {
            //   if (typeof(i) === 'string') console.log(i)
            // }
          })
          
          // f1 ~ f3 중 f이 몇까지 있는지 확인하기
          // console.log(rows[0])
  
          // let f = 0, h = 0, d = 0;
          // ['f1', 'f2', 'f3'].map(v => {
          //   if (typeof(rows[0][v])!=='object') f++;
          // });
          // ['h1', 'h2'].map(v => {
          //   if (typeof(rows[0][v])!=='object') h++;
          // });
  
          // let list = new Array();
  
          // rows.map(row => {
          //   let obj = new Object();
          //   ['h1', 'h2','d1','d2','d3'].map(v => {
          //     if (row[v]) obj[v] = row[v];
          //   });
          //   list.push(obj)
          // });
          // return list;
        })
      })
    });
    db.closeDB(studyDB);
  });
}

module.exports = { tts, dbToTTS, voiceLists };
