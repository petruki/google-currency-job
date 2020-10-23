const axios = require('axios');
const { log } = require('./google-currency-query');

function sendMessage(results, target) {
    try {
        const payload = log(results, target);
        axios.post(process.env.SLACK_HOOK, payload);
    } catch (e) {
        console.log(e);
    }
}

module.exports = sendMessage;