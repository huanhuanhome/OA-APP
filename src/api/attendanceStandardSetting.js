/**
|--------------------------------------------------
| 考勤打卡
|--------------------------------------------------
*/
import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 根据用户Id获取唯一的可用的签到地点设置Entity(默认获取当前用户) -getSignInfoByUserId
|
| 使用场景:
|   |— 打卡模块 @/pages/punch-sign/punchSign.vue
|
| 传参:  用户id
|--------------------------------------------------
*/
export function getSignInfoByUserId(userId) {
    return request({
        url: 'attendanceStandardSetting/getSignInfoByUserId',
        method: 'GET',
        params: { userId }
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 根据用户Id和日期获取当前是否需要上班(默认获取当前用户在今天的) -judgeWorkByUserIdAndDate
|
| 使用场景:
|   |— 打卡模块 @/pages/punch-sign/punchSign.vue
|
| 传参:  userId    用户id
|       day       2018-01-01时间(到天)
|--------------------------------------------------
*/
export function judgeWorkByUserIdAndDate(userId, day) {
    return request({
        url: 'attendanceStandardSetting/judgeWorkByUserIdAndDate',
        method: 'GET',
        params: { userId, day }
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 日历考勤打卡记录 -getSignMonthCalendarListByUserIdAndDate
|
| 使用场景:
|   |— 日历模块 @/component/bimCalendarPer/bimCalendarPer.vue
|               @/component/bimCalendarStat/bimCalendarStat.vue
| 传参:  month    2018-01(时间,到月)
|--------------------------------------------------
*/
export function getSignMonthCalendarListByUserIdAndDate(params) {
    return request({
        url: 'attendanceStandardSetting/getSignMonthCalendarListByUserIdAndDate',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 查询用户所在主职的组织下所有的人员在该段时间之内的考勤打卡统计记录(个人统计) -getDepartmentSignStatisticsByParameters
|
| 使用场景:
|   |— 部门统计模块 @/pages/punch-sign/departStatistics.vue
|
| 传参:  userId:    用户id
|       userName:  模糊查询用户名字
|       signState: 考核类型
|       date:      日期(格式:2018-01-01/2018-01)[默认获取当前时间]
|       dateType:  日期类型(日:day,月:month)[默认日:day]
|--------------------------------------------------
*/
export function getDepartmentSignStatisticsByParameters(params) {
    return request({
        url: 'attendanceStandardSetting/getDepartmentSignStatisticsByParameters',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 查询用户所在主职的组织下所有的人员在该段时间的考勤打卡统计Map -getDepartmentSignStatisticsByParameters
|
| 使用场景:
|   |— 部门统计模块 @/pages/punch-sign/departStatistics.vue
|
| 传参:  userId:    用户id
|       userName:  模糊查询用户名字
|       signState: 考核类型
|       date:      日期(格式:2018-01-01/2018-01)[默认获取当前时间]
|       dateType:  日期类型(日:day,月:month)[默认日:day]
|--------------------------------------------------
*/
export function departmentCountMap(params) {
    return request({
        url: 'attendanceStandardSetting/departmentCountMap',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 根据用户Id和日期(具体某一天)获取当前是否需要上班(默认获取当前用户在今天的)
|   |- import { judgeHasHolidayByDateAndOrgId } from '@/api/attendanceStandardSetting'
| 使用场景:
|   |— src\pages\punch-sign\punchSign.vue
|
| 传参:  无
|--------------------------------------------------
*/
export function judgeHasHolidayByDateAndOrgId() {
    return request({
        url: 'attendanceStandardSetting/judgeHasHolidayByDateAndOrgId',
        method: 'GET',
        params: { specialType: 'LeadershipRanks' }
    })
}

