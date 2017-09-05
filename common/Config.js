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
    ybAccessKey: 'xTkGPA4xLW1ps3aK26675iR4dxmc7AMyPITC3wP8',
    ybSecretKey: '1wOTWiEoeGWRp5RIiPzxKKFDvtnUlG0zX1p7Crm4',
    jbAccessKey: 'bgv5z-thytr-cmu5t-r4ehk-4u55b-r4ifb-2rtww',
    jbSecretKey: ']UxYF-a9a)j-(Usuf-*C26M-t,U{m-2*2//-*PHrv'
}

module.exports = Config;