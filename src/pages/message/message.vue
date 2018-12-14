/*
 * @Author: BAICHONG 
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-14 11:49:29
 */
/**
|--------------------------------------------------
| 消息
|--------------------------------------------------
*/
<template>
    <div class="message">
        <bimHeader
            title="消息"
            left-arrow
            @click-left="onClickLeft"
        />
        
        <div class="message-container pa content--top">
            <bimCalendarMsg @month-select="monthSelect" @day-click="datyClick"></bimCalendarMsg>
            <div class="msg">
                <div class="msg__tap">
                    <div class="msg__tap_remind">
                        <span 
                            style="color:#2776bf;border-bottom:1px solid #2776bf;">
                            提醒({{remindNum}})
                        </span>
                    </div>
                    <div class="msg__tap_memo"><span>备忘(0)</span></div>
                </div>
                
                <div class="msg__list" style="padding: 0px 10px 0px 10px;background:white;">
                    <msgItem 
                        v-for="(item, index) in dataList"
                        style="padding: 5px 0 5px 0;"
                        :key="index"
                        :stateText="REMIND_TYPE_TEXT.PartyFeePersonalRemindPerson"
                        :topLeft="item.title"
                        topRight=""
                        :bottLeft="item.startDate | dateTimeFor"
                        bottRight=""
                        @click.native="openPayment(item)"
                    />
                </div>
            </div>
        </div>

        <van-popup v-model="showPay" :close-on-click-overlay="false" position="bottom">
            <payPage @closePay="showPay = false" :payPageData="payPageObj"/>
        </van-popup>
    </div>
</template>

<script>
import bimHeader from '@/component/bimHeader/bimHeader'
import payPage from '@/pages/party-cost/payPage'
import { Popup } from 'vant'
import bimCalendarMsg from '@/component/bimCalendarMsg/bimCalendarMsg'
import { getRemindListByUserId } from '@/api/remind'
import { ifSetCommonAndPersonSetting, getPartyFeeMessage } from '@/api/partyCost'
import { REMIND_TYPE_TEXT, REMIND_TYPE } from '@/common/globalConstCfg'
import { getMonthLastDay, dateTimeFormatCustom } from '@/common/utils'
import msgItem from './msgItem'
export default {
    components: {
        [Popup.name]: Popup,
        bimHeader,
        bimCalendarMsg,
        msgItem,
        payPage
    },
    data() {
        return {
            REMIND_TYPE_TEXT,
            params: {
                filter: '',
                startDt: '',
                endDt: ''
            },
            dataList: [], // 消息数据list
            showPay: false,
            payPageObj: {}
        }
    },
    computed: {
        remindNum() {
            return this.dataList.length
        }
    },
    created() {},
    filters: {
        dateTimeFor: dateTimeFormatCustom()
    },
    methods: {
        init() {},
        // 月,点击事件
        monthSelect(year, month) {
            this.params.startDt = year + '-' + month + '-' + '1'
            this.params.endDt = year + '-' + month + '-' + getMonthLastDay(year, month)
            this.getRemindList()
        },
        // 日,点击事件
        datyClick(day) {
            if (Object.keys(day).length > 0) {
                this.params.startDt = day.date
                this.params.endDt = day.date
                this.getRemindList()
            }
        },
        // 获取消息数据
        getRemindList() {
            plus.nativeUI.showWaiting()
            getRemindListByUserId(this.params)
                .then(res => {
                    if (res.length) {
                        this.dataList = res
                    }
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => { plus.nativeUI.closeWaiting() })
        },
        // 后退
        onClickLeft() {
            this.$router.push({ name: 'MainHome' })
        },
        async openPayment(item) {
            try {
                plus.nativeUI.showWaiting()
                if (item.remindType === REMIND_TYPE.PARYT_FEE_PERSONAL) {
                    const year = new Date(item.expirationDate).getFullYear()
                    // 判断是否有个人设置或者通用设置
                    const isSetting = await ifSetCommonAndPersonSetting(year, item.userId)
                    if (isSetting) {
                        // 获取本期应缴费用
                        const money = await getPartyFeeMessage(item.userId)
                        this.payPageObj = {
                            money,
                            userId: item.userId,
                            date: item.expirationDate
                        }
                        this.showPay = true
                    }
                }
            } catch (error) {
                console.error(error)
                plus.nativeUI.toast(error && error.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        }
    }
}
</script>

<style lang="scss">
.message{
    &-container{
        background: white;
        .msg{
            &__tap{
                display: flex;
                width: 100%;
                background:white;
                height: 40px;
                line-height: 40px;
                border-top: 1px solid #DFDFDF;
                
                &_remind{
                    width: 50%;
                    text-align: center;
                }
                &_memo{
                    width: 50%;
                    text-align: center;
                }
            }
        }
    }
}
</style>