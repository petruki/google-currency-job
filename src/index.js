const { googleCurrencyQuery } = require('./lib/google-currency-query');
const writeOpenLog = require('./lib/notepad-alert');
const sendMessage = require('./lib/slack-hook');

let targetAlarm, maxTarget = 0, minTarget = Number.MAX_VALUE;
let query, interval, fee, lastResults, timer = 1;

const notepad_alert = process.env.NOTEPAD_ALERT ? process.env.NOTEPAD_ALERT === 'true' : false;
const slack_alert = process.env.SLACK_ALERT ? process.env.SLACK_ALERT === 'true' : false;

const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const printConsole = (results) => {
    console.clear();
    console.log(`### Google Currency Job Settings ###`);
    console.log(`Notepad alert is: ${notepad_alert ? 'enabled' : 'disabled'}`);
    console.log(`Slack alert is: ${slack_alert ? 'enabled' : 'disabled'}\n\n`);

    if (targetAlarm) {
        console.log(`- Target: ${targetAlarm}`);
        console.log(`- Max: ${maxTarget}`);
        console.log(`- Min: ${minTarget}\n\n`);
        console.log(results);
    }
};

const progress = () => {
    printConsole(lastResults);
    console.log(`\n-> Next query: ${((timer++ * 100)/interval).toFixed(1)}%`);
}

const job = () => {
    googleCurrencyQuery({ query, fee }).then(results => {
        lastResults = results;
        timer = 1;

        if (results.targetAmount >= maxTarget) maxTarget = results.targetAmount;
        if (results.targetAmount <= minTarget) minTarget = results.targetAmount;

        printConsole(results);

        if (results.targetAmount <= targetAlarm) {
            if (notepad_alert) writeOpenLog(results, targetAlarm);
            if (slack_alert) sendMessage(results, targetAlarm);

            targetAlarm = (results.targetAmount - 0.01).toFixed(2);
            printConsole(results);
        }
    }).catch(e => {
        console.log(e);
    });
};

const scheduleJob = (query, fee, interval) => {
    job();
    setInterval(() => job(), interval * 1000);
    setInterval(() => progress(), 1000);
};

const askFrom = () => {
    return new Promise((resolve, reject) => {
        readLine.question('From: ', (answer) => {
            query = `1 ${answer || 'cad'}`;
            resolve();
        });
    });
};

const askTo = () => {
    return new Promise((resolve, reject) => {
        readLine.question('To: ', (answer) => {
            query = `${query} to ${answer || 'reais'}`;
            resolve();
        });
    });
};

const askInterval = () => {
    return new Promise((resolve, reject) => {
        readLine.question('Interval (sec): ', (answer) => {
            interval = answer || 10;
            resolve();
        });
    });
};

const askFee = () => {
    return new Promise((resolve, reject) => {
        readLine.question('Fee (%): ', (answer) => {
            fee = answer || '0.28';
            resolve();
        });
    });
};

const askTarget = () => {
    return new Promise((resolve, reject) => {
        readLine.question('Target: ', (target) => {
            targetAlarm = target || 1;
            resolve();
        });
    });
};

const startJob = () => {
    return new Promise((resolve, reject) => {
        console.log(`\nQuery: ${query}`);
        console.log(`Interval: ${interval}\n`);
        scheduleJob(query, `${fee}%`, interval);
        resolve();
    })
};
  
const main = async () => {
    await askFrom()
    await askTo()
    await askInterval()
    await askFee()
    await askTarget()
    await startJob()
    readLine.close()
};

main();