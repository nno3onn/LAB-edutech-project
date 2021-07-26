const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async (keypath, docID, sheetTitle) => {
    const creds = require(keypath);
    const doc = new GoogleSpreadsheet(docID);
    try {
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo(); // load document properties and worksheets
        console.log('auth Google Spreadsheet completed');
        
        return readSpreadsheet(doc, sheetTitle);

    } catch (err) {
        return console.log('auth error: ', err);
    }
}

async function readSpreadsheet(doc, sheetTitle) {
    const sheet = doc.sheetsByTitle[sheetTitle]; // or doc.sheetsById[0]; or doc.sheetsByIndex[0];
    return sheet.getRows(); // { limit, offset }
}
