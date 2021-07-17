const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const creds = require('./grpckey.json');

const doc = new GoogleSpreadsheet('1Ak7DXz9kBoos5CW8_0aJ77ZeaG_uS_Uk6MGeD10L2Gg');

async function authGoogleSheet() {
    try {
        await doc.useServiceAccountAuth(creds);

        // await doc.useServiceAccountAuth({
        //     client_email: 'edutech@edutech-318507.iam.gserviceaccount.com',
        //     private_key: creds,
        // });
        await doc.loadInfo();
        console.log('auth complete');
    } catch (err) {
        fs.writeFileSync('err.txt', err);
        return console.log('auth error: ', err, 'auth error');
    }
}

async function readFileSheet() {
    console.log(doc)
    fs.writeFileSync('doc.json',JSON.stringify(doc))
    // let sheet = doc.sheetByIndex[0];
    // let rows = await sheet.getRows({offset:1});
    // rows.forEach((element) => {
    //     // console.log(element)
    // });
}

authGoogleSheet(); // 처음 시작 시 문서 접속에 대한 인증 처리하고 해당 문서를 로드함
readFileSheet();







