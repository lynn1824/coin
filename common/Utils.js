/**
 * Created by jason on 2017/8/17.
 */
const crypto = require('crypto');
const config = require('./Config');

let Utils = {
    //获取参数精度，如果为整数则精度为0
    _getPrecision: function (arg) {
        if (!arg) {
            console.log(this._getPrecision.caller);
        }
        if (arg.toString().indexOf(".") == -1) {
            return 0;
        } else {
            return arg.toString().split(".")[1].length;
        }
    },
    //获取小数的整数形式
    _getIntFromFloat: function (arg) {
        if (arg.toString().indexOf(".") == -1) {
            return arg;
        } else {
            return Number(arg.toString().replace(".", ""));
        }
    },

    //浮点数加法运算
    FloatAdd: function (arg1, arg2) {
        var precision1 = this._getPrecision(arg1);
        var precision2 = this._getPrecision(arg2);
        var temp = Math.pow(10, Math.max(precision1, precision2));
        return (this.FloatMul(arg1, temp) + this.FloatMul(arg2, temp)) / temp;
    },

    //浮点数减法运算
    FloatSub: function (arg1, arg2) {
        var precision1 = this._getPrecision(arg1);
        var precision2 = this._getPrecision(arg2);
        var temp = Math.pow(10, Math.max(precision1, precision2));
        return (this.FloatMul(arg1, temp) - this.FloatMul(arg2, temp)) / temp;
    },

    //浮点数乘法运算
    FloatMul: function (arg1, arg2) {
        if (!arg1 || !arg2) {
            console.log('*...sfasf' + this.FloatMul.caller);
        }
        var precision1 = this._getPrecision(arg1);
        var precision2 = this._getPrecision(arg2);
        var tempPrecision = 0;

        tempPrecision += precision1;
        tempPrecision += precision2;
        var int1 = this._getIntFromFloat(arg1);
        var int2 = this._getIntFromFloat(arg2);
        return (int1 * int2) * Math.pow(10, -tempPrecision);
    },

    //浮点数除法运算
    FloatDiv: function (arg1, arg2) {
        var precision1 = this._getPrecision(arg1);
        var precision2 = this._getPrecision(arg2);
        var int1 = this._getIntFromFloat(arg1);
        var int2 = this._getIntFromFloat(arg2);
        var result = (int1 / int2) * Math.pow(10, precision2 - precision1);
        return result;
    },

    // 云币数据加密
    ybCryptData: function (content) {
        return crypto.createHmac('sha256', config.ybSecretKey).update(content).digest('hex');
    },

    // 聚币数据加密
    jbCryptData: function (content) {
        return crypto.createHmac('sha256', md5(config.jbSecretKey)).update(content).digest('hex');
    }
}

// md5加密
function md5(content) {
    const md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
}

module.exports = Utils;