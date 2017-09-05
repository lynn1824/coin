/**
 * Created by jason on 2017/8/18.
 */
const Utils = require('../common/Utils')
const { ybSecretKey, ybAccessKey, transactionCoin } = require('../common/Config')
const $ajax = require('../common/Ajax');
const querystring = require('querystring');

// 基础数据
const BASE_URL = 'https://yunbi.com/';
let options = {
    hostname: 'yunbi.com',
    port: 443,
    method: 'POST'
}

var YAO = {
    // 获取当前价格信息
    getCurrentPrice: function (callBack) {
        const url = BASE_URL + 'api/v2/tickers/' + transactionCoin + 'cny.json';
        $ajax.get(url, function (res) {
            callBack(setRetInfo(res));
        })
    },

    // 获取个人数据信息
    getProfileInfo: function (callBack) {
        const tonce = Date.parse(new Date());
        const signature = Utils.ybCryptData(`GET|/api/v2/members/me.json|access_key=${ybAccessKey}&tonce=${tonce}`);
        const url = `${BASE_URL}api/v2/members/me.json?access_key=${ybAccessKey}&tonce=${tonce}&signature=${signature}`;
        $ajax.get(url, function (res) {
            callBack(setRetInfo(res));
        })
    },

    // 下单
    createOrder: function (data, callBack) {
        const tonce = Date.parse(new Date());
        data['tonce'] = tonce;
        data['access_key'] = ybAccessKey;
        let postData = querystring.stringify({
            access_key: data['access_key'],
            market: data['market'],
            ord_type: data['ord_type'],
            price:data['price'],
            side:data['side'],
            tonce: data['tonce'],
            volume:data['volume']
        });
        const signature = Utils.ybCryptData(`POST|/api/v2/orders.json|${postData}`)
        console.log(tonce);
        console.log(signature);
        postData += `&signature=${ signature }`;
        options['path'] = '/api/v2/orders.json';
        options['headers'] = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData, 'utf8')
        }
        // $ajax.post(options, postData, function (res) {
        //     callBack(setRetInfo(res));
        // })
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
        ret.retCode = res.retCode;
        ret.data = null;
        ret.message = res.message;
    }
    return ret;
}

module.exports = YAO;