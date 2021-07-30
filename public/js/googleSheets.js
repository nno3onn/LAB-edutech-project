const { GoogleSpreadsheet } = require('google-spreadsheet');

getSheet = async (keypath, docID, title) => {
    const creds = require(keypath);
    const doc = new GoogleSpreadsheet(docID);
    try {
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo(); // load document properties and worksheets
        console.log('auth Google Spreadsheet completed');
        return doc.sheetsByTitle[title];
    } catch (err) {
        return console.log('auth error: ', err);
    }
}

module.exports = { getSheet }
