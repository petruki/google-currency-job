const { googleCurrencyQuery } = require('./lib/google-currency-query');
const writeOpenLog = require('./lib/notepad-alert');
const sendMessage = require('./lib/slack-hook');
let targetAlarm;

const notepad_alert = process.env.NOTEPAD_ALERT ? process.env.NOTEPAD_ALERT === 'true' : false;
const slack_alert = process.env.SLACK_ALERT ? process.env.SLACK_ALERT === 'true' : false;

console.log(`### Google Currency Job Settings ###`);
console.log(`Notepad alert is: ${notepad_alert}`);
console.log(`Slack alert is: ${slack_alert}\n`);

function startJob(query, fee, interval) {
    setInterval(() => {
        googleCurrencyQuery({ query, fee }).then(results => {
            console.log(results);
            if (results.targetAmount <= targetAlarm) {
                if (notepad_alert) writeOpenLog(results, targetAlarm);
                if (slack_alert) sendMessage(results, targetAlarm);

                targetAlarm = results.targetAmount - 0.01;
                console.log(`### Target alarm changed to: ${targetAlarm.toFixed(2)}`);
            }
        }).catch(e => {
            console.log(e);
        })
    }, interval * 1000);
}

const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readLine.question('From: ', (from) => {
    let query = `1 ${from || 'cad'}`;

    readLine.question('To: ', (to) => {
        query = `${query} to ${to || 'reais'}`;

        readLine.question('Interval (sec): ', (input) => {
            let interval = input || 10;

            readLine.question('Fee (%): ', (input) => {
                let fee = input || '0.28';

                readLine.question('Target: ', (target) => {
                    readLine.close();
                    targetAlarm = target || 0;

                    console.log(`\nQuery: ${query}`);
                    console.log(`Interval: ${interval}\n`);
                    startJob(query, `${fee}%`, interval);
                });
            });
        });
    });
});

