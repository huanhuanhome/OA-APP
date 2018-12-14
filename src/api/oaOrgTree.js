import request from '@/common/request'
/*
|--------------------------------------------------
| 接口:
|   |— 通讯录树 -getOrgTreeAllAndUserNotRole
|
| 引用方式:
|   |— import { getOrgTreeAllAndUserNotRole } from '@/api/orgTree'
|
| 使用场景:
|   |— 通讯录功能模块 pages/contact-book/_contactBook.vue
|
| 传参:  {hasUser:true}
|--------------------------------------------------
*/
export function getOrgTreeByParameter() {
    return request({
        url: 'oaOrgTree/getOrgTreeByParameter',
        method: 'POST',
        data: { hasUser: true }
    })
}
