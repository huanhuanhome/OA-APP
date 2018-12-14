/*
 * @Author: LiuJunTing 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-25 10:46:06
 */

/**
|--------------------------------------------------
| 描述: 高度定制化考勤日历,通过数据渲染考勤日历
| 引用: import bimCalendarMsg from '@/component/bimCalendarMsg/bimCalendarMsg'
| 参数: 无 props
| 说明: @dayClick 点击日期emit事件,返回当天数据
|       @statisData 返回日历整月数据
|--------------------------------------------------
*/

/*
 * @Author: LiuJunTing 
 * @Date: 2018-08-24 19:14:33 
 * @Last Modified by: LiuJunTing
 * @Last Modified time: 2018-08-27 09:36:41
 */

/**
|--------------------------------------------------
|
|  高度定制化工作日历
|
|--------------------------------------------------
*/

<template>
    <div class="calendar-msg">
        <!-- 年份 月份 -->
        <div class="month">
            <ul class="month-ul">
                <li @click="pickPre" class="month_li">
                    <van-icon class="icon-arrow" name="arrow-left"/>
                </li>
                <li class="month_li">
                    <span class="choose-month">{{ new Date(currentYear,currentMonth - 1).toDateString().split(' ')[1] }}</span>
                    <span class="choose-year">{{ currentYear }}</span>
                </li>
                <li class="month_li arrow" @click="pickNext">
                    <van-icon class="icon-arrow" name="arrow"/>
                </li>
            </ul>
        </div>
        <!-- 星期 -->
        <ul class="weekdays">
            <li class="weekdays_li" style="color:#357fc0">MO</li>
            <li class="weekdays_li" style="color:#357fc0">TU</li>
            <li class="weekdays_li" style="color:#357fc0">WE</li>
            <li class="weekdays_li" style="color:#357fc0">TH</li>
            <li class="weekdays_li" style="color:#357fc0">FR</li>
            <li class="weekdays_li" style="color:#357fc0">SA</li>
            <li class="weekdays_li" style="color:#357fc0">SU</li>
        </ul>
        <!-- 日期 -->
        <ul class="days">
            <li 
                v-for="(day,index) in data" 
                :key="day.date" 
                class="days--li"
            >
                <span 
                    class="day" 
                    :class="{'gray': !day.hasMonth,'red': day.hasToday}" 
                    :style="{'color': day.hasMonth && (day.week === '星期六' || day.week==='星期日') ? 'red': ''}"
                >
                    {{day.date | formatDay}}
                </span>
                <div v-if="day.hasRecord" class="bottom-circle-msg"></div>
                <div @click="dayClick(day,index)" class="bg" :class="{'target':index == current}"></div>
            </li>
        </ul>
    </div>
</template>

<script>

import { remindAndMemoCalendar } from '@/api/remind'
import { getMappingCfg } from '@/common/app'
import { Icon } from 'vant'
export default {
    components: {
        [Icon.name]: Icon
    },
    filters: {
        formatDay: function(value) {
            return value.split('-')[2]
        }
    },
    data() {
        return {
            currentMonth: new Date().getMonth() + 1,
            currentYear: new Date().getFullYear(),
            data: [],
            current: null,
            mappingConfig: getMappingCfg()['SingConfiguration.SignInfoConfiguration']
        }
    },
    created() {
        this.initData()
    },
    methods: {
        async initData() {
            try {
                plus.nativeUI.showWaiting() // eslint-disable-line
                this.data = await remindAndMemoCalendar()
                this.data.forEach((v, i) => v.hasToday && (this.current = i))
                const todayInfo = this.data[this.current]
                this.$emit('day-click', todayInfo)
            } catch (error) {
                console.warn(error)
                plus.nativeUI.toast(error && error.message) // eslint-disable-line
            } finally {
                plus.nativeUI.closeWaiting() // eslint-disable-line
            }
        },

        async getMonth(params) {
            try {
                plus.nativeUI.showWaiting() // eslint-disable-line
                this.data = await remindAndMemoCalendar(params)
            } catch (error) {
                console.warn(error)
                plus.nativeUI.toast(error && error.message) // eslint-disable-line
            } finally {
                plus.nativeUI.closeWaiting() // eslint-disable-line
            }
        },

        dayClick(day, index) {
            if (!day.hasMonth) return
            this.current = index
            this.$emit('day-click', day)
        },

        pickPre() {
            this.current = null
            this.$emit('day-click', {})
            this.currentMonth--
            if (this.currentMonth === 0) {
                this.currentMonth = 12
                this.currentYear--
            }
            this.getMonth({ month: this.currentYear + '-' + this.currentMonth })
            this.$emit('month-select', this.currentYear, this.currentMonth)
        },
        pickNext() {
            this.current = null
            this.$emit('day-click', {})
            this.currentMonth++
            if (this.currentMonth === 13) {
                this.currentMonth = 1
                this.currentYear++
            }
            this.getMonth({ month: this.currentYear + '-' + this.currentMonth })
            this.$emit('month-select', this.currentYear, this.currentMonth)
        }
    }
}
</script>

<style lang="scss">
/*日历*/
.calendar-msg{
    font-family: '微软雅黑';

    .month {
        height: 48px;
        line-height: 48px;
        background: url(../../assets/images/tab-bg.png) no-repeat 100%/cover;
        color: white;
        padding: 0 15px 0 15px;
        .month-ul{
            display: flex;
            justify-content: space-between;
            .icon-arrow{
                color: white;
                font-size: 14px;
            }
            .month_li{
                color: #999;
                font-size: 20px;
                .choose-year {
                    padding: 0 20px;
                    font-size: 18px;
                    color: white;
                }
                .choose-month {
                    text-align: center;
                    font-size: 18px;
                    color: white;
                }
            }
        }
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

        &_li{
            display: inline-block;
            text-align: center;
            color: #11616f;
            font-size: 16px;
            width: 13.5%;
            margin-top: 10px;
        }
    }

    .days {
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin-top: 20px;

        .days--li {
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

            .day{
                position: relative;
                z-index: 2;
            }
        }
    }



    .gray{
        color: #ccc
    }

    .red{
        color: red
    }

    .bottom-circle-msg{
        height: 7px;
        width: 7px;
        border-radius: 50%;
        background-color: red;
        position: absolute;
        left: calc(50% - 3px);
        top: calc(50% + 5px);
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


