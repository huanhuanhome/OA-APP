/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-25 10:42:49
 */
/**
|--------------------------------------------------
| 统计页
|--------------------------------------------------
*/
<template>
    <div class="signIn pa content--bottom">
        <bimHeader
            title="个人统计"
            left-arrow
            @click-right="onClickRight"
        >
            <div class="signIn--header" v-if="orgResponsible"><!-- 只有部门负责人才能进入 -->
                <img class="signIn-img" src="../../assets/images/depart-statistics.png">
            </div>
        </bimHeader>
        <div class="pa content--tb">
            <!-- 月统计日历 -->
            <bimCalendarStat @month-click="monthClick" isInitMonth/>
            <!-- 日历详情 start -->
            <div class="calendar-detail">
                <div class="calendar-detail_msg">
                    <div class="calendar-detail_msg_reminder">
                        距离本月补卡考勤截止还有<b style="color:red">{{ lastTime }}</b>天
                    </div>
                    <div class="calendar-detail_msg_apply" @click="applyCard" v-if="!isLeader&&canApplyCard">
                        <div class="calendar-detail_applyCard">
                            <img class="applyCard_img" src="../../assets/images/apply-card.png">
                        </div>
                        <div class="text">申请补卡</div>
                    </div>
                </div>
                <div class="calendar-detail_work">
                    <div class="calendar-detail_work_item">
                        <div class="work-item_left">正常</div>
                        <div class="work-item_right">{{statisticalData.signUserNormalNumber}}天</div>
                    </div>
                    <div class="calendar-detail_work_item">
                        <div class="work-item_left">迟到</div>
                        <div class="work-item_right">{{statisticalData.signUserLateNumber}}天</div>
                    </div>
                    <div class="calendar-detail_work_item">
                        <div class="work-item_left">早退</div>
                        <div class="work-item_right">{{statisticalData.signUserLeaveEarlyNumber}}天</div>
                    </div>
                    <div class="calendar-detail_work_item">
                        <div class="work-item_left">迟到且早退</div>
                        <div class="work-item_right">{{statisticalData.signUserLateAndLeaveEarlyNumber}}天</div>
                    </div>
                    <div class="calendar-detail_work_item">
                        <div class="work-item_left">休假</div>
                        <div class="work-item_right">{{statisticalData.signUserLeaveNumber}}天</div>
                    </div>
                    <div class="calendar-detail_work_item">
                        <div class="work-item_left">出差</div>
                        <div class="work-item_right">{{statisticalData.signUserEvectionNumber}}天</div>
                    </div>
                    <div class="calendar-detail_work_item">
                        <div class="work-item_left">外出</div>
                        <div class="work-item_right">{{statisticalData.signUserGoOutNumber}}天</div>
                    </div>
                    <div class="calendar-detail_work_item">
                        <div class="work-item_left">外出(异常)</div>
                        <div class="work-item_right">{{statisticalData.signUserOutingAbnormalNumber}}天</div>
                    </div>
                    <div class="calendar-detail_work_item">
                        <div class="work-item_left">缺勤</div>
                        <div class="work-item_right">{{statisticalData.signUserAbsenteeismNumber }}天</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { NavBar, Icon } from 'vant'
import bimCalendarStat from '@/component/bimCalendarStat/bimCalendarStat'
import { getUserInfo, getMappingCfg } from '@/common/app'
import { LOCALSTORAGE_KEYS } from '@/common/globalConstCfg'
import { getUserSignMonthCountByParameters } from '@/api/attendanceCount'
import { clockValidate } from '@/api/workflow'
import bimHeader from '@/component/bimHeader/bimHeader'
import { openWebview } from '@/utils/webview'
import moment from 'moment'
/* global plus */
export default {
    components: {
        [NavBar.name]: NavBar,
        [Icon.name]: Icon,
        bimCalendarStat,
        bimHeader
    },
    data() {
        return {
            statisticalData: {},
            params: {
                userId: getUserInfo().id,
                month: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1)}` : new Date().getMonth() + 1)
            },
            lastTime: '0',
            isLeader: getUserInfo()[LOCALSTORAGE_KEYS.IS_LEADER], // 是不是领导
            canApplyCard: false, // 可以申请补卡
            orgResponsible: getUserInfo()['hasOrgResponsibleUser'] // 是不是部门负责人
        }
    },
    computed: {
        // 数据字典
        baseDicts: _ => getMappingCfg(),
        // 结算日期
        balanceDate() { return this.baseDicts['SingConfiguration.BalanceDay'].date.value },
        // 结算日期时间戳
        balanceTime() {
            const date = new Date()
            if (Number(moment().format(`DD`)) > Number(this.balanceDate)) {
                return +new Date(date.getFullYear(), date.getMonth() + 1, this.balanceDate, 0, 0, 0)
            } else {
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
        // 获取本月统计统筹
        async loadData() {
            try {
                plus.nativeUI.showWaiting() // eslint-disable-line
                const res = await getUserSignMonthCountByParameters(this.params)
                this.statisticalData = res
            } catch (err) {
                console.warn(err)
            } finally {
                plus.nativeUI.closeWaiting() // eslint-disable-line
            }
        },
        // 计算补卡期限
        getCountDown() {
            this.lastTime = Number(moment(this.balanceTime - +new Date()).format(`DD`))
        },
        // header右侧按钮
        onClickRight() {
            openWebview({ url: 'departStatistics.html', id: 'departStatistics' })
        },
        statisData(value) {
        },
        monthClick(year, month) {
            this.params.month = `${year}-${Number(month) < 10 ? `0${month}` : month}`
            this.loadData()
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
.signIn{
    width: 100%;
    height: 100%;
}
.signIn--header {
    position: absolute;
    height: 46px;
    width: 50px;
    top: -46px;
    display: flex;
    right: -30px;
    align-items: center;
}
.signIn-img{
    width: 20px;
    display: block;
}
.calendar-detail{
    border-top: 1px solid #EBEBEB;
    background: white;
    padding-left: 10px;
    padding-right: 10px;
    
    &_msg {
        display: flex;
        justify-content: space-between;
        font-size: 14px;

        &_reminder {
            margin-top:20px;
            line-height: 24px;
        }

        &_apply {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 25%;
            text-align: right;
            color: red;
            margin-top: 20px;
            line-height: 24px;
            // text-decoration-line: 1px floor;
            .calendar-detail_applyCard{
                width: 16px;
                height: 16px;
                padding-right: 5px;
                
                .applyCard_img {
                    width: 16px;
                    height: 16px;
                    display: block;

                }
            }
            .text{
                line-height: 16px;
            }
        }
    }

    &_work {

        &_item {
            display: flex;
            border-bottom: 1px solid #EBEBEB;
            width: 100%;
            height:36px;
            line-height:36px;
            font-size:12px;
            .work-item_left {
                width: 50%;
            }

            .work-item_right {
                width: 50%;
                text-align: right;
                color: #2776BF;
            }
        }
    }

}
</style>