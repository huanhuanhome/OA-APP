/*
 * @Author: BAICHONG
 * @Date: 2018-07-26 13:13:03
 */
/**
|--------------------------------------------------
| 工具类
|--------------------------------------------------
*/
import moment from 'moment'
import { getMappingCfg } from './app'
// =======================非业务工具方法==========================
/**
 * 断言
 * @param {Boolean} condition
 * @param {String} msg
 */
export function assert(condition, msg) {
    if (!condition) throw new Error(`[utils] ${msg}`)
}

/**
 * 获取指定格式时间
 * @param {*} time
 * @param {*} cFormat
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * 时间转换
 * @example 日期和时间的格式化自定义 YYYY-MM-DD HH:mm:ss
 */
export function dateTimeFormatCustom(format) {
    return function(value) {
        if (!value) return ''
        value = new Date(value).getTime()
        if (value) {
            return moment(value).format(format || 'YYYY-MM-DD HH:mm')
        }
        return ''
    }
}

/**
 * 获取月份中的最后一天
 */
export function getMonthLastDay(year, month) {
    var new_year = year // 取当前的年份
    var new_month = month++// 取下一个月的第一天，方便计算（最后一天不固定）
    if (month > 12) {
        new_month -= 12 // 月份减
        new_year++ // 年份增
    }
    var new_date = new Date(new_year, new_month, 1) // 取当年当月中的第一天
    return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
}

/**
 * 判断数据类型
 * @param {any} obj
 */
export function typeOf(obj) {
    const toString = Object.prototype.toString
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }
    return map[toString.call(obj)]
}

/**
 *  深拷贝
 * @param {array || obj} data
 */
export function deepCopy(data) {
    const t = typeOf(data)
    let o
    if (t === 'array') {
        o = []
    } else if (t === 'object') {
        o = {}
    } else {
        return data
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]))
        }
    } else if (t === 'object') {
        for (const i in data) {
            o[i] = deepCopy(data[i])
        }
    }
    return o
}

/**
 * 处理数据字典返回key value 对象
 * @param {String} mappingCfgKey 数据字典key
 * @example {key: value}
 */
export function handleMapCfgToObj(mappingCfgKey) {
    const option = {}
    const mapCfg = getMappingCfg()[mappingCfgKey]
    if (!mapCfg) {
        console.warn('数据字典错误:' + mappingCfgKey)
        return option
    }
    Object.keys(mapCfg).forEach(item => {
        option[item] = mapCfg[item]['value']
    })
    return option
}

// =======================业务工具方法==========================

function transform(d) {
    return d * Math.PI / 180.0// 经纬度转换成三角函数中度分表形式。
}
// 计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
export function getDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = transform(lat1)
    var radLat2 = transform(lat2)
    var a = radLat1 - radLat2
    var b = transform(lng1) - transform(lng2)
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000 // 输出为公里
    // s=s.toFixed(4);
    return s
}

/**
 * 获取时间
 * @param {String}
 * @example "YY-MM-DD HH:mm:ss"
 */
export function getTimeString() {
    const date = new Date()
    const hours = String(date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
    const mins = String(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    return hours + ' : ' + mins
}

/**
 * JSON树数据获取，递归遍历出人员数据 数组形式
 */
export function jsonTree(jd) {
    var contactArray = []
    if ((typeof jd === 'object') && (jd.constructor === Object.prototype.constructor)) {
        var arrey = []
        for (var i = 0; i < jd.length; i++) {
            arrey.push(jd[i])
        }
    } else {
        arrey = jd
    }
    for (let i = 0; i < arrey.length; i++) {
        var jn = arrey[i]
        if (jn.userList && jn.userList.length > 0) {
            contactArray = contactArray.concat(jn.userList)
        }
        if (jn.children && jn.children.length > 0) {
            jsonTree(jn.children)
        }
    }
    return contactArray
}
