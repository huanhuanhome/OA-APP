/**
|--------------------------------------------------
|  加密
|--------------------------------------------------
*/

import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 获取公钥 - getPublicKey
|
| 使用场景:
|   |— 登录模块 @/pages/login/login.vue
|
| 传参:   无
|--------------------------------------------------
*/
export async function getPublicKey() {
    return request({
        url: 'encryption/getPublicKey.jo',
        method: 'GET'
    })
}
