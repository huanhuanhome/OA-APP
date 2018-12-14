/**
|--------------------------------------------------
| 打卡
|--------------------------------------------------
*/
import request from '@/common/request'

/*
|--------------------------------------------------
| 接口:
|   |— 考勤打卡接口 - signCard
|
| 使用场景:
|   |— 登录模块 src\pages\punch-sign\punchSign.vue
|
| 传参:   mobile    手机号
|        password   密码
|--------------------------------------------------
*/
export function signCard(data) {
    return request({
        url: 'sign/signCard',
        method: 'POST',
        data
    })
}
