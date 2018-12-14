import { getUserInfo } from './app'
import { typeOf } from '@/common/utils.js'
/* global plus */

const userInfo = getUserInfo()
const perInfo = {
    // 领导
    leader: function() {
        return userInfo.hasLeading
    },
    // 部门负责人
    orgResponsibleUser: function() {
        return userInfo.hasOrgResponsibleUser
    }
}

const MapCfg = Object.keys(perInfo).filter(key => perInfo[key]())

const permission = {
    signInRecord: {
        excludes: ['leader']
    },
    // 补卡
    applyMendClock: {
        excludes: [
            { permission: 'leader', callback: _ => plus.nativeUI.toast('领导班子成员无法发起补卡申请') }
        ]
    },
    // 出差
    applyBusinessTravel: {
        excludes: [
            { permission: 'leader', callback: _ => plus.nativeUI.toast('领导班子成员无法发起出差申请') }
        ]
    },
    // 请假,销假
    applyLeave: {
        excludes: [
            { permission: 'leader', callback: _ => plus.nativeUI.toast('领导班子成员无法发起请/销假申请') }
        ]
    },
    // 外出
    applyOuting: {
        excludes: [
            { permission: 'leader', callback: _ => plus.nativeUI.toast('领导班子成员无法发起外出申请') }
        ]
    },
    // 通知公告
    applyNotice: {
        excludes: [
            { permission: 'leader', callback: _ => plus.nativeUI.toast('领导班子成员无法发起通知公告申请') }
        ]
    }
}
/**
 * @param {String} pageId 页面id
 * @param {Boolean} cb false,只判断页面能不能进入,不执行回调
 *                     true ,判断页面能不能进入,并且执行相应回调函数
 */
export function permissionFunc(pageId, cb) {
    const perm = permission[pageId]
    if (perm) {
        if (perm.includes) {
            const arr = perm.includes
            for (let i = 0; i < arr.length; i++) {
                const ele = arr[i]
                if (MapCfg.indexOf(ele) > -1) {
                    return true
                }
            }
            return false
        } else if (perm.excludes) {
            const arr = perm.excludes
            for (let i = 0; i < arr.length; i++) {
                const ele = arr[i]
                let per
                if (typeOf(ele) === 'object') {
                    per = ele.permission
                } else {
                    per = ele
                }
                if (MapCfg.indexOf(per) > -1) {
                    cb && ele.callback && ele.callback()
                    return false
                }
            }
            return true
        }
    }
    return true
}
