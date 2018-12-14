/**
|--------------------------------------------------
| axios基本配置
|--------------------------------------------------
*/
import axios from 'axios'
import { setToken, getToken } from './app'
import { backToLogin } from '@/utils/webview'
require('promise.prototype.finally').shim()

const service = axios.create({
    baseURL: process.env.API_ENDPOINT,
    withCredentials: true,
    headers: { loginPlatform: 'App' },
    timeout: 10 * 1000

})

service.interceptors.request.use(config => {
    const token = getToken()
    if (token) config.headers['authorization'] = token
    return config
}, error => {
    return Promise.reject(error)
})

service.interceptors.response.use(response => {
    if (!/application\/json/.test(response.headers['content-type'])) {
        return response
    }

    const res = response.data
    if (res.status > 0) {
        const token = response.headers.token
        if (token) setToken('Bearer ' + token)
        return res.data
    }

    return Promise.reject(res)
}, error => {
    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '请求错误'
                break

            case 401:
                if (!getToken()) break
                error.message = '令牌过期'
                // store.dispatch('LogOut').then(() => {
                //     location.reload()
                // })
                break

            case 403:
                error.message = '权限不足'
                break

            case 500:
                error.message = '服务器错误'
                break

            default:
        }

        // 判断该用户是否已经在同设备的其他地方登录
        if (error.response.data && error.response.data.errorCode === '001012') {
            plus.nativeUI.toast('error.response.data.message')
            backToLogin()
            return Promise.reject()
        }
    }

    if (error && error.code === 'ECONNABORTED') {
        error.message = '请求超时'
    }

    if (error && error.message === 'Network Error') {
        error.message = '网络错误'
    }

    return Promise.reject(error)
})

export default service
