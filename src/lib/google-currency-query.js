const request = require('request');
const cheerio = require('cheerio');

function getResults({ data, fee }) {
    const $ = cheerio.load(data);

    const result = {
        sourceAmount: undefined,
        targetAmount: undefined,
        source: undefined,
        target: undefined,
        fee: undefined,
        targetFeeAmount: undefined
    };

    const values = $('span.DFlfde').contents();
    values.each((index, elem) => {
        if (index === 0) {
            result.sourceAmount = elem.data;
        } else {
            result.targetAmount = elem.data;
        }
        
    });

    const currencies = $('span.vLqKYe, span.MWvIVe').contents();
    currencies.each((index, elem) => {
        if (index === 0) {
            result.source = elem.data;
        } else {
            result.target = elem.data;
        }
    });


    if (fee) {
        result.fee = fee;
        result.targetFeeAmount = parseFloat(result.targetAmount * (fee/10 + 1)).toFixed(2);
    }

    result.date = new Date().toString();

    return result;
}

function googleCurrencyQuery(config) {
    const {
        query,
        userAgent,
        fee,
        options = {}
    } = config;

    const defaultOptions = {
        url: 'https://www.google.com/search',
        qs: {
            q: query
        },
        headers: {
            'User-Agent': userAgent ||
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0'
        }
    };

    return new Promise((resolve, reject) => {
        request(
            Object.assign({}, defaultOptions, options),
            (error, response, body) => {
                if (error) {
                    return reject(`Error making web request: ${error}`, null);
                }

                if (response.statusCode !== 200) {
                    return reject(cheerio.load(response.body).text());
                }

                const results = getResults({
                    data: body, fee
                });

                return resolve(results);
            }
        );
    });
}

const log = (results, target) => {
    return {
        text:
            `*Alert*: ${results.date}\n\n` +

            `*From*: ${results.source}\n` +
            `*To*: ${results.target}\n` +
            `*Fee*: ${results.fee}\n` +
            `*Current converion*: ${results.targetAmount}\n` +
            `*Current converion (fee)*: ${results.targetFeeAmount}\n\n` +
            
            `*Alarm set to*: ${target}`
    };
};

module.exports = {
    googleCurrencyQuery,
    log
}