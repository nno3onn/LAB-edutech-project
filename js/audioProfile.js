const fs = require('fs');
const projectId='project_id_in_json';
const keyfile='./grpckey.json'; //---1) 
const textToSpeech = require('@google-cloud/text-to-speech');//---2)

const client = new textToSpeech.TextToSpeechClient({
        projectId:projectId,
        keyFilename:keyfile
}); //---3)
let text = 'Hello Everybody!  This is an audio profile optimized sound byte.';
let outputFile = './resources/phone.mp3';
let languageCode = 'en-US';
let ssmlGender = 'FEMALE';

async function synthesizeWithEffectsProfile() {
    // Add one or more effects profiles to array.
    // Refer to documentation for more details:
    // https://cloud.google.com/text-to-speech/docs/audio-profiles
    const effectsProfileId = ['telephony-class-application'];

    const request = {
      input: {text: text},
      voice: {languageCode: languageCode, ssmlGender: ssmlGender},
      audioConfig: {audioEncoding: 'MP3', effectsProfileId: effectsProfileId},
    };

    const [response] = await client.synthesizeSpeech(request);
    fs.writeFile(outputFile, response.audioContent, 'binary', err => {
        if (err) {
          console.error('ERROR:', err);
          return;
        }
    });
    console.log(`Audio content written to file: ${outputFile}`);
}
  // [END tts_synthesize_text_audio_profile]

synthesizeWithEffectsProfile();
