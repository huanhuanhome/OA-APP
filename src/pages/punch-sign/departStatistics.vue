/*
 * @Author: suntingting 
 * @Date: 2018-09-19 13:49:52 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-09 16:35:31
 */

/**
|--------------------------------------------------
| 
|   部门统计日统计
| 
| 
|--------------------------------------------------
*/
<template>
    <div>
        <bimHeader 
            title="部门统计" 
            left-arrow
        >
            <div class="btn-select btn-select--noborder" solt="right" style="top:6px;">
                <button class="btn-select__normal" @click="setTime" style="width:85px">
                    <span class="btn-select__text">{{ currentData }}</span>
                    <i class="iconfont icon-unfold btn-select__icon btn-select__icon--blue"></i>
                </button>
            </div>
        </bimHeader>
        <div class="" style="padding-top:46px">
            <div>
                <div>
                    <van-search placeholder="请输入姓名查询" show-action v-model="keyWord">
                        <div slot="action" @click="onSearch">搜索</div>
                    </van-search>
                </div>
                <div class="statistics-container">
                    <div class="statistics-person">
                        <div class="total">考勤人数({{orgAllUser.signUserNormalNumber}}/{{orgAllUser.orgAllUserNumber}}人)</div>
                        <div class="travel">出差({{orgAllUser.signUserEvectionNumber}}人)</div>
                    </div>
                </div>
                <div >
                    <ul class="g-list-1 g-list-1--type1 list__container">
                        <li v-for="item in daySignData" :key="item.id" class="list__item">
                            <span class="type">{{(item.userName).substr(0, 1)}}</span>
                            <p class="jiaqi p-ellipsis">
                                {{item.userName}}
                                <span class="date-section">{{SIGN_MAP_CFG[item.attendanceState]}}</span>
                            </p>
                            <p class="xiaojia p-ellipsis">
                                {{item.signLocation}}
                                <span class="date-section">{{item.attendanceDate | dateFormat}}</span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <template>
            <!-- 时间  -->
            <van-popup v-model="showTime" position="bottom">
                <van-datetime-picker
                    v-model="currentTime"
                    type="date"
                    @cancel="showTime = false"
                    @confirm="onConfirmTime"
                />
            </van-popup>
        </template>
    </div>
</template>
<script>
import { Row, Col, Search, Cell, Popup, DatetimePicker } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
import { getUserInfo } from '@/common/app'
import { dateTimeFormatCustom } from '@/common/utils'
import { SIGN_MAP_CFG } from '@/common/globalConstCfg'
import { getUserSignListByParameters, getAttendanceCountDmnObjByParameters } from '@/api/attendanceCount'
import moment from 'moment'

export default {
    components: {
        bimHeader,
        [Row.name]: Row,
        [Col.name]: Col,
        [Search.name]: Search,
        [Cell.name]: Cell,
        [Popup.name]: Popup,
        [DatetimePicker.name]: DatetimePicker
    },
    data() {
        return {
            SIGN_MAP_CFG,
            showTime: false,
            currentData: '',
            currentTime: new Date(),
            keyWord: '',
            daySignData: [],
            orgAllUser: {
                signUserNormalNumber: 0,
                orgAllUserNumber: 0,
                signUserEvectionNumber: 0
            }
        }
    },
    filters: {
        dateFormat: dateTimeFormatCustom('YYYY-MM-DD')
    },
    computed: {
        orgId() {
            return getUserInfo()['mainOrgId']
        }
    },
    created() {
        this.currentData = moment(this.currentTime).format('YYYY-MM-DD')
        this.init() // mainOrgId
        console.log(this.orgId, '', this.currentData)
        // moment
    },
    methods: {
        init() {
            this.getOrgSignCount()
            this.getOrgSignList()
        },
        async getOrgSignList() {
            try {
                const params = {
                    orgId: this.orgId,
                    date: this.currentData,
                    filter: this.keyWord
                }
                console.log('params:', params)
                plus.nativeUI.showWaiting()// eslint-disable-line
                this.daySignData = await getUserSignListByParameters(params)
                this.daySignData.forEach((v, i) => { v.id = i + 1 })
                console.log(this.daySignData)
            } catch (error) {
                plus.nativeUI.toast(`获取考勤数据失败: ${error.message}`)// eslint-disable-line
                console.warn(`getUserSignListByParameters接口异常`)
            } finally {
                plus.nativeUI.closeWaiting() // eslint-disable-line
            }
        },
        async getOrgSignCount() {
            try {
                plus.nativeUI.showWaiting()// eslint-disable-line
                const params = {
                    orgId: this.orgId,
                    dateType: 'day',
                    date: this.currentData
                }
                const res = await getAttendanceCountDmnObjByParameters(params)

                this.orgAllUser = res
                // orgAllUser.signUserNormalNumber 出勤人数
                // orgAllUser.orgAllUserNumber 总人数
                console.log(this.signCount, res)
            } catch (error) {
                plus.nativeUI.toast(`获取考勤统计数量失败: ${error.message}`)// eslint-disable-line
                console.warn(`getAttendanceCountDmnObjByParameters`)
            } finally {
                plus.nativeUI.closeWaiting() // eslint-disable-line
            }
        },
        onSearch() { // 搜索  关键字修改
            this.getOrgSignList()
        },
        onConfirmTime(value, index) {
            this.currentTime = value
            this.currentData = moment(value).format('YYYY-MM-DD')
            this.getOrgSignList()
            this.showTime = false
        },
        setTime() {
            this.showTime = true
            console.log('this.currentData', this.currentData)
            this.currentDate = this.currentData === '' ? new Date() : new Date(moment(this.currentData))
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
.bim-header--placeholder{ 
    width: 100%;
    height: 46px;
}
.statistics_active{border-bottom: 1px solid white;}

.statistics-container{
    padding: 0px 15px 0px 15px;
    width: calc(100% - 30px);
    background: $bg2;
    .depart-filter {
        display: flex;
        justify-content: space-between;

        .filter-type, .filter-name {
            width: 48px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .filter-type, .filter-name, .filter-date {
            line-height: 20px;
            border: 1px solid #B5B5B5;
            padding: 2px;
            
            // .arrows{
            //     color: rgb(10, 10, 10);
            // }
        }
        .filter-name {
        }
        .filter-date{
            width: 110px;
        }

    }

    .statistics-person{
        display: flex;
        line-height: 30px;
        // padding-top: 10px;
        .total {
            width: 50%;
        }
        .travel {
            width: 50%;
            text-align: right;
            color: #2B6DB2;
        }
    }

     .list__container{
            padding: 0 15px 0 15px;
            background: $bg2;
            .list__item{
                display: flex;
                height: 70px;
                border-bottom: 1px solid #ebebeb;
                padding: 10px 0 10px 0;
                &_mark{
                    margin-top: 10px;
                    .item__round{
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border: 2px solid #276ab0;
                        .round__text{
                            line-height: 53px;
                            text-align: center;
                            display: block;
                            font-size: 26px;
                            color: #276ab0;
                        }
                    }
                }
                &_detail{
                    width: calc(100% - 50px);
                    // display: flex;
                    line-height: 25px;
                    padding-left: 10px;
                    padding-top: 12px;
                    padding-bottom: 12px;
                    font-size: 14px;
                    .detail__top{
                        display: flex;
                        .detail__name{
                            width: calc(100% - 70px);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .detail__state{
                            width: 70px;
                            text-align: right;
                            // color: #ff7200;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }

                    .detail__bottom{
                        display: flex;
                        
                        .detail__company{
                            width: 50%;
                            color: #9b9a9a;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .detail__date{
                            width: 50%;
                            text-align: right;
                            color: #9b9a9a;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }
}
</style>
