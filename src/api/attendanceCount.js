import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 根据用户Id和日期(某一天)获取对应的考勤打卡记录(默认获取当前用户在今天的)
|
| 使用场景:
|   |— 打卡模块 @/pages/punch-sign/punchSign.vue
|
| 传参:  userId   day   月份:2018-01-01
|--------------------------------------------------
*/
export function getRealSignDayListByUserIdAndDate(userId, day) {
    return request({
        url: 'attendanceCount/getRealSignDayListByUserIdAndDate',
        method: 'GET',
        params: { userId, day }
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 根据用户Id和日期(某一天)获取对应的考勤打卡记录(默认获取当前用户在今天的)
|
| 使用场景:
|   |— 打卡模块 @/pages/punch-sign/punchSign.vue
|
| 传参:  userId   day   月份:2018-01-01
|--------------------------------------------------
*/
export function getAttendanceSummaryMapByUserIdAndStartAndEnd(params) {
    return request({
        url: 'attendanceCount/getAttendanceSummaryMapByUserIdAndStartAndEnd',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 根据用户Id和月份查询他在该月之内的考勤汇总数据
|
| 使用场景:
|   |— 个人统计 \pages\punch-sign\signInRecord.vue
|
| 传参:userId   month
|--------------------------------------------------
*/
export function getUserSignMonthCountByParameters(params) {
    return request({
        url: 'attendanceCount/getUserSignMonthCountByParameters',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 根据用户Id和日期查询某一天的考勤详细数据
|
| 使用场景:
|   |— 个人统计 \pages\punch-sign\signInRecord.vue
|
| 传参:userId   month
|--------------------------------------------------
*/
export function getSignDayListByUserIdAndDate(params) {
    return request({
        url: 'attendanceCount/getSignDayListByUserIdAndDate',
        method: 'GET',
        params
    })
}
// 查询某个组织下所有的人员在该段时间之内的考勤打卡统计记录
export function getOrgSignListByParameters(params) {
    return request({
        url: 'attendanceCount/getOrgSignListByParameters',
        method: 'GET',
        params
    })
}
// 查询某个组织下(包括它的孩子) 所有的人员在该段时间之内的考勤打卡统计数量
export function getAttendanceCountDmnObjByParameters(params) {
    return request({
        url: 'attendanceCount/getAttendanceCountDmnObjByParameters',
        method: 'GET',
        params
    })
}
// 部门人员列表
// 使用场景：部门日统计  人员列表显示
export function getUserSignListByParameters(params) {
    return request({
        url: 'attendanceCount/getUserSignListByParameters',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 根据specialType: LeadershipRanks查询领导是否在线
|   |- getOrgLevelSpecialTypeUserList
|   |- import { getOrgLevelSpecialTypeUserList } from '@/api/attendanceStandardSetting'
| 使用场景:
|   |— 领导在线 @/pages/leader-online/_leaderOnline.vue
|
| 传参:  specialType: LeadershipRanks
|--------------------------------------------------
*/
export function getOrgLevelSpecialTypeUserList() {
    return request({
        url: 'attendanceCount/getOrgLevelSpecialTypeUserList',
        method: 'GET',
        params: { specialType: 'LeadershipRanks' }
    })
}
