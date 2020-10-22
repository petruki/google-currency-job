const axios = require('axios');

function sendMessage(results, target) {
    try {
        const payload = {
            text: 
                `*From*: ${results.source}\n` +
                `*To*: ${results.target}\n` +
                `*Fee*: ${results.fee}\n` +
                `*Current converion*: ${results.targetAmount}\n` +
                `*Current converion (fee)*: ${results.targetFeeAmount}\n\n` +
                `*Alarm set to*: ${target}`
            };
            
        axios.post(process.env.SLACK_HOOK, payload).then(() => process.exit(0));
    } catch (e) {
        console.log(e);
    }
}

module.exports = sendMessage;