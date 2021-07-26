const fs = require('fs');
const projectId='edutech-318507';
const keyfile='./grpckey.json';
const text = require('@google-cloud/text-to-speech');

const client = new text.TextToSpeechClient({
    projectId:projectId,
    keyFilename:keyfile
});

module.exports = function tts (speakLang, speakGender, speakText) {
    return new Promise((resolve, reject) => { 
        const txt = speakText;
        const request = {
          input: {text: txt},
          voice: {languageCode: speakLang, ssmlGender: speakGender},
          audioConfig: {audioEncoding: 'MP3'},
        };
        
        client.synthesizeSpeech(request, (err, response) => {
          if (err) {
            console.error('ERROR:', err);
            return;
          }
          fs.writeFile(`./resources/${txt}.mp3`, response.audioContent, 'binary', err => {
            if (err) {
              console.error('ERROR:', err);
              return;
            }
            // console.log(`Audio content written to file: ${txt}.mp3`);
          });
        });
    });
}
// tts('en-US', 'FEMALE', 'hello world');
