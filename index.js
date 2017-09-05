const async = require('async');
const Utils = require('./common/Utils');
const { transactionCoin, transactionCoinName, jubiProcedure, yunbiProcedure } = require('./common/Config');
const $ajax = require('./common/Ajax');
const JBO = require('./lib/jubi');
const YBO = require('./lib/yubi');
const querystring = require('querystring');

let totalAmount = 0; // 总金额
let JB_Obj = {
    CNY: 0,
    count: 0,
    buy: 0,
    sell: 0,
    currentPrice: 0,
    serviceAmount: 0
}
let YB_Obj = {
    CNY: 0,
    count: 10,
    buy: 0,
    sell: 0,
    currentPrice: 0,
    serviceAmount: 0
}

// 交易次数
let transactionCount = 0;
// 单笔交易数量
let transactionCoinNumber = 0.1;
// 单笔手续费用
let serviceAmount = 0;
// 类型
let type = '';

function restart() {
    console.log('5秒后开始下一笔交易...');
    console.log('');
    console.log('');
    console.log('');
    setTimeout(function () {
        start();
    }, 5000);
}

// 交易
let transaction = function(callBack) {
        if(type == 'JBT') {
            // JB_Obj.count = Utils.FloatSub(JB_Obj.count, transactionCoinNumber);
            // JB_Obj.CNY = Utils.FloatSub(Utils.FloatAdd(JB_Obj.CNY, Utils.FloatMul(JB_Obj.buy , transactionCoinNumber)), JB_Obj.serviceAmount);
            //
            // YB_Obj.count = Utils.FloatAdd(YB_Obj.count, transactionCoinNumber);
            // YB_Obj.CNY = Utils.FloatSub(Utils.FloatSub(YB_Obj.CNY,  Utils.FloatMul(YB_Obj.sell , transactionCoinNumber)), YB_Obj.serviceAmount);
            // setTimeout(function () {
            //     callBack(null);
            // }, 1000)
            JBO.createOrder({amount: transactionCoinNumber, price: JB_Obj.buy, type: 'sell', coin: transactionCoin}, function (res) {
                if(res.data && res.data.result) {
                    console.log('聚币交易完成....');
                }else {
                    console.log('聚币交易失败...' + res.data.code);
                }
            })

            YBO.createOrder({market: `${transactionCoin}cny`, side: 'buy', volume: transactionCoinNumber, price: YB_Obj.sell, ord_type: 'limit'}, function (res) {
                if(res.data) {

                }
            })
        }else if(type == 'YBT') {
            YB_Obj.count = Utils.FloatSub(YB_Obj.count, transactionCoinNumber);
            YB_Obj.CNY = Utils.FloatSub(Utils.FloatAdd(YB_Obj.CNY, Utils.FloatMul(YB_Obj.buy , transactionCoinNumber)), YB_Obj.serviceAmount);

            JB_Obj.count = Utils.FloatAdd(JB_Obj.count, transactionCoinNumber);
            JB_Obj.CNY = Utils.FloatSub(Utils.FloatSub(JB_Obj.CNY, Utils.FloatMul(JB_Obj.sell , transactionCoinNumber)), JB_Obj.serviceAmount);
            setTimeout(function () {
                callBack(null);
            }, 1000)
        }else {
            callBack('该笔交易不符合规则...');
        }
}

// 设置JB价格
let setJBPrice = function(callBack) {
    var timer = false;
    JBO.getCurrentPrice(function (res) {
        timer = true;
        if(res.retCode == 0) {
            let ret = res.data;
            JB_Obj.currentPrice = ret['last'];
            JB_Obj.buy = ret['buy'];
            JB_Obj.sell = ret['sell'];
            console.log(JB_Obj.currentPrice + '__聚币价格');
            callBack(null);
        }else {
            callBack('获取聚币网价格错误');
        }
    });
    // 5秒超时
    setTimeout(function () {
        if(!timer) {
            console.log('聚币');
            callBack(-2);
        }
    }, 5000);
}

// 获取聚币个人信息
let setJBProfile = function (callBack) {
    var timer = false;
    JBO.getProfileInfo(function (res) {
        timer = true;
        if(res.retCode == 0) {
            let ret = res.data;
            console.log(ret);
            // JB_Obj.CNY = ret['cny_balance'];
            // JB_Obj.count = ret[`${transactionCoin}_balance`];
            // callBack(null);
        }else {
            callBack('获取聚币个人信息有误...');
        }
    });
    // 5秒超时
    setTimeout(function () {
        if(!timer) {
            callBack(-2);
        }
    }, 5000);
}

// 获取云币个人信息
let setYBProfile = function (callBack) {
    var timer = false;
    YBO.getProfileInfo(function (res) {
        timer = true;
        if(res.retCode == 0) {
            let ret = res.data;
            let result = getCurrentCoinInfo(ret['accounts']);
            console.log(result);
            if(Object.keys(result).length == 2) {
                YB_Obj.CNY = result['cny'];
                YB_Obj.count = result[transactionCoin];
                callBack(null);
            }else {
                callBack('获取云币个人信息失败...');
            }
        }else {
            callBack('获取聚币个人信息有误...');
        }
    });
    // 5秒超时
    setTimeout(function () {
        if(!timer) {
            callBack(-2);
        }
    }, 5000);
}

function getCurrentCoinInfo(items) {
    var result = {};
    if(items.length > 0) {
        for(var i = 0; i < items.length; i++) {
            if(items[i]['currency'] == 'cny') {
                result['cny'] = items[i]['balance'];
                continue;
            }
            if(items[i]['currency'] == transactionCoin) {
                result[transactionCoin] = items[i]['balance'];
                continue;
            }
            if(Object.keys(result).length == 2) {
                break;
            }
        }
    }
    return result;
}

// 设置YB交易价格
let setYBPrice = function(callBack) {
    var timer = false;
    YBO.getCurrentPrice(function (res) {
        timer = true;
        if(res.retCode == 0) {
            let ret = res.data['ticker'];
            YB_Obj.currentPrice = ret['last'];
            YB_Obj.buy = ret['buy'];
            YB_Obj.sell = ret['sell'];
            console.log(YB_Obj.currentPrice + '_云币价格');
            callBack(null);
        }else {
            callBack('获取云币价格错误...');
        }
    })
    setTimeout(function () {
        if(!timer) {
            callBack(-2);
        }
    }, 5000);
}

// 数据展示
let showInfo = function (callBack) {
    let jbCoinAmount = Utils.FloatMul(JB_Obj.currentPrice , JB_Obj.count);
    let ybCoinAmount = Utils.FloatMul(YB_Obj.currentPrice , YB_Obj.count);
    let coinTotal = Utils.FloatAdd(jbCoinAmount, ybCoinAmount);
    totalAmount = Utils.FloatAdd(Utils.FloatAdd(JB_Obj.CNY, YB_Obj.CNY) , coinTotal);
    console.log('--------------------------------------------------------------------------------------------------------------');
    console.log(`总金额:${ totalAmount } 当前交易次数:${ transactionCount }`);
    console.log(`活动总金额: ${ Utils.FloatAdd(JB_Obj.CNY, YB_Obj.CNY) }`);
    console.log(`平台:JB网---类型:${ transactionCoinName } ---当前价格:${ JB_Obj.currentPrice }---当前币数目:${JB_Obj.count}---剩余活动资金:${JB_Obj.CNY}---买一:${JB_Obj.buy}---卖一:${JB_Obj.sell}`);
    console.log(`平台:YB网---类型:${ transactionCoinName } ---当前价格:${ YB_Obj.currentPrice }---当前币数目:${YB_Obj.count}---剩余活动资金:${YB_Obj.CNY}---买一:${YB_Obj.buy}---卖一:${YB_Obj.sell}`);
    console.log('--------------------------------------------------------------------------------------------------------------');
    callBack(null);
}

// 数据分析
let analysis = function (callBack) {
    if(JB_Obj.buy > YB_Obj.sell) {
        console.log('聚币卖,云币买...');
        if(JB_Obj.count > 1 && YB_Obj.count > 1 && YB_Obj.CNY > Utils.FloatMul(YB_Obj.sell, transactionCoinNumber)) {
            let spreadPrice = Utils.FloatMul(Utils.FloatSub(JB_Obj.buy, YB_Obj.sell), transactionCoinNumber);
            let jbServiceAmount = Utils.FloatMul(Utils.FloatMul(JB_Obj.buy, transactionCoinNumber), jubiProcedure);
            let ybServiceAmount = Utils.FloatMul(Utils.FloatMul(YB_Obj.sell, transactionCoinNumber), yunbiProcedure);
            let poundage = Utils.FloatAdd(jbServiceAmount, ybServiceAmount);
            JB_Obj.serviceAmount = jbServiceAmount;
            YB_Obj.serviceAmount = ybServiceAmount;
            console.log('差价:' + spreadPrice + '---手续费:' + poundage);
            if(spreadPrice > poundage) {
                type = 'JBT';
                callBack(null);
            }else {
                type = '';
                callBack('该笔交易无法盈利...');
            }
        }else {
            type = '';
            // -1代表暂停交易,余额不足或者币不足,请人工处理
            callBack(-1);
        }
    }else if(JB_Obj.sell < YB_Obj.buy) {
        console.log('云币卖,聚币买...');
        if( JB_Obj.count > 1 && YB_Obj.count > 1 && JB_Obj.CNY > Utils.FloatMul(JB_Obj.sell, transactionCoinNumber)) {
            let spreadPrice = Utils.FloatMul(Utils.FloatSub(YB_Obj.buy, JB_Obj.sell), transactionCoinNumber);
            let jbServiceAmount = Utils.FloatMul(Utils.FloatMul(JB_Obj.sell, transactionCoinNumber), jubiProcedure);
            let ybServiceAmount = Utils.FloatMul(Utils.FloatMul(YB_Obj.buy, transactionCoinNumber), yunbiProcedure);
            let poundage = Utils.FloatAdd(jbServiceAmount, ybServiceAmount);
            JB_Obj.serviceAmount = jbServiceAmount;
            YB_Obj.serviceAmount = ybServiceAmount;
            console.log('差价:' + spreadPrice + '---手续费:' + poundage);
            if(spreadPrice > poundage) {
                type = 'YBT';
                callBack(null);
            }else {
                type = '';
                callBack('该笔交易无法盈利...');
            }
        }else {
            type = '';
            // -1代表暂停交易,余额不足或者币不足,请人工处理
            callBack(-1);
        }
    }else {
        type = '';
        callBack('该笔交易无法盈利...');
    }
}

function start() {
    console.log('交易开始....');
    async.parallel([ setYBPrice, setJBPrice, setJBProfile, setYBProfile ], function (err, results) {
        if(err) {
            if(err == -2) {
                console.log('获取接口超时, 请重启程序....');
                process.exit();
            }else {
                console.log(err);
                restart();
            }
        }else {
            async.series([ showInfo, analysis ,transaction ], function (err, results) {
                if(err) {
                    if(err == -1) {
                        console.log('暂停交易,余额不足或者币不足,请人工及时处理...');
                    }else {
                        console.log(err);
                        restart();
                    }
                }else {
                    transactionCount ++;
                    console.log('恭喜你, 该笔交易成功!');
                    restart();
                }
            })
        }
    })
}

// 开始交易
console.log('启动交易程序....');
// start();
// 256加密
// YBO.getProfileInfo(function (res) {
//     console.log(res);
// })

// 下单接口
YBO.createOrder({ market:'gxscny', side:'buy', volume:'0.5', price:'24.0', ord_type:'limit'}, function (res) {
    console.log(res);
})

// 获取个人信息
// JBO.getProfileInfo(function (res) {
//     console.log(res);
// })

// setJBPrice(function () {
//     console.log(JB_Obj.buy);
//     JBO.createOrder({ amount: 1, price: JB_Obj.buy, type: 'sell', coin: transactionCoin }, function (res) {
//         console.log(res);
//     })
// });
