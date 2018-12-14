/**
|--------------------------------------------------
| app端公共方法
|--------------------------------------------------
*/
import { LOCALSTORAGE_KEYS } from './globalConstCfg'
import { assert } from './utils'
import { fetchAllDictionaryMap } from '../api/dictionary'
import { queryLoginUserInfo } from '@/api/login'
import { Encrypt, Decrypt } from '@/utils/crypto'

/* global plus */
// ============================本地存储=============================
/**
 * 存储用户信息
 * @param {String} userInfo
 * @param {String} password
 */
export function setUserInfo(userInfo, password) {
    assert(userInfo, '用户信息存储失败')
    if (password) userInfo[LOCALSTORAGE_KEYS.PASSWORD] = password
    localStorage.setItem(LOCALSTORAGE_KEYS.USER_INFO, Encrypt(JSON.stringify(userInfo)))
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
    return JSON.parse(Decrypt(localStorage.getItem(LOCALSTORAGE_KEYS.USER_INFO)))
}

/**
 * 存储token
 */
export function setToken(token) {
    assert(token, 'token存储失败')
    localStorage.setItem(LOCALSTORAGE_KEYS.TOKEN, JSON.stringify(token))
}

/**
 * 获取token
 */
export function getToken() {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.TOKEN))
}

/**
 * 存储 mappingconfig
 */
export function setMappingCfg(mappingconfig) {
    assert(mappingconfig, 'mappingconfig存储失败')
    localStorage.setItem(LOCALSTORAGE_KEYS.MAPPING_CFG, JSON.stringify(mappingconfig))
}

/**
 * 获取mappingconfig
 */
export function getMappingCfg() {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.MAPPING_CFG))
}

/**
 * 获取当前版本
 */
export function enableDebugVersion() {
    localStorage.setItem('$debug', 'true')
}
export function disableDebugVersion() {
    localStorage.removeItem('$debug')
}
export function isDebugVersion() {
    return localStorage.getItem('$debug') === 'true'
}
// ============================app,初始化=============================
/**
 * appInit app初始化
 */
const appInitFn = {
    // 初始化数据字段
    initMappingCfg: function() {
    }
}

export function appInit() {
    try {
        const values = Object.values(appInitFn)
        for (let i = 0; i < values.length; i++) {
            const fn = values[i]
            fn()
        }
    } catch (error) {
        console.warn(error)
    }
}

// ============================登录,初始化=============================
const userInitFn = {
    // 初始化数据字典
    initMappingCfg: function() {
        return new Promise((resolve, reject) => {
            fetchAllDictionaryMap()
                .then(res => {
                    setMappingCfg(res)
                    resolve()
                })
                .catch(e => {
                    console.warn(e && e.message)
                    reject(e)
                    plus.nativeUI.toast(e && e.message)
                })
        })
    },
    // 初始化登录用户信息
    initUserInfo: function(params) {
        return new Promise((resolve, reject) => {
            queryLoginUserInfo()
                .then(res => {
                    const password = params && params.password
                    setUserInfo(res, password)
                    resolve()
                })
                .catch(e => {
                    console.warn(e)
                    reject(e)
                    plus.nativeUI.toast(e && e.message)
                })
        })
    }
}

/**
 * 用户登录,初始化
 */
export function userInit(params) {
    try {
        const result = []
        const values = Object.values(userInitFn)
        for (let i = 0; i < values.length; i++) {
            const fn = values[i]
            result.push(fn(params))
        }
        return Promise.all(result)
    } catch (e) {
        console.warn(e)
        plus.nativeUI.toast(e && e.message)
    }
}

// ===========================清除用户信息数据字典TOKEN app退出登录时执行=============================
const clearUser = {
    // 清除数据字典
    clearMappingCfg: function() {
        setMappingCfg({})
    },
    // 清除用户信息
    clearUserInfo: function() {
        setUserInfo({})
    },
    // 清除TOKEN
    clearToken: function() {
        setToken({})
    }

}

/**
 * 清除用户信息
 */
export function clearUserData() {
    try {
        const values = Object.values(clearUser)
        for (let i = 0; i < values.length; i++) {
            const fn = values[i]
            fn()
        }
    } catch (error) {
        console.warn(error)
        plus.nativeUI.toast(error && error.message)
    }
}
