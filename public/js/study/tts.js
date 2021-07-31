const fs = require('fs');
const text = require('@google-cloud/text-to-speech');
const { getSheet } = require('../googleSheets');

const projectId = 'edutech-318507';
const keyFilename = '../grpckey.json';

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
      fs.writeFile(`../resources/${text}.mp3`, res.audioContent, 'binary', err => {
        if (err) {
          return console.error('ERROR:', err);
        }
        // console.log(`Audio content written to file: ${txt}.mp3`);
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
const searchFile = (filepath, filename) => {  
  let result = false;

  fs.readdirSync(filepath).forEach(file => {
    if (file.split('.')[0] === filename) {
      result = true;
    }
  });
  return result;
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
const ttsEng = ( sheetData, ttsData ) => {
  return new Promise(async(resolve, reject) => {
    let sheet = await getSheet(sheetData.keypath, sheetData.docID, sheetData.title);
    
    await sheet.getRows()
      .then((rows) => {
        let wordList = new Array();

        rows.map(async(row) => {
          let obj = new Object();

          for (const header of sheet.headerValues) {
            const text = row[header];

            if (text) {
              obj[header] = text;
              /* 이미 해당 단어의 mp3 파일이 있다면 생략 */
              const check = 1;
              if (!searchFile('./public/resources', text)) {
                console.log(`make ${text}.mp3 file`);
                await tts((header===sheet.headerValues[0]) ? ttsData.lang : 'ko-KR',
                          ttsData.ttsGender,
                          text);
              }
            }
          }
          wordList.push(obj);
        });
        console.log('tts-eng finished.');
        resolve(wordList);
      });
  });
}


// const sheetData = { keypath: "../grpckey.json",
//                     docID: "1Ak7DXz9kBoos5CW8_0aJ77ZeaG_uS_Uk6MGeD10L2Gg",
//                     title: "eng"
//                   };
// const ttsData = { gender: 'FEMALE',
//                   lang: 'en-US'
//                 };

// ttsEng(sheetData, ttsData)
// .then(words => console.log(words))


module.exports = { ttsEng, voiceLists };
