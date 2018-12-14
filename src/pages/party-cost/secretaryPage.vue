/*
 * @Author: LG
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-14 11:15:51
 */
/**
|--------------------------------------------------
| 党工团模块-支部书记缴费记录 class="pa content--tb"
|--------------------------------------------------
*/
<template>
  <div class="secretary-page pr">
    <bimHeader 
        :title="title" 
        left-arrow 
        @click-right="onClickRight">
        <i class="iconfont icon-sortlight i-go-list" v-if="!active"></i>
    </bimHeader>
    <transition-group enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      
      <!-- 记录 -->
      <div class="oh pa" style="width:100%;top:46px;bottom:50px;" :key="1" v-show="isJiLu">
        <!--缴费情况-->
        <div class="secretaryPagejilu--content">
            <div class="cost-block mb5">
            <p v-if="isCost" class="txt-cost-yes">您已于2018-07-21日成功本月党费支付123元整！</p>
            <p v-else class="txt-cost-no">请按时缴纳党费,特此通知！</p>
            </div>
            <!--缴费记录-->
            <bimCollapse1 :bimCollapse1Array="bimCollapse1Data1"/>
        </div>
      </div>

      <!-- 统计 -->
      <div  class="oh pa" style="width:100%;top:46px;bottom:50px;" :key="2" v-show="isTongJi">
        <div class="secretaryPagetongji--content">
            <div class="secretaryPagetongji--content__selectblock mb5">
                <div class="btn-select mr5">
                    <button class="btn-select__normal" @click="choose('name')">
                        <span class="btn-select__text">{{ selectObj.partyMember }}</span>
                        <i class="van-icon van-icon-arrow btn-select__icon"></i>
                    </button>
                </div>
                <div class="btn-select">
                    <button class="btn-select__normal" @click="choose('year')">
                        <span class="btn-select__text">{{ selectObj.year }}</span>
                        <i class="van-icon van-icon-arrow btn-select__icon"></i>
                    </button>
                </div>
                <div class="btn-search">
                     <button class="btn-search__normal" @click="submitSearch">
                        <i class="van-icon van-icon-search btn-search__icon"></i>
                    </button>
                </div>
                <p class="mt10">
                <span>缴纳期数({{ jnMonth }}/12)</span>
                <span>缴纳人数({{ jnUserNum }}/{{ totalUserNum }})</span>
                </p>
            </div>
            <bimCollapse2 :bimCollapse2Array="bimCollapse2Data1" @bimCollapse2BackObj="secretaryObj"/>
        </div>
      </div>
    </transition-group>

    <van-tabbar fixed v-model="active" @change="tabbarChoose">
      <van-tabbar-item>
        <span 
            slot-scope="props" 
            :style="{color: props.active ? '#2776bf' : ''}">
            记录
        </span>
        <img 
            slot="icon"
            slot-scope="props"
            :src="props.active ? jiluIcon.active : jiluIcon.normal"
        />
      </van-tabbar-item>
      <van-tabbar-item>
        <span 
            slot-scope="props" 
            :style="{color: props.active ? '#2776bf' : ''}">
            统计
        </span>
        <img 
            slot="icon"
            slot-scope="props"
            :src="props.active ? tongjiIcon.active : tongjiIcon.normal"
        />
      </van-tabbar-item>
    </van-tabbar>
    
    <van-popup v-model="asShow" position="bottom">
        <van-picker
            value-key="name"
            show-toolbar
            :columns="asActions" 
            @cancel="asShow = false"
            @confirm="onSelect"
        />
    </van-popup>
    <van-popup v-model="isPayPage" :close-on-click-overlay="false" position="bottom">
        <payPage @closePay="closePay" :payPageData="payPageObj"/>
    </van-popup>

  </div>
</template>
<script>
import { getUserInfo, getMappingCfg } from '@/common/app.js'
import { parseTime } from '@/common/utils.js'
import { Actionsheet, Tabbar, TabbarItem, Button, Popup, Picker } from 'vant'
import {
    getPartyFeePaymentRecord,
    getPaymentStatisticsByYearAndUserId,
    getPageToShow,
    ifSetCommonAndPersonSetting
} from '@/api/partyCost'
import { getPartyUserListByData } from '@/api/oaUser'
import bimHeaderMyInfo from '@/component/bimHeaderMyInfo/bimHeaderMyInfo'
import bimHeader from '@/component/bimHeader/bimHeader'
import bimCollapse1 from '@/component/bimCollapse1/bimCollapse1'
import bimCollapse2 from '@/component/bimCollapse2/bimCollapse2'
import payPage from '@/pages/party-cost/payPage'
export default {
    components: {
        bimHeader,
        bimHeaderMyInfo,
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem,
        [Button.name]: Button,
        [Actionsheet.name]: Actionsheet,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        bimCollapse1,
        bimCollapse2,
        payPage
    },
    props: {
        secretOrgId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            title: '缴费记录',
            active: 0,
            isJiLu: true,
            isTongJi: false,
            isCost: false,
            bimHeaderMyInfoData: {
                name: '',
                date: ''
            },
            jiluIcon: {
                normal: require('@/assets/images/df-jilu.png'),
                active: require('@/assets/images/df-jilu-active.png')
            },
            tongjiIcon: {
                normal: require('@/assets/images/df-tongji.png'),
                active: require('@/assets/images/df-tongji-active.png')
            },
            bimCollapse1Data1: [], // 缴费记录
            bimCollapse2Data1: [], // 缴费统计
            orgId: '',
            filterDt: '',
            beforeDay: '', //  设置的缴费时间
            totalUserNum: '', //  总人数
            jnUserNum: 0, //  缴纳人数
            jnMonth: 0, // 缴纳期数
            asShow: false, // 弹出下拉菜单
            asActions: [], //  弹出下拉菜单数据
            userList: [], // 获取党组织下党员名单
            popYear: [], //  获取年份，默认之前十年
            selectObj: {
                partyMember: '选择党员',
                year: ''
            },
            isPayPage: false, //  支付页面是否显示
            payPageObj: {
                date: '', //  时间
                money: '', //  钱数
                message: ''
            },
            userId: '',
            selectedUserId: ''
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
        if (userInfo && userInfo.mainOrgId !== '') {
            this.orgId = userInfo.mainOrgId
        }
        this.filterDt = parseTime(new Date(), '{y}')
        this.selectObj.year = parseTime(new Date(), '{y}')
        for (var i = 0; i <= 10; i++) {
            this.popYear.push({ name: this.filterDt - i, yearId: this.filterDt - i })
        }
        setTimeout(() => {
            this.payPopWindow() //  是否显示支付页面
        }, 800)
        this.init()
    },
    methods: {
        tabChange(active) {
            if (active === 0) {
                this.isJiLu = true
                this.isTongJi = false
                this.title = '缴费记录'
            } else {
                this.isJiLu = false
                this.isTongJi = true
                this.title = '支部统计'
                if (!this.bimCollapse2Data1.length && !this.selectedUserId) {
                    const params = {
                        orgId: this.secretOrgId,
                        year: this.filterDt,
                        beforeDay: this.beforeDay
                    }
                    this.getStatisticData(params) // 获取统计数据
                }

                if (!this.userList.length) {
                    this.getUserList() // 获取组织下的人员
                }
            }
        },
        tabbarChoose(active) {
            this.tabChange(active)
        },
        async init() {
            this.getRecordData() // 获取记录数据
        },
        getRecordData() {
            plus.nativeUI.showWaiting()
            const params = {
                userId: this.userId,
                // userId: 2,
                beforeDay: this.beforeDay
            }
            getPartyFeePaymentRecord(params)
                .then(res => {
                    if (res && res.objList && res.objList.length) {
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
                        plus.nativeUI.toast('暂无数据')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => { plus.nativeUI.closeWaiting() })
        },
        async getUserList() {
            try {
                const params = {
                    orgId: this.secretOrgId,
                    expand: true,
                    filter: ''
                }
                const res = await getPartyUserListByData(params)
                if (res && res.length) {
                    this.userList = res
                }
            } catch (error) {
                plus.nativeUI.toast(error && error.message)
            }
        },
        async getStatisticData(params) {
            try {
                plus.nativeUI.showWaiting()
                // 判断是否有个人设置或者通用设置
                const hasStatistics = await ifSetCommonAndPersonSetting(this.filterDt, this.selectedUserId)
                const res = hasStatistics ? await getPaymentStatisticsByYearAndUserId(params) : []

                if (res && (res.objList && res.objList.length)) {
                    this.totalUserNum = res.totalUserNum
                    this.bimCollapse2Data1 = []
                    this.jnMonth = res.objList.length

                    try {
                        res.objList.forEach((item, index) => {
                            if (item.recordEntityList && item.recordEntityList.length > 0) {
                                this.jnUserNum = this.totalUserNum - item.recordEntityList.length
                                throw new Error('EndforEach')
                            }
                        })
                    } catch (e) {
                        if (e.message !== 'EndforEach') throw e
                    }

                    res.objList.forEach((item, index) => {
                        if (item.recordEntityList && item.recordEntityList.length > 0) {
                            item.status = true
                        }
                        this.bimCollapse2Data1.push({
                            year: this.filterDt,
                            month: item.month, // 月份
                            shouldPayTotal: item.shouldPayTotal, // 年度应交
                            actualPayTotal: item.actualPayTotal, // 年度已交
                            recordEntityList: [],
                            status: item.status
                        })
                        if (item.recordEntityList && item.recordEntityList.length > 0) {
                            item.recordEntityList.forEach((monArr) => {
                                this.bimCollapse2Data1[index].recordEntityList.push(monArr)
                            })
                        }
                    })
                } else {
                    plus.nativeUI.toast('暂无数据')
                }
            } catch (error) {
                plus.nativeUI.toast(error && error.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        secretaryObj(data) {
            this.jnMonth = data.jnMonth
            this.jnUserNum = this.totalUserNum - data.jnUserNum
        },
        choose(type) {
            this.asActions = type === 'year' ? this.popYear : this.userList
            this.asShow = true
        },
        onSelect(item) {
            if (item.hasOwnProperty('userId')) { // 党员
                this.selectObj.partyMember = item.name
                this.selectedUserId = item.userId
            } else {
                this.selectObj.year = item.name
                this.filterDt = item.name
            }
            this.asShow = false
        },
        submitSearch() {
            const params = {
                orgId: this.secretOrgId,
                userId: this.selectedUserId,
                year: this.filterDt,
                beforeDay: this.beforeDay
            }
            this.getStatisticData(params)
        },
        payPopWindow() {
            plus.nativeUI.showWaiting()
            const params = {
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
        },
        onClickRight() {
            this.active = 1
            this.tabChange(1)
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
@import '../../assets/font/iconfont.css';
.secretary-page{
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
.secretaryPagetongji--content{
  &__selectblock{
    padding:10px 15px;
    background: $bg2;
    p{
        font-size:14px;
        line-height:24px;
        span{
            display:inline-block;
            width:49%;
            line-height:24px;
        }
        span:first-child{
            text-align: left;
        }
        span:last-child{
            color: $textc9;
            text-align: right;
        }
    }
  }
}
.secretaryPagejilu--content,.secretaryPagetongji--content{
    position: absolute;
    top:0px;
    bottom:0px;
    width:100%;
    overflow-y: auto;
}
.secretaryPagejilu--content::-webkit-scrollbar,
.secretaryPagetongji--content::-webkit-scrollbar{display:none}
/deep/ .van-tabbar-item--active{
    background: $bg6;
}
</style>