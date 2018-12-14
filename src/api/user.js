import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 人员详细信息
|
| 引用方式:
|   |— import { getUserInfoByUserId } from '@/api/user'
|
| 使用场景:
|   |— 通讯录功能模块人员详细信息 pages/contact-book/_contactBook.vue
|
| 传参:  userId 用户id  orgId 组织id positionCode 岗位code
{ userId, orgId, positionCode }
|--------------------------------------------------
*/
export function getUserInfoByUserId(params) {
    return request({
        url: 'user/userShow/getUserInfoByUserId',
        method: 'GET',
        params
    })
}
