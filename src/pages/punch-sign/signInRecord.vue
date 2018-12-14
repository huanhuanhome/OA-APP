/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-25 10:42:04
 */
/**
|--------------------------------------------------
| 个人当月打卡记录
|--------------------------------------------------
*/
<template>
    <div>
        <bimHeader 
            title="打卡记录" 
            left-arrow
        >
        </bimHeader>
        <div class="applyCard--content pr content--top">
            <!-- 个人统计 -->
            <bimCalendarPer @day-click="dayClick"/>
            <div class="applyCard">
                <div class="applyCard_msg">
                    距离本月补卡考勤截止还有<b style="color:red">{{ lastTime }}</b>天
                </div>
                <div class="applyCard_btn" @click="applyCard" v-if="!isLeader&&canApplyCard"><!-- 领导不可以申请补卡 -->
                    <div class="applyCard_btn_applyCard">
                        <img class="applyCard_img" src="../../assets/images/apply-card.png">
                    </div>
                    <div class="text">申请补卡</div>
                </div>
            </div>
            <div class="record">
                <div class="record_date">
                    <div class="record_date_detail">{{dayInfo.day}}</div>
                </div>
                <!-- 外出 -->
                <template v-if="!isSignToday&&(dayInfo.signState == ATTENDANCE.OUTING || dayInfo.signState == ATTENDANCE.OUTINGABNORMAL)">
                    <div class="record_signIn">
                        <div class="record_content">
                            <div class="title">外出开始时间:</div>
                            <div class="content">{{dayData.outingStartDate | dateTimeFormat}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">外出结束时间:</div>
                            <div class="content">{{dayData.outingEndDate | dateTimeFormat}}</div>
                        </div>
                    </div>
                    <div class="record_signOut">
                        <div class="record_content">
                            <div class="title">累计时长:</div>
                            <div class="content">{{dayData.cumulativeLength}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">外出事由:</div>
                            <div class="content">{{dayData.outingCause}}</div>
                        </div>
                    </div>
                    <div class="workTimes">
                        <div class="record_content">
                            <div class="title">考勤状态:</div>
                            <div class="content">{{SIGN_MAP_CFG[dayInfo.signState]}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">补卡状态:</div>
                            <div class="content">{{WORK_FLOW_STATE[dayData.mendCardState]}}</div>
                        </div>
                        <div class="auditStatus">
                            <span class="beingAudited" v-if="dayData.mendCardState == WORK_FLOW_STATE.PUBLISH_VAL">补卡审核中</span>
                            <span class="audited" v-if="dayData.mendCardState == WORK_FLOW_STATE.APPROVE_VAL">审核通过</span>
                        </div>
                    </div>
                </template>
                <!-- 请假 -->
                <template v-else-if="!isSignToday&&dayInfo.signState == ATTENDANCE.LEAVE">
                    <div class="record_signIn">
                        <div class="record_content">
                            <div class="title">请假开始时间:</div>
                            <div class="content">{{dayData && dayData.details && dayData.details.length && dayData.details[0].leaveStartDt | dayFormat}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">请假结束时间:</div>
                            <div class="content">{{dayData && dayData.details && dayData.details.length && dayData.details[0].leaveEndDt | dayFormat}}</div>
                        </div>
                    </div>
                    <div class="record_signOut">
                        <div class="record_content">
                            <div class="title">请假类型:</div>
                            <div class="content">{{leaveTypeCfg[dayData.leaveType]}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">请假说明:</div>
                            <div class="content">{{dayData.leaveExplanation}}</div>
                        </div>
                    </div>
                    <div class="workTimes">
                        <div class="record_content">
                            <div class="title">考勤状态:</div>
                            <div class="content">{{SIGN_MAP_CFG[dayInfo.signState]}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title"></div>
                            <div class="content"></div>
                        </div>
                    </div>
                </template>
                <!-- 出差 -->
                <template v-else-if="!isSignToday&&dayInfo.signState == ATTENDANCE.BUS_TRAVEL">
                    <div class="record_signIn">
                        <div class="record_content">
                            <div class="title">出差开始时间:</div>
                            <div class="content">{{dayData.beginDt | dayFormat}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">出差结束地点:</div>
                            <div class="content">{{dayData.endDt  | dayFormat}}</div>
                        </div>
                    </div>
                    <div class="record_signOut">
                        <div class="record_content">
                            <div class="title">出差类型:</div>
                            <div class="content">{{travelTypeCfg[dayData.type]}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">出差事由:</div>
                            <div class="content">{{dayData.reason}}</div>
                        </div>
                    </div>
                    <div class="workTimes">
                        <div class="record_content">
                            <div class="title">考勤状态:</div>
                            <div class="content">{{SIGN_MAP_CFG[dayInfo.signState]}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title"></div>
                            <div class="content"></div>
                        </div>
                    </div>
                </template>
                <!-- 其他 -->
                <template v-else>
                    <div class="record_signIn">
                        <div class="record_content">
                            <div class="title">签到时间:</div>
                            <div class="content">{{dayData.signTime | dateTimeFormat}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">签到地点:</div>
                            <div class="content">{{dayData.signLocation}}</div>
                        </div>
                    </div>
                    <div class="record_signOut">
                        <div class="record_content">
                            <div class="title">签退时间:</div>
                            <div class="content">{{dayData.signBackTime | dateTimeFormat}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">签退地点:</div>
                            <div class="content">{{dayData.signBackLocation}}</div>
                        </div>
                    </div>
                    <div class="workTimes">
                        <div class="record_content">
                            <div class="title">签到状态:</div>
                            <div class="content">{{SIGN_MAP_CFG[dayInfo.signState]}}</div>
                        </div>
                        <div class="record_content">
                            <div class="title">补卡状态:</div>
                            <div class="content">{{WORK_FLOW_STATE[dayData.mendCardState]}}</div>
                        </div>
                    </div>
                </template>
                
            </div>
        </div>
    </div>
</template>

<script>
/* global plus */
import { NavBar } from 'vant'
import bimCalendarPer from '@/component/bimCalendarPer/bimCalendarPer'
import { dateTimeFormatCustom, handleMapCfgToObj } from '@/common/utils'
import { CARD_STATE, WORK_FLOW_STATE, ATTENDANCE, SIGN_MAP_CFG } from '@/common/globalConstCfg'
import { clockValidate, getDetailByDate, getLeaveDetailByCalender, getOutingInfoByUserIdAndDate } from '@/api/workflow'
import { getSignDayListByUserIdAndDate, getRealSignDayListByUserIdAndDate } from '@/api/attendanceCount'
import bimHeader from '@/component/bimHeader/bimHeader'
import { openWebview } from '@/utils/webview'
import { getUserInfo, getMappingCfg } from '@/common/app'
import moment from 'moment'
export default {
    components: {
        [NavBar.name]: NavBar,
        bimCalendarPer,
        bimHeader
    },
    filters: {
        dateTimeFormat: dateTimeFormatCustom('YYYY-MM-DD HH:mm:ss'),
        dayFormat: dateTimeFormatCustom('YYYY-MM-DD')
    },
    data() {
        return {
            dayData: {},
            CARD_STATE,
            WORK_FLOW_STATE,
            SIGN_MAP_CFG,
            lastTime: 0,
            dayInfo: {},
            isLeader: getUserInfo()['hasLeading'],
            canApplyCard: false, // 可以申请补卡
            supplementCardInfo: {},
            ATTENDANCE,
            leaveTypeCfg: handleMapCfgToObj('WorkFlow.Personnel.Leave.Type'), // 休假类型
            travelTypeCfg: handleMapCfgToObj('WorkFlow.Personnel.BusinessTravel.Type'),
            isSignToday: false
        }
    },
    computed: {
        // 数据字典
        baseDicts() { return getMappingCfg() },
        // 结算日期
        balanceDate() { return this.baseDicts['SingConfiguration.BalanceDay'].date.value },
        // 结算日期时间戳
        balanceTime() {
            const date = new Date()
            // 考勤期限之后
            if (Number(moment().format(`DD`)) > Number(this.balanceDate)) {
                return +new Date(date.getFullYear(), date.getMonth() + 1, this.balanceDate, 0, 0, 0)
            } else { // 考勤期限之前
                return +new Date(date.getFullYear(), date.getMonth(), this.balanceDate, 0, 0, 0)
            }
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.validate()
            this.getCountDown()
        },
        // 计算补卡期限
        getCountDown() {
            this.lastTime = Number(moment(this.balanceTime - (+new Date())).format('DD'))
        },
        // 点击某一天
        dayClick(day) {
            this.dayInfo = day
            if (day.day) this.getSupplementCardInfo(day)
            this.isSignToday = false
        },
        async getSupplementCardInfo(dayInfo) {
            try {
                plus.nativeUI.showWaiting() // eslint-disable-line
                const params = {
                    date: dayInfo.day
                }
                // 如果有打卡状态,取当日打卡状态
                if (dayInfo.hasToday) {
                    const res = await getRealSignDayListByUserIdAndDate()
                    if (res.signTime) {
                        this.isSignToday = true
                        return (this.dayData = res)
                    }
                }
                if (dayInfo.signState === 'BusinessTravel') {
                    const res = await getDetailByDate(params)
                    this.dayData = res || {}
                } else if (dayInfo.signState === 'Outing' || dayInfo.signState === 'OutingAbnormal') {
                    const res = await getOutingInfoByUserIdAndDate(params)
                    this.dayData = res || {}
                } else if (dayInfo.signState === 'Leave') {
                    const res = await getLeaveDetailByCalender(params)
                    this.dayData = res || {}
                } else {
                    const res = await getSignDayListByUserIdAndDate(params)
                    this.dayData = res || {}
                }
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        // 申请补卡
        applyCard() {
            openWebview({
                url: 'applyMendClock.html',
                id: 'applyMendClock'
            })
        },
        async validate() {
            try {
                plus.nativeUI.showWaiting()
                this.canApplyCard = await clockValidate()
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.applyCard {
    display: flex;
    border-top: 1px solid #EBEBEB;
    padding-left: 10px;
    padding-right: 10px;
    background: $white;
    font-size: 14px;
    padding-top:20px;
    
    &_msg {
        line-height: 24px;
        width: 70%;
        height: 30px;
    }

    &_btn {
        width: 30%;
        color: red;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        &_applyCard{
            width: 16px;
            height: 16px;
            padding-right: 5px;
            .applyCard_img {
                width: 16px;
                height: 16px;
                display: block;
            }
        }

        .text {
            line-height: 16px;
            text-align: right;
        }

    }
}
.record {
    background: $white;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
    font-size: 14px;

    .record_signIn, .record_signOut, .workTimes {
        line-height: 40px;

        .record_content {
            display: flex;
            justify-content: space-between;

            .title {
                width: 100px;
            }

            .content {
                text-align: right;
                color: #2776BF;
                width: calc(100% - 75px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }

    .record_signIn, .record_signOut {
        border-bottom: 1px solid #EBEBEB;
    }

    .workTimes {
        .auditStatus {
            .beingAudited {
                color: #FF7200;
                padding-right: 10px;
            }
            .audited {
                color: #42B8AC;
            }
        }
    }
}
</style>