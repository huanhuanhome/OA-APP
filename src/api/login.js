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
export function login(data) {
    return request({
        url: 'login/login.jo',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 忘记密码接口 - forgetPS
|
| 使用场景:
|   |— 登录模块 @/pages/login/login.vue
|
| 传参:   mobile 手机号
|        name 名字
|        newPs 新密码
|        smsCode 验证码
|--------------------------------------------------
*/
export function forgetPS(data) {
    return request({
        url: 'login/forgetPS',
        method: 'POST',
        data
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 获取登录用户信息接口 - forgetPS
|
| 使用场景:
|   |— 登录模块 @/pages/login/login.vue
|
| 传参:   mobile 手机号
|        name 名字
|        newPs 新密码
|        smsCode 验证码
|--------------------------------------------------
*/
export function queryLoginUserInfo() {
    return request({
        url: 'login/queryLoginUserInfo.jo',
        method: 'GET'
    })
}

/*
|--------------------------------------------------
| 接口:
|   |— 获取当前登录人的个人模块数量统计 - getUserModuleCount
|
| 使用场景:
|   |— 登录模块 @/pages/login/login.vue
|
| 传参:  无
|--------------------------------------------------
*/
export function getUserModuleCount() {
    return request({
        url: 'login/getUserModuleCount',
        method: 'GET'
    })
}
