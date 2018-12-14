/**
|--------------------------------------------------
| smscode相关接口
|--------------------------------------------------
*/
import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 验证码 - smscode
|
| 使用场景:
|   |— 登录模块 @/pages/login/login.vue
|
| 传参:   digit 几位验证码
|        mobile
|--------------------------------------------------
*/
export function retrieve(mobile) {
    return request({
        url: 'smscode/retrieve',
        method: 'POST',
        data: { mobile }
    })
}
