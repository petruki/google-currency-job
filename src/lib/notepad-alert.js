const fs = require('fs');
const childProcess = require('child_process');
const { log } = require('./google-currency-query');

function writeOpenLog(results, target) {
    fs.writeFile('log.txt', log(results, target).text, function (err) {
        if (err) return console.log(err);

        childProcess.exec('start notepad log.txt', function (err, stdout, stderr) {
            if (err) {
                console.error(err);
                return;
            }
        })
    });
}

module.exports = writeOpenLog;