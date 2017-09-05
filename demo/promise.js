/**
 * Created by jason on 2017/8/18.
 */

let interval = null;
function setJBPrice() {
    return new Promise(function (resolve, reject) {
        console.log('聚币...');
        setTimeout(function (test) {
            resolve();
        }, 2000)
    })
}

function setYBPrice() {
    return new Promise(function (resolve, reject) {
        console.log('云币...');
        setTimeout(function (test) {
            resolve();
        }, 2000)
    })
}

function setThree() {
    return new Promise(function (resolve, reject) {
        console.log('第三...');
        setTimeout(function () {
            // throw '我是第三异常了...'
        }, 2000)
    })
}

function start() {
    interval = setInterval(function () {
        if(interval) {
            clearInterval(interval);
        }
        setJBPrice()
            .then(setYBPrice())
            .then(setThree())
            .catch(function (e) {
                console.log(e, '5秒后重新启动交易...');
                start();
            })
    }, 5000);
}

start();