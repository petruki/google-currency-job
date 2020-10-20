const fs = require('fs');
const childProcess = require('child_process');

function writeOpenLog(results, target) {
    fs.writeFile('log.txt', `
GOOGLE CURRENCY JOB ALERT
###################################
${results.date}

From: ${results.source}
To: ${results.target}
Fee: ${results.fee}
Current converion: ${results.targetAmount}
Current converion (fee): ${results.targetFeeAmount}

Alarm set to: ${target} 
###################################`, function (err) {
        if (err) return console.log(err);

        childProcess.exec('start notepad log.txt', function (err, stdout, stderr) {
            if (err) {
                console.error(err);
                return;
            }
            process.exit(0);
        })
    });
}

module.exports = writeOpenLog;