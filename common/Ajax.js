/**
 * Created by jason on 2017/8/17.
 */
const https = require('https');
const { URL } = require('url');

let result = {
    data: null,
    message: '',
    retCode: 0
}
var $ajax = {
    get: function (url, callBack) {
        https.get(url, (res) => {
            const { statusCode, statusMessage } = res;
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}; Status Message: ${statusMessage}`);
            }
            if (error) {
                // consume response data to free up memory
                res.resume();
                result.retCode = statusCode;
                result.message = error.message;
                callBack(result);
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    result.data = parsedData;
                    result.retCode = 0;
                    result.message = 'ok';
                    callBack(result);
                } catch (e) {
                    result.retCode = 10001;
                    callBack(result);
                }
            });
        });
    },
    post: function (options, contentStr, callBack) {
        let req = https.request(options, function (httpsRes) {
            const { statusCode, statusMessage } = httpsRes;
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}; Status Message: ${statusMessage}`);
            }
            if (error) {
                // consume response data to free up memory
                httpsRes.resume();
                result.retCode = statusCode;
                result.message = statusMessage;
                callBack(result);
                return;
            }

            httpsRes.setEncoding('utf8');
            let rawData = '';
            httpsRes.on('data', (chunk) => {
                rawData += chunk;
            });
            httpsRes.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    result.data = parsedData;
                    result.retCode = 0;
                    result.message = 'ok';
                } catch (e) {
                    result.retCode = 10001;
                }
                callBack(result);
            });
        });
        req.write(contentStr);
        req.end();
    }
}

module.exports = $ajax;

