import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 当前登录人为普通员工的时候获取项目负责人,项目负责人登录为获取领导班子信息 - outingPublish
|
| 使用场景:
|   |— 外出页  src\pages\go-out\_goOut.vue
|
| 传参: userId 用户id
|--------------------------------------------------
*/
export function getApproveForOAFlow(params) {
    return request({
        url: 'oaUser/getApproveForOAFlow',
        method: 'GET',
        params
    })
}
// 获取当前用户所在的主职的项目负责人
export function getOrgResponsibleUser(userId) {
    return request({
        url: '/oaUser/getOrgResponsibleUser',
        method: 'GET',
        params: {
            userId
        }
    })
}
// 获取领导班子成员
export function getLeadershipRanksUserList() {
    return request({
        url: '/oaUser/getLeadershipRanksUserList',
        mehtod: 'GET'
    })
}

// 判断当前登录人是否是党支部书记
export function isBranchSecretary(userId) {
    return request({
        url: '/oaUser/ifBranchSecretary',
        method: 'GET',
        params: {
            userId
        }
    })
}

// 获取党支部书记所在当去办公室
export function getUserPartyOrgId(userId) {
    return request({
        url: '/oaUser/getUserPartyOrgId',
        method: 'GET',
        params: {
            userId
        }
    })
}

// 获取党组织下的对应的党员
export function getPartyUserListByData(params) {
    return request({
        url: '/oaUser/getPartyUserListByData',
        method: 'GET',
        params
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 获取行政办公室主任 - getTaskNodeUserIdListByTaskName
|    — import { getTaskNodeUserIdListByTaskName } from '@/api/oaUser'
| 使用场景:
|   |— 通知公告发起模块  src\pages\go-out\_goOut.vue
|
| 传参: 无
|--------------------------------------------------
*/
export function getTaskNodeUserIdListByTaskName(params = { taskName: 'Notice', nodeName: 'ApproveExecutiveOffice' }) {
    return request({
        url: 'workflow/common/getTaskNodeUserIdListByTaskName',
        method: 'GET',
        params
    })
}
