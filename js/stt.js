const fs = require('fs');
const projectId='project_id_in_json';
const keyfile='../grpckey.json';
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient({
    projectId:projectId,
    keyFilename:keyfile
});

const filename = '../resources/allude.mp3';
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

async function stt(filename, encoding, sampleRateHertz, languageCode) {
  const audio = {
    content: fs.readFileSync(filename).toString('base64')
  };
  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
}

stt(filename, encoding, sampleRateHertz, languageCode);

module.exports = {
    'stt': stt
}
