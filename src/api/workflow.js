/**
|--------------------------------------------------
| 工作流接口
|--------------------------------------------------
*/
import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 获取补签页面初始化接口 - clockInit
|
| 使用场景:
|   |— 补卡模块  @/pages/applyForCard/applyOuting.vue
|
| 传参:  无
|--------------------------------------------------
*/
export function clockInit() {
    return request({
        url: 'workflow/clock/init',
        method: 'GET'
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 发起补签申请 - publish
|
| 使用场景:
|   |— 补卡模块  @/pages/applyForCard/applyOuting.vue
|
| 传参: details:  申请补卡数据item
|       approveUid: 审批人id
|       approveOrgI: orgid
|       createUid: 创建人id
|	    createOrgId : 创建人组织id
|	    createName: 创建人名字
|	    createOrgName: 组织名字
|       leaderPublish: 是不是领导发布
|	    republish:发布
|--------------------------------------------------
*/
export function publish(data) {
    return request({
        url: 'workflow/clock/publish',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 获取待办任务列表接口 - todoList
|
| 使用场景:
|   |— 待办已完成  @/pages/applyForCard/applyOuting.vue
|
| 传参: pageSize: 每页数据条数
|       pageNo: 页
|--------------------------------------------------
*/
export function todoList(data) {
    return request({
        url: 'workflow/task/todoList',
        method: 'POST',
        data
    })
}
/*
|--------------------------------------------------
| 接口:
|   |— 获取已完成任务列表接口 - allHistoryList
|
| 使用场景:
|   |— 待办已完成  /pages/to-do-list/_toDoList.vue
|
| 传参: pageSize: 每页数据条数
|       pageNo: 页
|--------------------------------------------------
*/
export function allHistoryList(data) {
    return request({
        url: 'workflow/task/allHistoryList',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 获取待办详情 - getTodoDetail
|
| 使用场景:
|   |— 待办已完成  /pages/to-do-list/approveCard.vue
|
| 传参: taskId: 待办id
|--------------------------------------------------
*/
export function getTodoDetail(taskId) {
    return request({
        url: 'workflow/common/getTodoDetail',
        method: 'GET',
        params: { taskId }
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 获取已完成详情 - getHisDetail
|
| 使用场景:
|   |— 待办已完成  /pages/to-do-list/approveCompleted.vue
|
| 传参: hisTaskId: 已完成id
|--------------------------------------------------
*/
export function getHisDetail(hisTaskId) {
    return request({
        url: 'workflow/common/getHisDetail',
        method: 'GET',
        params: { hisTaskId }
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 补签审批接口 - approve
|
| 使用场景:
|   |— 待办已完成  /pages/to-do-list/approveCard.vue
|
| 传参: 待办详情数据加上 option: {
|                            option: ''// 意见,
|                            agree: true/false
|                        }
|--------------------------------------------------
*/
export function approve(data) {
    return request({
        url: 'workflow/clock/approve',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 获取待办消息数量 - todoCount
|
| 使用场景:
|   |— 待办已完成  src\pages\to-do-list\_toDoList.vue
|
| 传参: 无
|--------------------------------------------------
*/
export function todoCount() {
    return request({
        url: 'workflow/task/todoCount',
        method: 'POST'
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 获取出差申请页面初始化接口 - travelInit
|
| 使用场景:
|   |— 出差申请页  src\pages\business-travel\_businessTravel.vue
|
| 传参: 无
|--------------------------------------------------
*/
export function travelInit() {
    return request({
        url: 'workflow/travel/init',
        method: 'GET'
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 验证签到相关工作时间 - approve
|
| 使用场景:
|   |— 出差申请选择时间后验证
|
| 传参:   params = {
|                   beginDate:,
|                    endDate: ,
|                    moduleName: 'BusinessTravel'
|                }
|--------------------------------------------------
*/
export function validateSignFlowDate(data) {
    return request({
        url: '/workflow/common/validateSignFlowDate',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 发起出差申请
|
| 使用场景:
|   |— 出差申请
|
| 传参:   params = { 用户填写数据
|                }
|--------------------------------------------------
*/
export function travelPublish(data) {
    return request({
        url: '/workflow/travel/publish',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 出差详情接口
|
| 使用场景:
|   |— 出差详情查看
|
| 传参:   无
|
|--------------------------------------------------
*/
export function travelDetail(id) {
    return request({
        url: 'workflow/travel/detail',
        method: 'GET',
        params: { id }
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 出差列表
|
| 使用场景:
|   |— 出差列表查看
|
| 传参:
|          {
|             year:年度
|             beginDate (string, optional): 起始时间 ,
|             endDate (string, optional): 结束时间 ,
|             keyWord (string, optional): 关键字 ,
|             pageNo (integer, optional): 页序号 ,
|             pageSize (integer, optional): 页大小
|          }
|--------------------------------------------------
*/
export function travelList(data) {
    return request({
        url: 'workflow/travel/list',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 出差审批
|
| 使用场景:
|   |—
|
| 传参:
|--------------------------------------------------
*/
export function travelApprove(data) {
    return request({
        url: 'workflow/travel/approve',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 获取外出页面初始化接口 - outingInit
|
| 使用场景:
|   |— 外出页  src\pages\go-out\_goOut.vue
|
| 传参: 无
|--------------------------------------------------
*/
export function outingInit() {
    return request({
        url: 'workflow/outing/init',
        method: 'GET'
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 外出申请发起 - outingPublish
|
| 使用场景:
|   |— 外出页  src\pages\go-out\_goOut.vue
|
| 传参: 无
|--------------------------------------------------
*/
export function outingPublish(data) {
    return request({
        url: 'workflow/outing/publish',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 显示我发起的外出列表 - getOutingListByParameters
|
| 使用场景:
|   |— 外出页  src\pages\go-out\goOutlist.vue
|
| 传参: startDate endDate filter pageNo pageSize
|--------------------------------------------------
*/
export function getOutingListByParameters(params) {
    return request({
        url: 'workflow/outing/getOutingListByParameters',
        method: 'GET',
        params
    })
}

// POST /rest/workflow/notice/publish
/*
|--------------------------------------------------
| 接口:POST
|   |— 发起公告 - publishNotice
|
| 使用场景:
|   |— 发起通知公告模块  /pages/notice/applyNotice.vue
|   |— import { publishNotice } from '@/api/workflow'
| 传参: startDate: +new Date(this.yearId.split("&")[0]), //开始时间
|       endDate: +new Date(this.yearId.split("&")[1]),  //结束时间
|--------------------------------------------------
*/
export function publishNotice(params) {
    return request({
        url: 'workflow/notice/publish',
        method: 'POST',
        data: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 获取推送给当前用户的通知公告列表数据 - getNoticeUserListByParameter
|
| 使用场景:
|   |— 推送给当前用户的通知公告列表  /pages/notice/notice.vue
|   |— import { getNoticeUserListByParameter } from '@/api/workflow'
| 传参: userId: 用户ID
| 传参: startDate: +new Date(this.yearId.split("&")[0]), //开始时间
|       endDate: +new Date(this.yearId.split("&")[1]),  //结束时间
| 传参: filter: 过滤 String
|--------------------------------------------------
*/
export function getNoticeUserListByParameter(params) {
    return request({
        url: 'workflow/notice/getNoticeUserListByParameter',
        method: 'GET',
        params: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 获取当前用户发起的通知公告 - getNoticeListByParameters
|   GET /rest/workflow/notice/getNoticeListByParameters
| 使用场景:
|   |— 通知公告列表  /pages/notice/notice.vue
|   |— import { getNoticeListByParameters } from '@/api/workflow'
| 传参: startDate: 开始时间
|       endDate： 结束时间
|       pageNo: 当前页面
|       pageSize：请求数量
|       filter： 筛选条件
|--------------------------------------------------
*/
export function getNoticeListByParameters(params) {
    return request({
        url: 'workflow/notice/getNoticeListByParameters',
        method: 'GET',
        params: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 获取通知公告已读未读数量 - getNoticeUserCountByParameter
|   GET /rest/workflow/notice/getNoticeUserCountByParameter
| 使用场景:
|   |— 通知公告列表  /pages/notice/notice.vue
|   |— import { getNoticeUserCountByParameter } from '@/api/workflow'
| 传参: startDate: +new Date(this.yearId.split("&")[0]), //开始时间
|       endDate: +new Date(this.yearId.split("&")[1]),  //结束时间
|--------------------------------------------------
*/
export function getNoticeUserCountByParameter(params) {
    return request({
        url: 'workflow/notice/getNoticeUserCountByParameter',
        method: 'GET',
        params: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 点击公告列表发送ID修改为已读 - updateNoticeById
|GET /rest/workflow/notice/updateNoticeById
| 使用场景:
|   |— 通知公告列表  /pages/notice/notice.vue
|   |— import { updateNoticeById } from '@/api/workflow'
| 传参: noticeId: 公告ID
|--------------------------------------------------
*/
export function updateNoticeById(params) {
    return request({
        url: 'workflow/notice/updateNoticeById',
        method: 'GET',
        params: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 请假初始化 - init
|   GET /rest/workflow/leave/init
| 使用场景:
|   |— 请假列表
|   |— import { leaveInit } from '@/api/workflow'
| 传参: 无
|--------------------------------------------------
*/
export function leaveInit() {
    return request({
        url: 'workflow/leave/init',
        method: 'GET'
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 请假列表 - getLeaveList
|   GET /rest/workflow/leave/getLeaveList
| 使用场景:
|   |— 请假列表  /pages/leave/leaveList.vue
|   |— import { getLeaveList } from '@/api/workflow'
| 传参: year: 年份（2018）
|--------------------------------------------------
*/
export function getLeaveList(params) {
    return request({
        url: 'workflow/leave/getLeaveList',
        method: 'GET',
        params: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 请假详情 - getLeaveDetail
|   GET /rest/workflow/leave/getLeaveDetail
| 使用场景:
|   |— 请假列表  /pages/leave/leaveDetail.vue
|   |— import { getLeaveDetail } from '@/api/workflow'
| 传参: leaveId: 请假Id
|--------------------------------------------------
*/
export function getLeaveDetail(params) {
    return request({
        url: 'workflow/leave/getLeaveDetail',
        method: 'GET',
        params: params
    })
}

/* POST
|--------------------------------------------------
| 接口:POST
|   |— 根据传入的开始日期，结束日期，请假类型，计算这个时间段可用天数 - getUsefulDays
|   GET rest/workflow/leave/getUsefulDays
| 使用场景:
|   |— 请假申请  /pages/leave/applyLeave.vue
|   |— import { getUseLeavefulDays } from '@/api/workflow'
| 传参: validateLeaveDateDmnObj json对象
|--------------------------------------------------
*/
export function getUseLeavefulDays(params) {
    return request({
        url: 'workflow/leave/getUsefulDays',
        method: 'POST',
        data: params
    })
}

/* POST
|--------------------------------------------------
| 接口:POST
|   |— 发起请假申请 - publish
|   POST rest/workflow/leave/publish
| 使用场景:
|   |— 请假申请  /pages/leave/applyLeave.vue
|   |— import { leavePublish } from '@/api/workflow'
| 传参: leaveInfo json对象
|--------------------------------------------------
*/
export function leavePublish(params) {
    return request({
        url: 'workflow/leave/publish',
        method: 'POST',
        data: params
    })
}

/* POST
|--------------------------------------------------
| 接口:POST
|   |— 请假审批 - POST /rest/workflow/leave/approve
|   POST rest/workflow/leave/approve
| 使用场景:
|   |— 请假审批  /pages/todo-list/approveLeave.vue
|   |— import { leaveApprove } from '@/api/workflow'
| 传参: leaveInfo json对象
|--------------------------------------------------
*/
export function leaveApprove(params) {
    return request({
        url: 'workflow/leave/approve',
        method: 'POST',
        data: params
    })
}

/* POST
|--------------------------------------------------
| 接口:POST
|   |— 销假审批接口 - /rest/workflow/cancelLeave/approve
|   POST /rest/workflow/cancelLeave/approve
| 使用场景:
|   |— 销假审批  /pages/todo-list/approveCancelLeave.vue
|   |— import { cancelLeaveApprove } from '@/api/workflow'
| 传参: cancelLeaveInfo json对象
|--------------------------------------------------
*/
export function cancelLeaveApprove(params) {
    return request({
        url: 'workflow/cancelLeave/approve',
        method: 'POST',
        data: params
    })
}

/* GET
|--------------------------------------------------
| 接口:GET
|   |— (APP)获取销假列表 -  /rest/workflow/cancelLeave/getCanceLeaveList
|   GET  /rest/workflow/cancelLeave/getCanceLeaveList
| 使用场景:
|   |— 销假列表  /pages/leave/leaveList.vue
|   |— import { getCanceLeaveList } from '@/api/workflow'
| 传参:
|--------------------------------------------------
*/
export function getCanceLeaveList(params) {
    return request({
        url: 'workflow/cancelLeave/getCanceLeaveList',
        method: 'GET',
        params: params
    })
}

/* GET
|--------------------------------------------------
| 接口:GET
|   |— (APP)获取销假详情 -  /rest/workflow/cancelLeave/getCancelLeaveDetail
|   GET  /rest/workflow/cancelLeave/getCancelLeaveDetail
| 使用场景:
|   |— 销假列表  /pages/cancel-leave/cancelLeaveDetail.vue
|   |— import { getCancelLeaveDetail } from '@/api/workflow'
| 传参:
|--------------------------------------------------
*/
export function getCancelLeaveDetail(params) {
    return request({
        url: 'workflow/cancelLeave/getCancelLeaveDetail',
        method: 'GET',
        params: params
    })
}

/* GET
|--------------------------------------------------
| 接口:GET
|   |— 获取销假页面初始化接口 /rest/workflow/cancelLeave/init
| 使用场景:
|   |— 新建销假申请  /pages/cancel-leave/applyCancelLeave.vue
|   |— import { cancelLeaveInit } from '@/api/workflow'
| 传参:
|--------------------------------------------------
*/
export function cancelLeaveInit(params) {
    return request({
        url: 'workflow/cancelLeave/init',
        method: 'GET',
        params: params
    })
}

/* POST
|--------------------------------------------------
| 接口:POST
|   |— 发起销假申请 /rest/workflow/cancelLeave/publish
| 使用场景:
|   |— 新建销假申请  /pages/cancel-leave/applyCancelLeave.vue
|   |— import { cancelLeavePublish } from '@/api/workflow'
| 传参:
|--------------------------------------------------
*/
export function cancelLeavePublish(params) {
    return request({
        url: 'workflow/cancelLeave/publish',
        method: 'POST',
        data: params
    })
}

/* POST
|--------------------------------------------------
| 接口:POST
|   |-根据传入的销假开始日期，结束日期，判断：1.这段时间是不是都是休息日；
|     2.如果不是，是否包含已申请的销假日期
|   |— /rest/workflow/cancelLeave/validateCancelDate
| 使用场景:
|   |— 新建销假申请  /pages/cancel-leave/applyCancelLeave.vue
|   |— import { validateCancelDate } from '@/api/workflow'
| 传参:
|--------------------------------------------------
*/
export function validateCancelDate(params) {
    return request({
        url: 'workflow/cancelLeave/validateCancelDate',
        method: 'POST',
        data: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 幻灯片滚动 - getNoticeUserListByNumber
|   GET /rest/workflow/notice/getNoticeUserListByNumber
| 使用场景:
|   |— 通知幻灯片滚动  /pages/component/bimSwipe.vue
|   |— import { getNoticeUserListByNumber } from '@/api/workflow'
| 传参: userId: 用户ID
|       startDate: 开始时间
|       endDate: 结束时间 2018-12-31
|       number: 3 条数
|--------------------------------------------------
*/
export function getNoticeUserListByNumber(params) {
    return request({
        url: 'workflow/notice/getNoticeUserListByNumber',
        method: 'GET',
        params: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 获取通知公告详情数据 - getNoticeInfo
|   GET /rest/workflow/notice/getNoticeInfo
| 使用场景:
|   |— 通知公告详情  /pages/notice/noticeDetail.vue
|   |— import { getNoticeInfo } from '@/api/workflow'
| 传参: noticeId: 公告ID
|--------------------------------------------------
*/
export function getNoticeInfo(params) {
    return request({
        url: 'workflow/notice/getNoticeInfo',
        method: 'GET',
        params: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 外出详情 - getNoticeInfo
|   GET /rest/workflow/notice/getNoticeInfo
| 使用场景:
|   |— 外出详情  src\pages\go-out\outingDetail.vue
|   |— import { getNoticeInfo } from '@/api/workflow'
| 传参: noticeId: 公告ID
|--------------------------------------------------
*/
export function outingGetNoticeInfo(outingId) {
    return request({
        url: 'workflow/outing/getNoticeInfo',
        method: 'GET',
        params: { outingId }
    })
}

/*
|--------------------------------------------------
| 接口:POST
|   |— 通知公告部门负责人审批接口 - approveDepartmentHead
|   GET rest/workflow/notice/approveDepartmentHead
| 使用场景:
|   |— 通知公告审批  /pages/todo-list/approveNotice.vue
|   |— import { approveDepartmentHead } from '@/api/workflow'
| 传参: noticeInfoEntity 公告相关内容对象
|--------------------------------------------------
*/
export function approveDepartmentHead(params) {
    return request({
        url: 'workflow/notice/approveDepartmentHead',
        method: 'POST',
        data: params
    })
}

/*
|--------------------------------------------------
| 接口:POST
|   |— 通知公告行政办公室审批接口 - approveExecutiveOffice
|   GET rest/workflow/notice/approveExecutiveOffice
| 使用场景:
|   |— 通知公告审批页面  /pages/todo-list/approveNotice.vue
|   |— import { approveExecutiveOffice } from '@/api/workflow'
| 传参: noticeInfoEntity 公告相关内容对象
|--------------------------------------------------
*/
export function approveExecutiveOffice(params) {
    return request({
        url: 'workflow/notice/approveExecutiveOffice',
        method: 'POST',
        data: params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 根据传入的开始日期，结束日期，请假类型，计算这个时间段可用分钟 - getUsefulDays
|
| 使用场景:
|   |— 外出申请  pages\go-out\applyOuting.vue
|   |— import { getUsefulDays } from '@/api/workflow'
| 传参: startDate endDate 格式:2018-01-01 bizId 业务ID
|--------------------------------------------------
*/
export function getUsefulDays(startDate, endDate, bizId) {
    return request({
        url: 'workflow/outing/getUsefulDays',
        method: 'GET',
        params: { startDate, endDate, bizId }
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 外出审批接口
|
| 使用场景:
|   |— 通知公告详情  src\pages\todo-list\approveOuting.vue
|   |— import { outingApprove } from '@/api/workflow'
| 传参:
|--------------------------------------------------
*/
export function outingApprove(data) {
    return request({
        url: 'workflow/outing/approve',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 获取日历出差详情
|
| 使用场景:
|   |— 个人统计 \pages\punch-sign\signInRecord.vue
| 传参:
|--------------------------------------------------
*/
export function getDetailByDate(params) {
    return request({
        url: 'workflow/travel/getDetailByDate',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 获取日历外出详情
|
| 使用场景:
|   |— 个人统计 \pages\punch-sign\signInRecord.vue
| 传参:
|--------------------------------------------------
*/
export function getOutingInfoByUserIdAndDate(params) {
    return request({
        url: 'workflow/outing/getOutingInfoByUserIdAndDate',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 获取日历请假详情
|
| 使用场景:
|   |— 个人统计 \pages\punch-sign\signInRecord.vue
| 传参:
|--------------------------------------------------
*/
export function getLeaveDetailByCalender(params) {
    return request({
        url: 'workflow/leave/getLeaveDetailByCalender',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:GET
|   |— 校验是否有可以补卡的记录
| 使用场景:
|   |— 补卡 \pages\apply-for-card\applyMendClock.vue
| 传参: 无
| 返回: false 不能补卡, true能补卡
|--------------------------------------------------
*/
export function clockValidate() {
    return request({
        url: 'workflow/clock/validate',
        method: 'GET'
    })
}

