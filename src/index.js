const googleCurrencyQuery = require('./lib/google-currency-query');
const writeOpenLog = require('./lib/alert');
const schedule = require('node-schedule');
let targetAlarm;

function startJob(query, fee, interval) {
    let startTime = new Date(Date.now());
    let endTime = new Date(startTime.getTime() + (60 * 1000));

    schedule.scheduleJob('Google Currency Job', `*/${interval} * * * * *`, function () {
        googleCurrencyQuery({ query, fee }).then(results => {
            console.log(results);
            if (results.targetAmount <= targetAlarm) {
                writeOpenLog(results, targetAlarm);
            }
        }).catch(e => {
            console.log(e);
        })
    });
}

const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readLine.question('From (CAD, USD, AUS, REAIS): ', (from) => {
    let query = `1 ${from || 'cad'}`;

    readLine.question('To (CAD, USD, AUS, REAIS): ', (to) => {
        query = `${query} to ${to || 'reais'}`;

        readLine.question('Interval (sec): ', (input) => {
            let interval = input || 10;

            readLine.question('Fee (%): ', (input) => {
                let fee = input || '0.28';
                
                readLine.question('Target: ', (target) => {
                    readLine.close();

                    targetAlarm = target || 0;
                    startJob(query, `${fee}%`, interval);
                });
            });
        });
    });
});

