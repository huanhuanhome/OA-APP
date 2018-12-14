/*
 * @Author: LiuJunTing 
 * @Date: 2018-07-31 16:39:10 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-25 10:48:16
 */

/**
|--------------------------------------------------
|
|  高度定制化考勤日历,个人打卡统计日历
|
|--------------------------------------------------
*/
<template>
    <div class="bimcalendar">
        <!-- 年份 月份 -->
        <div class="bimcalendar-month">
            <ul class="bimcalendar-month-ul">
                <li class="arrow-left" @click="pickPre(currentYear,currentMonth)"><i class="iconfont icon-back" style="color:#fff;"/></li>
                <li>
                    <span class="choose-year">{{ currentYear }}</span>
                    <span class="choose-month">{{ currentMonth }}月</span>
                </li>
                <li class="arrow-right" @click="pickNext(currentYear,currentMonth)"><i class="iconfont icon-right" style="color:#fff;"/></li>
            </ul>
        </div>
        <!-- 星期 -->
        <ul class="weekdays">
            <li style="color:#357fc0">一</li>
            <li style="color:#357fc0">二</li>
            <li style="color:#357fc0">三</li>
            <li style="color:#357fc0">四</li>
            <li style="color:#357fc0">五</li>
            <li style="color:red">六</li>
            <li style="color:red">日</li>
        </ul>
        <!-- 日期 -->
        <ul class="days">
            <li class="item" :disabled="!day.signState" v-for="(day,index) in data" :key="day.signDate">
                <span class="day" :class="{'red': day.hasToday}">
                    {{day.day | dayFormat}}
                </span>
                <template v-if="day.signState && day.signState !== 'Holiday'">
                    <div class="top-circle" :style="{'border-color': topCircleColorMapCfg[day.signState]}"></div>
                    <div class="bottom-circle" :style="{'border-color': bottomCircleColorMapCfg[day.signState]}"></div>
                </template>
                <div class="white-div"></div>
                <div @click="dayClick(day,index)" class="bg" :class="{'target':index == current}"></div>
            </li>
        </ul>
    </div>
</template>

<script>
/* global plus */
import { getAttendanceSummaryMapByUserIdAndStartAndEnd } from '@/api/attendanceCount'
const moment = require('moment')

const signStateMapCfg = {
    Normal: '出勤',
    Late: '迟到',
    LeaveEarly: '早退',
    LateAndLeaveEarly: '迟到并且早退',
    Abnormal: '缺勤',
    Holiday: '',
    Outing: '外出',
    OutingAbnormal: '外出(异常)',
    Leave: '休假',
    BusinessTravel: '出差'
}

export default {
    name: 'AttendanceCalendar',
    data() {
        return {
            current: null,
            currentDay: 1,
            currentMonth: 1,
            currentYear: 1970,
            currentWeek: 1,
            data: [],
            topCircleColorMapCfg: {
                Normal: '#5fb5f3',
                Late: '#f7c702',
                LeaveEarly: '#5fb5f3',
                LateAndLeaveEarly: '#f7c702',
                Abnormal: '#ed363a',
                Holiday: '#5cb96e',
                Outing: '#00a8ff',
                OutingAbnormal: '#f28efd',
                Leave: '#5cb96e',
                BusinessTravel: '#9d68ff'
            },
            bottomCircleColorMapCfg: {
                Normal: '#5fb5f3',
                Late: '#5fb5f3',
                LeaveEarly: '#f7c702',
                LateAndLeaveEarly: '#f7c702',
                Abnormal: '#ed363a',
                Holiday: '#5cb96e',
                Outing: '#00a8ff',
                OutingAbnormal: '#f28efd',
                Leave: '#5cb96e',
                BusinessTravel: '#9d68ff'
            }
        }
    },
    created() {
        this.initData()
    },
    filters: {
        dayFormat: function(value) {
            return moment(value).format(`DD`)
        },
        formatSignState(value) {
            return signStateMapCfg[value] || ''
        }
    },
    methods: {
        dayClick(day, index) {
            this.current = index
            const todayInfo = this.data[this.current]
            this.$emit('day-click', todayInfo)
        },

        initData: function(cur) {
            let date
            if (cur) {
                date = new Date(cur)
            } else {
                const now = new Date()
                const d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1))
                d.setDate(42)
                date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
            }
            this.currentDay = date.getDate()
            this.currentYear = date.getFullYear()
            this.currentMonth = date.getMonth() + 1
            this.currentWeek = date.getDay() // 1...6,0
            if (this.currentWeek === 0) {
                this.currentWeek = 7
            }
            const str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay)
            this.data.length = 0
            // 今天是周日，放在第一行第7个位置，前面6个
            // 初始化本周
            for (let i = this.currentWeek - 1; i >= 0; i--) {
                const d = new Date(str)
                d.setDate(d.getDate() - i)
                const dayobject = {} // 用一个对象包装Date对象  以便为以后预定功能添加属性
                dayobject.day = moment(d).format(`YYYY-MM-DD`)
                if (moment(d).format(`YYYY-MM-DD`) === moment().format(`YYYY-MM-DD`)) {
                    dayobject.hasToday = true
                }
                this.data.push(dayobject) // 将日期放入data 中的data数组 供页面渲染使用
            }
            // 其他周
            for (let i = 1; i <= 42 - this.currentWeek; i++) {
                const d = new Date(str)
                d.setDate(d.getDate() + i)
                const dayobject = {}
                dayobject.day = moment(d).format(`YYYY-MM-DD`)
                if (moment(d).format(`YYYY-MM-DD`) === moment().format(`YYYY-MM-DD`)) {
                    dayobject.hasToday = true
                }
                this.data.push(dayobject)
            }
            this.mergeStatus()
        },
        async mergeStatus() {
            try {
                const params = {
                    startDate: this.data[0].day,
                    endDate: this.data[this.data.length - 1].day
                }
                plus.nativeUI.showWaiting()
                const res = await getAttendanceSummaryMapByUserIdAndStartAndEnd(params)
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        this.data.forEach(v => {
                            if (v.day === moment(key).format(`YYYY-MM-DD`)) {
                                this.$set(v, 'signState', res[key])
                            }
                        })
                        // this.data.forEach(v => {
                        //     if (!v.signState && v.day < moment().format(`YYYY-MM-DD`)) {
                        //         this.$set(v, 'signState', 'Normal')
                        //     }
                        // })
                    }
                }
                this.data.forEach((v, i) => { v.hasToday && (this.current = i) })
                const todayInfo = this.data[this.current]
                if (todayInfo) {
                    this.$emit('day-click', todayInfo)
                }
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        pickPre: function(year, month) {
            // setDate(0); 上月最后一天
            // setDate(-1); 上月倒数第二天
            // setDate(dx) 参数dx为 上月最后一天的前后dx天
            const d = new Date(this.formatDate(year, month, 1))
            d.setDate(0)
            this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
            this.current = null
            this.$emit('day-click', {})
        },
        pickNext: function(year, month) {
            const d = new Date(this.formatDate(year, month, 1))
            d.setDate(42)
            this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
            this.current = null
            this.$emit('day-click', {})
        },
        // 返回 类似 2016-01-02 格式的字符串
        formatDate: function(year, month, day) {
            const y = year
            let m = month
            if (m < 10) m = '0' + m
            let d = day
            if (d < 10) d = '0' + d
            return y + '-' + m + '-' + d
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
@import '../../assets/font/iconfont.css';
/*日历*/
.bimcalendar{
    background: $bg2;
    &-month {
        width: 100%;
        height: 48px;
        line-height: 48px;
        background: url(../../assets/images/tab-bg.png) no-repeat 100%/cover;
    }
    .bimcalendar-month-ul{
        .arrow-left{
            padding-left: 10px;
        }
        .arrow-right{
            padding-right: 10px;
        }
    }
    &-month ul {
        display: flex;
        justify-content: space-between;
    }
    
    .choose-year {
        padding: 0 20px;
        font-weight: bolder;
        font-size: 20px;
        color: #fff;
    }
    
    .choose-month {
        text-align: center;
        font-weight: bolder;
        font-size: 20px;
        color: #fff
    }
    
    &-month ul li {
        color: #999;
        font-size: 20px;
        text-transform: uppercase;
        letter-spacing: 3px;
        list-style: none;
    }
    
    .weekdays {
        margin: 0;
        width: 100%;
        margin-top: 26px;
        height: 34px;
        line-height: 34px;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    
    .weekdays li {
        display: inline-block;
        text-align: center;
        color: #11616f;
        font-size: 18px;
        font-weight: bold;
        width: 13.5%;
        margin-top: 10px;
    }
    
    .days {
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin-top: 20px;
    }
    
    .days li {
        list-style-type: none;
        display: inline-block;
        width: 14.2%;
        height: 35px;
        text-align: center;
        padding-bottom: 3px;
        padding-top: 7px;
        font-size: 12.78px;
        color: black;
        font-weight: 700;
        position: relative;
        margin: 1px 0;
    }
    
    .day{
        position: relative;
        z-index: 2;
    }
    
    .red{
        color: red
    }
    
    .top-circle{
        position: absolute;
        left: calc(50% - 11px);
        top: calc(50% - 23px);
        width: 20px;
        height: 20px;
        border: 2px solid;
        border-bottom: 1px solid rgba(0,0,0,0) !important;
        border-right: 1px solid rgba(0,0,0,0) !important;
        border-radius: 50%;
        transform: rotate(45deg)
    }
    
    .bottom-circle{
        position: absolute;
        left: calc(50% - 11px);
        top: calc(50% - 20px);
        width: 20px;
        height: 20px;
        border: 2px solid;
        border-top: 1px solid rgba(0,0,0,0) !important;
        border-left: 1px solid rgba(0,0,0,0) !important;
        border-radius: 50%;
        transform: rotate(45deg)
    }
    
    .white-div{
        position: absolute;
        width: 40px;
        background-color: #fff;
        height: 5px;
        left: calc(50% - 18px);
        top: 10px;
        z-index: 1;
    }
    
    .target{
        position: absolute;
        width: 34px;
        height: 34px;
        z-index: 1;
        left: calc(50% - 17px);
        top: -5px;
        background-image: url('../../assets/images/target.png');
        background-size:100% 100%;
        background-repeat: no-repeat;
    }
    
    .bg{
        position: absolute;
        width: 34px;
        height: 34px;
        left: calc(50% - 17px);
        top: -5px;
        z-index: 5;
    }
}
</style>
