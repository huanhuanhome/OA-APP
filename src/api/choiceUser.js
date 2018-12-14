/**
|--------------------------------------------------
| 选择人
|--------------------------------------------------
*/
import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 判断当前登录人是否在特殊的组织级别类型的组织下(true: 在, false: 不在) -judgeCurrentUserOrgLevelSpecialType
|
| 使用场景:
|   |— 打卡模块 @/pages/punch-sign/punchSign.vue
|
| 传参:   specialType: 'LeadershipRanks'
|--------------------------------------------------
*/
export function judgeCurrentUserOrgLevelSpecialType(specialType) {
    return request({
        url: 'choiceUser/judgeCurrentUserOrgLevelSpecialType',
        method: 'GET',
        params: { specialType }
    })
}
