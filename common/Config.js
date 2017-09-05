/**
 * Created by jason on 2017/8/23.
 */
const CURRENT_TRANSACTION_COIN = 'ans';
const CURRENT_TRANSACTION_COIN_NAME = '小蚁股';
const CURRENT_JUBI_PROCEDURE = 0.002; // 聚币手续费
const CURRENT_YUNBI_PROCEDURE = 0.0005; // 云币手续费

// 全局配置
let Config = {
    transactionCoin : CURRENT_TRANSACTION_COIN,
    transactionCoinName: CURRENT_TRANSACTION_COIN_NAME,
    jubiProcedure: CURRENT_JUBI_PROCEDURE,
    yunbiProcedure: CURRENT_YUNBI_PROCEDURE,
    ybAccessKey: '',
    ybSecretKey: '',
    jbAccessKey: '',
    jbSecretKey: ''
}

module.exports = Config;