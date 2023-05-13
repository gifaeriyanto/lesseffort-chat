const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = './scripts/files/prompts.csv';

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    fs.writeFile(
      './src/store/db/prompts.json',
      JSON.stringify(jsonObj),
      { flag: 'w' },
      function (err) {
        if (err) throw err;
        console.log('File created/overwritten successfully!');
      },
    );
  });
