/*
|--------------------------------------------------
| 党费--partyFeePayment
|--------------------------------------------------
*/
import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 党费缴纳记录 -getPartyFeePaymentRecord
|
| 引用方式:
|   |— import { getPartyFeePaymentRecord } from '@/api/partyCost'
|
| 使用场景:
|   |— 党员或者支部书记缴费记录 pages/party-cost/partyMemberPage.vue
|
| 传参:  无
|--------------------------------------------------
*/
export function getPartyFeePaymentRecord(data) {
    return request({
        url: 'partyFeePayment/getPartyFeePaymentRecord',
        method: 'GET',
        params: data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 党支部统计 -getPaymentStatisticsByYearAndUserId
|
| 引用方式:
|   |— import { getPaymentStatisticsByYearAndUserId } from '@/api/partyCost'
|
| 使用场景:
|   |— 党员或者支部书记缴费记录 pages/party-cost/partyMemberPage.vue
|
| 传参:  无
|--------------------------------------------------
*/
export function getPaymentStatisticsByYearAndUserId(data) {
    return request({
        url: 'partyFeePayment/getPaymentStatisticsByYearAndUserId',
        method: 'GET',
        params: data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 党员缴费记录页面是否自动弹出支付区域 -getPageToShow
|
| 引用方式:
|   |— import { getPageToShow } from '@/api/partyCost'
|
| 使用场景:
|   |— 党员或者支部书记缴费记录 pages/party-cost/partyMemberPage.vue
|
| 传参:  无
|--------------------------------------------------
*/
export function getPageToShow(params) {
    return request({
        url: 'partyFeePayment/getPageToShow',
        method: 'GET',
        params
    })
}

// 通过年份和用户Id（非必需），判断这年是否有党费通用和个人设置
export function ifSetCommonAndPersonSetting(year, userId) {
    return request({
        url: '/partyFeePayment/getIfSetCommonAndPersonSetting',
        method: 'GET',
        params: {
            year,
            userId
        }
    })
}

// 在提醒页面中，如果是党费个人缴纳，返回需要缴纳的钱数 userId 非必填
export function getPartyFeeMessage(userId) {
    return request({
        url: '/partyFeePayment/getPartyFeeMoney',
        method: 'GET',
        params: {
            userId
        }
    })
}
