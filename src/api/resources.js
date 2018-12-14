/**
|--------------------------------------------------
| login相关接口
|--------------------------------------------------
*/
import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 登录接口 - login
|
| 使用场景:
|   |— 登录模块 @/pages/login/login.vue
|
| 传参:   mobile    手机号
|        password   密码
|--------------------------------------------------
*/
export function loadResource() {
    return request({
        url: 'resources/loadResource',
        method: 'GET',
        responseType: 'blob'
    })
}

