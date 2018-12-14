/*
 * @Author: LG
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-14 17:15:24
 */
/**
|--------------------------------------------------
| 党工团模块-党员记录
|--------------------------------------------------
*/
<template>

    <div class="partyMember-page pr">

        <bimHeader title="缴费记录" left-arrow/>
        
        <div class="pa"  style="width:100%;top:46px;">

            <!--缴费情况-->
            <div class="cost-block mb5">
            <p v-if="isCost" class="txt-cost-yes">您已于2018-07-21日成功本月党费支付123元整！</p>
            <p v-else class="txt-cost-no">请按时缴纳党费,特此通知！</p>
            </div>

            <!--缴费记录-->
            <bimCollapse1 :bimCollapse1Array="bimCollapse1Data1"/>

            <van-popup v-model="isPayPage" :close-on-click-overlay="false" position="bottom">
                <payPage @closePay="closePay" :payPageData="payPageObj"/>
            </van-popup>

        </div>

    </div>
</template>
<script>
import { getUserInfo, getMappingCfg } from '@/common/app.js'
import { getPartyFeePaymentRecord, getPageToShow } from '@/api/partyCost'
import { Popup } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
import bimHeaderMyInfo from '@/component/bimHeaderMyInfo/bimHeaderMyInfo'
import bimCollapse1 from '@/component/bimCollapse1/bimCollapse1'
import payPage from '@/pages/party-cost/payPage'
export default {
    components: {
        [Popup.name]: Popup,
        bimHeader,
        bimHeaderMyInfo,
        bimCollapse1,
        payPage
    },
    data() {
        return {
            isCost: false,
            bimHeaderMyInfoData: {
                name: '',
                date: ''
            },
            userId: '',
            beforeDay: '', //  设置的缴费时间
            bimCollapse1Data1: [],
            bimReceipt1Data: {},
            isPayPage: false, //  支付页面是否显示
            payPageObj: {
                date: '', //  时间
                money: '', //  钱数
                message: ''
            }
        }
    },
    created() {
        const userInfo = getUserInfo()
        const mappingCfg = getMappingCfg()
        this.beforeDay = mappingCfg['PartyFeeBeforeDay'].beforeDay.value || 5
        if (userInfo && userInfo.name !== '') {
            this.bimHeaderMyInfoData.name = userInfo.name
        }
        if (userInfo && userInfo.id !== '') {
            this.userId = userInfo.id
        }
    },
    mounted() {
        setTimeout(() => {
            this.isPayPage = true
            // this.payPopWindow() // 是否显示支付页面
        }, 1200)
        this.init()
    },
    methods: {
        init() {
            plus.nativeUI.showWaiting()
            const params = {
                userId: this.userId,
                // userId: 2,
                beforeDay: this.beforeDay
            }
            getPartyFeePaymentRecord(params)
                .then(res => {
                    if (res) {
                        if (res.objList && res.objList.length > 0) {
                            this.bimCollapse1Data1 = []
                            res.objList.forEach((item, index) => {
                                this.bimCollapse1Data1.push({
                                    year: item.year, // 年份
                                    shouldPayTotal: item.shouldPayTotal, // 年度应交
                                    actualPayTotal: item.actualPayTotal, // 年度已交
                                    monthArray: []
                                })
                                if (item.recordEntityList && item.recordEntityList.length > 0) {
                                    item.recordEntityList.forEach((monArr) => {
                                        this.bimCollapse1Data1[index].monthArray.push(monArr)
                                    })
                                }
                            })
                        } else {
                            plus.naticeUI.toast('暂无数据')
                        }
                    } else {
                        plus.naticeUI.toast('暂无数据')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => { plus.nativeUI.closeWaiting() })
        },
        payPopWindow() {
            plus.nativeUI.showWaiting()
            const params = {
                // userId: 2,
                userId: this.userId,
                beforeDay: this.beforeDay
            }
            getPageToShow(params)
                .then(res => {
                    if (res) {
                        this.isPayPage = res.openPayPage
                        this.payPageObj.date = res.date
                        this.payPageObj.money = res.money
                        this.payPageObj.message = res.message
                    } else {
                        plus.nativeUI.toast('暂无数据')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => { plus.nativeUI.closeWaiting() })
        },
        closePay() {
            this.isPayPage = false
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.partyMember-page{
    width:100%;
    height:100%;
}
.cost-block{
  height:100px;
  width:100%;
  display: flex;
  align-items:center;
  justify-content:center;
  background: $bg2;
}
.txt-cost-yes,.txt-cost-no{
  font-size:16px;
  line-height:24px;
}
.txt-cost-yes{color: $textc4;}
.txt-cost-no{color: $textc8;}
</style>