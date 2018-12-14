/**
|--------------------------------------------------
| 提醒模块相关接口
|--------------------------------------------------
*/
import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 预警提醒日历 - remindAndMemoCalendar
|
| 使用场景:
|   |— 提醒日历 @\component\bimCalendarMsg\bimCalendarMsg.vue
|
| 传参:   month    月
|--------------------------------------------------
*/
export function remindAndMemoCalendar(params) {
    return request({
        url: 'remind/remindAndMemoCalendar',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 根据用户Id获取全部的提醒信息数据接口 - remindCalendar
|
| 使用场景:
|   |— 提醒日历 @\component\bimCalendarMsg\bimCalendarMsg.vue
|
| 传参:   userId:用户id  filter:过滤条件  date:  dateType:month day
|--------------------------------------------------
*/
export function getRemindListByInfo(params) {
    return request({
        url: 'remind/getRemindListByInfo',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 根据用户Id获取全部的提醒信息数据接口 - remindCalendar
|
| 使用场景:
|   |— 提醒日历 @\component\bimCalendarMsg\bimCalendarMsg.vue
|
| 传参:   userId:用户id  filter:过滤条件  startDt:开始时间  endDt:结束时间
|--------------------------------------------------
*/
export function getRemindListByUserId(params) {
    return request({
        url: 'remind/getRemindListByUserId',
        method: 'GET',
        params
    })
}

