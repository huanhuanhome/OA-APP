/*
 * @Author: BAICHONG
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-14 10:58:42
 */
/**
|--------------------------------------------------
| 静态常量文件
|--------------------------------------------------
*/

/**
 * 本地缓存静keys静态变量
 */
export const LOCALSTORAGE_KEYS = {
    USER_INFO: 'USER_INFO', // 用户信息
    MAPPING_CFG: 'MAPPING_CFG', // 数据字典
    TOKEN: 'TOKEN', // token
    SERVER_STATES_MESSAGE: 'SERVER_STATES_MESSAGE', // 服务器端返回的查询/状态信息
    PASSWORD: 'PASSWORD', // 密码
    IS_LEADER: 'hasLeading'
}

/**
 * 日历详情 打卡
 */
export const CARD_STATE = {
    WORK: 'NormalGoToWork', // 正常上班
    OFF_WORK: 'NormalGoOffWork', // 正常下班
    ABNORMAL: 'Abnormal', // 异常
    LATE: 'Late', // 迟到
    LEAVE_EARLY: 'LeaveEarly', // 早退
    HOLIDAY: 'Holiday', // 放假
    LATE_LEAVE_EARLY: 'LateAndLeaveEarly', // 迟到且早退
    LEDCLOCK: 'LeadershipRanks', // 判断是不是领导班子字段,
    LEADER_PUNCH: 'LedClock', // 领导打卡发送字段
    NOT_HITCARD: 'NotHitCard'
}
/**
 * 状态
 */
export const ATTENDANCE = {
    OUTING: 'Outing',
    OUTINGABNORMAL: 'OutingAbnormal',
    LEAVE: 'Leave',
    BUS_TRAVEL: 'BusinessTravel'
}
/**
 * 个人统计,打卡状态
 */
export const SIGN_MAP_CFG = {
    Normal: '正常',
    Late: '迟到',
    LeaveEarly: '早退',
    LateAndLeaveEarly: '迟到并且早退',
    Abnormal: '缺勤',
    Holiday: '',
    Outing: '外出',
    OutingAbnormal: '外出(异常)',
    Leave: '休假',
    BusinessTravel: '出差'
}

/**
 * 待办列表
 */
export const TO_DO_LIST = {
    MendClock: '补', // 补卡
    BusinessTravel: '差', // 出差
    Outing: '外', // 外出
    Leave: '假', // 请假
    CancelLeave: '销', // 销假
    Notice: '通', // 通知公告
    DEFAULT: '未' // 未知
}

/**
 * 工作流状态
 */
export const WORK_FLOW_STATE = {
    APPROVE: '已通过',
    APPROVE_VAL: 'APPROVE',
    APPROVE_COLOR: '#2ea756',

    REJECT: '已驳回',
    REJECT_COLOR: 'red',
    REJECT_VAL: 'REJECT',

    PUBLISH: '待审核',
    PUBLISH_VAL: 'PUBLISH',
    PUBLISH_COLOR: '#ff7200',

    UNDECLARED: '未申报',
    UNDECLARED_VAL: 'UNDECLARED',
    UNDECLARED_COLOR: '#2776BF',

    Audit: '审核中',
    Audit_VAL: 'Audit',
    Audit_COLOR: '#2776BF'

}
/**
 * 提醒圆圈内的字
 */
export const REMIND_TYPE_TEXT = {
    PartyFeePayAlertPerson: '缴', // 党费缴纳支付提醒
    PartyFeePersonalRemindPerson: '缴' // 党费缴纳个人提醒
}
// export const _STATE = {
//     WORK: 'Normal', // 正常
//     ABNORMAL: 'Abnormal', // 异常
//     LATE: 'Late', // 迟到
//     LEAVE_EARLY: 'LeaveEarly', // 早退
//     HOLIDAY: 'Holiday', // 放假
//     NOT_SIGN: 'NotHitCard', // 未开始打卡
//     LATE_LEAVE_EARLY: 'LateAndLeaveEarly', // 迟到并且早退,
//     All_STATE: 'AllState', // 全部，
//     ASK_FOR_LEAVE: 'AskForLeave', // 请假，
//     BUS_TRAVEL: 'BusTravel', // 出差，
//     GO_OUT: 'GoOut' // 外出,

// }

/**
 *
 */
// export const SPECIT = {
//     LeadershipRanks: 'LeadershipRanks' // 领导班子
// }

export const REMIND_TYPE = {
    PARYT_FEE_PERSONAL: 'PartyFeePersonalRemindPerson'
}
