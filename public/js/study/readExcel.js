const xlsxFile = require('read-excel-file/node');

module.exports = function readExcel(filePath) {
    return new Promise((resolve, reject) => { 
        xlsxFile(filePath).then((lines) => {
            let words = [];

            lines.forEach((line)=> {
                line = line.filter((val) => { return val !== null; }) // renove bykk
                // console.log(line);
                
                const word_en = line.shift();
                const word_ko = line;
                // console.log(word_en, word_ko);

                words.push({'word_en':word_en, 'word_ko':word_ko})
            });
            // console.log(words)
            resolve(words);
        });
    });
}

// const filePath = '../static/eng-words.xlsx';
// readExcel(filePath)
