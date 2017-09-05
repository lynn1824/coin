let http = require('http');
let Utils = require('./common/Utils');
let totalAmount = 200000;
let JB_Obj = {
    CNY: 50000,
    ANSCount: 1000,
    currentPrice: 50
}
let YB_Obj = {
    CNY: 53000,
    ANSCount: 1000,
    currentPrice: 47
}

// 交易次数
let transactionCount = 0;
// 单笔交易数量
let transactionCoinNumber = 2;

let interval = null
function start() {
    if (Math.random() > 0.5) {
        JB_Obj.currentPrice = Utils.FloatSub(JB_Obj.currentPrice, Math.random());
        YB_Obj.currentPrice = Utils.FloatSub(YB_Obj.currentPrice, Math.random());
    } else {
        JB_Obj.currentPrice = Utils.FloatAdd(JB_Obj.currentPrice, Math.random());
        YB_Obj.currentPrice = Utils.FloatAdd(YB_Obj.currentPrice, Math.random());
    }
    let jbCoinAmount = Utils.FloatMul(JB_Obj.currentPrice , JB_Obj.ANSCount);
    let ybCoinAmount = Utils.FloatMul(YB_Obj.currentPrice , YB_Obj.ANSCount);
    let coinTotal = Utils.FloatAdd(jbCoinAmount, ybCoinAmount);

    console.log('--------------------------------------------------------------------------------------------------------------');
    console.log(`总金额:${ Utils.FloatAdd(Utils.FloatAdd(JB_Obj.CNY, YB_Obj.CNY) , coinTotal) } 当前交易次数:${ transactionCount }`);
    console.log(`活动总金额: ${ Utils.FloatAdd(JB_Obj.CNY, YB_Obj.CNY) }`);
    console.log(`平台:聚币网---类型:小蚁股---当前价格:${ JB_Obj.currentPrice }---当前币数目:${JB_Obj.ANSCount}---剩余活动资金:${JB_Obj.CNY}`);
    console.log(`平台:云币网---类型:小蚁股---当前价格:${ YB_Obj.currentPrice }---当前币数目:${YB_Obj.ANSCount}---剩余活动资金:${YB_Obj.CNY}`);
    console.log('--------------------------------------------------------------------------------------------------------------');
    interval = setInterval(function () {
        if (interval) {
            clearInterval(interval);
        }
        console.log('开始交易...');
        transaction().then(function (res) {
            transactionCount++;
            if (res === 0) {
                console.log('交易完成!!!, 5秒后继续开始交易...');
                start();
            } else {
                console.log('交易失败!!åå');
            }
        }, function (err) {
            console.log(err);
        })
    }, 5000);
}

function transaction() {
    return new Promise(function (resolve, reject) {
        if (JB_Obj.currentPrice > YB_Obj.currentPrice) {
            JB_Obj.ANSCount = Utils.FloatSub(JB_Obj.ANSCount, transactionCoinNumber);
            JB_Obj.CNY = Utils.FloatAdd(JB_Obj.CNY, Utils.FloatMul(JB_Obj.currentPrice , transactionCoinNumber));

            YB_Obj.ANSCount = Utils.FloatAdd(YB_Obj.ANSCount, transactionCoinNumber);
            YB_Obj.CNY = Utils.FloatSub(YB_Obj.CNY, Utils.FloatMul(YB_Obj.currentPrice , transactionCoinNumber));
        } else {
            JB_Obj.ANSCount = Utils.FloatAdd(JB_Obj.ANSCount, transactionCoinNumber);
            JB_Obj.CNY = Utils.FloatSub(JB_Obj.CNY, Utils.FloatMul(JB_Obj.currentPrice , transactionCoinNumber));

            YB_Obj.ANSCount = Utils.FloatSub(YB_Obj.ANSCount, transactionCoinNumber);
            YB_Obj.CNY = Utils.FloatAdd(YB_Obj.CNY, Utils.FloatMul(YB_Obj.currentPrice, transactionCoinNumber));
        }
        setTimeout(function () {
            resolve(0);
        }, 3000)
    })
}

// function getCurrentCoinPrice() {
//     let jubiUrl = 'https://www.jubi.com/api/v1/ticker?coin=btc';
//     let yunbiUrl = 'https://yunbi.com/api/v2/tickers/btccny.json';
//     return new Promise(function (resolve, reject) {
//         try {
//             $ajax.get(jubiUrl, function (res) {
//                 if(res.statusCode == 200) {
//                     resolve(res);
//                 }else {
//                     throw SQLException('异常...');
//                 }
//             })
//         }catch (e) {
//             reject(e.message);
//         }
//     })
// }

function test() {
    async.parallel([
        function (cb) {
            console.log(111);
            setTimeout(function () {
                console.log(1);
                cb(null, '3s');
            }, 3000)
        },
        function (cb) {
            console.log(222);
            setTimeout(function () {
                console.log(2);
                cb(null, '1s');
            }, 1000);
        },
        function (cb) {
            console.log(333);
            setTimeout(function () {
                console.log(3);
                cb(null, '4s');
            }, 4000)
        }
    ], function (err, results) {
        console.log(err);
        console.log('result:-->' + results);
        async.series([
            function (cb) {
                setTimeout(function () {
                    console.log('here');
                    cb(null, 'hahah');
                }, 3000)
            },
            function (cb) {
                setTimeout(function () {
                    console.log('hi');
                    cb(null, 'hi..');
                }, 2000)
            }
        ], function (err, results) {
            if(err == null) {
                console.log(results)
            }
        });
    });
}

// 开始交易
console.log('启动交易程序....');
start();