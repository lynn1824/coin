/**
 * Created by jason on 2017/8/18.
 */
const Utils = require('../common/Utils')
let { jbSecretKey, jbAccessKey, transactionCoin } = require('../common/config');
const $ajax = require('../common/Ajax');
const CURRENT_TRANSACTION_COIN = 'ans';
const BASE_URL = 'https://www.jubi.com';
const querystring = require('querystring');

let options = {
    hostname: 'www.jubi.com',
    port: 443,
    method: 'POST'
}

var JAO = {
    getCurrentPrice: function (callBack) {
        const url = BASE_URL + '/api/v1/ticker?coin=' + transactionCoin;
        $ajax.get(url, function (res) {
            callBack(setRetInfo(res));
        })
    },

    // 获取个人数据信息
    getProfileInfo: function (callBack) {
        const nonce = Date.parse(new Date());
        const signature = Utils.jbCryptData(`key=${ jbAccessKey }&nonce=${ nonce }`);
        let postData = `key=${ jbAccessKey }&nonce=${ nonce }&signature=${ signature }`;
        options['path'] = '/api/v1/balance';
        options['headers'] = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData, 'utf8')
        }
        $ajax.post(options, postData, function (res) {
            callBack(setRetInfo(res));
        })
    },

    // 下单
    createOrder: function (data, callBack) {
        const nonce = Date.parse(new Date());
        data['nonce'] = nonce;
        data['key'] = jbAccessKey;
        let postData = querystring.stringify(data);
        const signature = Utils.jbCryptData(postData);
        postData += `&signature=${ signature }`;
        options['path'] = '/api/v1/trade_add';
        options['headers'] = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData, 'utf8')
        }
        $ajax.post(options, postData, function (res) {
            callBack(setRetInfo(res));
        })
    }
}

// 设置结果
function setRetInfo(res) {
    // 返回结果
    let ret = { retCode: 0, data: null, message: '' }
    if(res.retCode == 0) {
        ret.retCode = 0;
        ret.message = 'success';
        ret.data = res.data;
    }else {
        ret.retCode = -1;
        ret.data = null;
    }
    return ret;
}

module.exports = JAO;