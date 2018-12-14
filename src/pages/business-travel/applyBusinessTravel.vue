/*
 * @Author: suntingting 
 * @Date: 2018-09-11 11:28:10 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-08 17:22:50
 */
/**
|--------------------------------------------------
| 
|   出差申请
| 
| 
|--------------------------------------------------
*/
<template>
    <div class="leave-new">
        <bimHeader 
            title="出差申请"
            left-arrow
        >
            <div @click="openList" v-if="showList&&!showApprove">
                <i solt="right" class="iconfont icon-sortlight i-go-list"></i>
            </div>
        </bimHeader>
        <div class="leave-new-block">
            <div class="collapse-block" style="padding-top:0px;">
                <van-collapse v-model="activeNames">
                    <van-collapse-item title="基础信息" name="1">
                        <ul class="g-list-2">
                            <li><span class="label">姓名：</span>{{ formInfo.createrName }}</li>
                            <li><span class="label">部门：</span>{{ formInfo.createrOrgName }}</li>
                            <li><span class="label">申请日期：</span>{{ createDt }}</li>
                            <li class="required" @click="showType = true">
                                <span class="label">出差类型：</span>
                                {{ travelType }}
                                <i class="iconfont icon-right"></i>
                            </li>
                            <li class="indent20">
                                <span class="label">同行人员：</span>
                                <van-field
                                    v-model="formInfo.withPeople"
                                    type="textarea"
                                    placeholder="请输入同行人员"
                                    rows="1"
                                    autosize
                                />
                            </li>
                            <li class="required" @click="setTime('start')">
                                <span class="label">开始时间：</span>
                                <van-field 
                                    v-model="formInfo.beginDt"
                                    disabled 
                                    placeholder="请选择开始时间"
                                />
                                <i class="iconfont icon-right"></i>
                            </li>
                            <li class="required" @click="setTime('end')">
                                <span class="label">结束时间：</span>
                                <van-field 
                                    v-model="formInfo.endDt"
                                    disabled 
                                    placeholder="请选择结束时间"
                                />
                                <i class="iconfont icon-right"></i>
                            </li>
                            <li><span class="label">出差天数：</span>{{ formInfo.days }}天</li>
                            <li class="indent20">
                                <span class="label">出差地点：</span>
                                <van-field
                                    v-model="formInfo.place"
                                    type="textarea"
                                    placeholder="请输入出差地点"
                                    rows="1"
                                    autosize
                                />
                            </li>
                            <li class="required indent20">
                                <span class="label">出差事由：</span>
                                <van-field
                                    v-model="formInfo.reason"
                                    type="textarea"
                                    placeholder="请输入出差事由"
                                    rows="3"
                                    autosize
                                />
                            </li>
                        </ul>
                    </van-collapse-item>
                    <van-collapse-item title="审批流程" name="2" v-if="!showApprove">
                        <ul class="g-list-2">
                            <li class="required" v-if="!formInfo.leaderPublish">
                                <span class="label" style="width:80px">部门负责人：</span>
                                {{formInfo.approveInfo && formInfo.approveInfo[0] && formInfo.approveInfo[0].name}}
                            </li>
                            <li class="required" v-else  @click="showApprover = true">
                                <span class="label">分管领导：</span>
                                {{ approveInfoValue }}
                                <i class="iconfont icon-right"></i>
                            </li>
                        </ul>
                    </van-collapse-item>
                </van-collapse>
                <div class="collapse-block__operation" v-if="!showApprove">
                    <div class="submit-button plr15 pt20 pb20">
                        <van-button type="primary" size="large" class="submit-button__submit mb10" @click="submitForm">
                            提交
                        </van-button>
                    </div>
                </div>
            </div>
        </div>
        <template>
            <!-- 出差类型  -->
            <van-popup v-model="showType" position="bottom">
                <van-picker
                    show-toolbar
                    value-key="value"
                    :columns="travelTypeOptions" 
                    @cancel="showType = false"
                    @confirm="onConfirm"
                />
            </van-popup>
            <!-- 出差开始时间  -->
            <van-popup v-model="showTime" position="bottom">
                <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    :min-date="minTime"
                    :max-date="maxTime"
                    @cancel="showTime = false"
                    @confirm="onConfirmTime"
                />
            </van-popup>
            <!-- 分管领导  -->
            <van-popup v-model="showApprover" position="bottom">
                <van-picker
                    show-toolbar
                    value-key="name"
                    :columns="formInfo.approveInfo" 
                    @cancel="showApprover = false"
                    @confirm="onConfirmApprover"
                />
            </van-popup>
        </template>
    </div>
</template>
<script>
import { openWebview } from '@/utils/webview'
import bimHeader from '@/component/bimHeader/bimHeader'
import { fire } from '@/utils/envent.js'
import { getMappingCfg, getUserInfo } from '@/common/app'
import { travelInit, travelPublish, validateSignFlowDate } from '@/api/workflow'
import { Cell, Field, Button } from 'vant'
import { Popup, Picker, DatetimePicker, Toast, Collapse, CollapseItem } from 'vant'
import moment from 'moment'
/* global plus*/
export default {
    name: 'businessTravel',
    components: {
        [Cell.name]: Cell,
        [Field.name]: Field,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Button.name]: Button,
        [DatetimePicker.name]: DatetimePicker,
        [Toast.name]: Toast,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        bimHeader
    },
    data() {
        return {
            activeNames: ['1', '2'],
            formInfo: {},
            travelTypeOptions: [],
            showType: false, // 选择出差类型
            showTime: false,
            showApprover: false,
            showApprove: getUserInfo().hasLeading, // 显示审批流程 及提交按钮
            approverOptions: [],
            currentDate: new Date(),
            minTime: new Date(2018, 0, 1),
            maxTime: new Date(2028, 0, 1),
            timePickType: '',
            leaderObj: {},
            travelType: '',
            createDt: '',
            approveInfoValue: '',
            showList: false
        }
    },
    created() {
        this.travelTypeOptions = Object.values(getMappingCfg()['WorkFlow.Personnel.BusinessTravel.Type'])
        const self = plus.webview.currentWebview()
        const data = self.detailObj
        this.init(data)
    },
    methods: {
        // 初始化
        async init(data) {
            try {
                plus.nativeUI.showWaiting()
                if (data) {
                    this.showList = false
                    this.formInfo = data
                    const option = this.travelTypeOptions.find(v => v.key === this.formInfo.type)
                    this.travelType = option.value
                    this.createDt = moment(this.formInfo.createDt).format('YYYY-MM-DD')
                    this.formInfo.beginDt = moment(this.formInfo.beginDt).format('YYYY-MM-DD')
                    this.formInfo.endDt = moment(this.formInfo.endDt).format('YYYY-MM-DD')
                } else {
                    this.showList = true
                    const res = await travelInit()
                    this.formInfo = res
                    this.formInfo.type = this.travelTypeOptions.length > 0 ? this.travelTypeOptions[0].key : null
                    this.travelType = this.travelTypeOptions.length > 0 ? this.travelTypeOptions[0].value : ''
                    this.createDt = moment(res.createDt).format('YYYY-MM-DD')
                    this.formInfo.beginDt = ''
                    this.formInfo.endDt = ''
                    this.formInfo.days = 0
                    this.formInfo.currentApprover = {}
                }
                if (!this.formInfo.approveInfo) {
                    const message = this.formInfo.leaderPublish ? '未设置分管领导无法发起出差申请' : '未设置部门负责人无法发起出差申请'
                    plus.nativeUI.toast(message)
                }
                if (this.showApprove) { // 领导班子不能发起
                    plus.nativeUI.toast('领导班子成员无法发起出差申请')
                }
                this.approveInfoValue = this.formInfo.approveInfo[0].name
                this.leaderObj = this.formInfo.approveInfo[0]
            } catch (e) {
                plus.nativeUI.toast(e && e.message) // eslint-disable-line
                this.showApprove = false
            } finally {
                plus.nativeUI.closeWaiting() // eslint-disable-line
            }
        },
        /** 确认选择类型 */
        onConfirm(value, index) {
            this.showType = false
            this.formInfo.type = this.travelTypeOptions[index].key
            this.travelType = this.travelTypeOptions[index].value
        },
        /** 确认选择时间 */
        onConfirmTime(value, index) {
            if (this.timePickType === 'start') {
                this.formInfo.beginDt = moment(value).format('YYYY-MM-DD')
            } else {
                this.formInfo.endDt = moment(value).format('YYYY-MM-DD')
            }
            const days = this.getDays()
            if (days && days < 0) {
                this.formInfo.endDt = ''
            } else {
                if (days) {
                    this.formInfo.days = days
                    // 验证时间区域
                    this.dateChanged(moment(this.formInfo.beginDt).valueOf(), moment(this.formInfo.endDt).valueOf())
                } else {
                    this.formInfo.days = 0
                }
            }
            this.showTime = false
        },
        setTime(type) {
            if (type === 'start') {
                this.maxTime = (this.formInfo.endDt !== '' && this.formInfo.beginDt === '') ? new Date(moment(this.formInfo.endDt)) : new Date(2028, 0, 1)
                this.currentDate = this.formInfo.beginDt === '' ? new Date() : new Date(moment(this.formInfo.beginDt))
                this.minTime = new Date(2018, 0, 1)
            } else {
                this.minTime = (this.formInfo.endDt === '' && this.formInfo.beginDt !== '') ? new Date(moment(this.formInfo.beginDt)) : new Date(2018, 0, 1)
                this.currentDate = this.formInfo.endDt === '' ? new Date() : new Date(moment(this.formInfo.endDt))
                this.maxTime = new Date(2028, 0, 1)
            }
            this.timePickType = type
            this.showTime = true
        },
        getDays() {
            const start = moment(this.formInfo.beginDt)
            const end = moment(this.formInfo.endDt)
            const days = end.diff(start, 'days') + 1
            return days
        },
        onConfirmApprover(value, index) {
            this.approveInfoValue = value.name
            this.leaderObj = value
            this.showApprover = false
        },
        async submitForm() {
            // 提交数据
            try {
                const valid = this.validate()
                if (valid) {
                    try {
                        if (!this.formInfo.leaderPublish) { //
                            this.formInfo.currentApprover.atUserId = this.formInfo.approveInfo[0].id
                            this.formInfo.currentApprover.atUserOrgId = this.formInfo.approveInfo[0].orgId
                        } else {
                            this.formInfo.currentApprover.atUserId = this.leaderObj.id
                            this.formInfo.currentApprover.atUserOrgId = this.leaderObj.orgId
                        }

                        const params = JSON.parse(JSON.stringify(this.formInfo))
                        params.beginDt = moment(this.formInfo.beginDt).valueOf()
                        params.endDt = moment(this.formInfo.endDt).valueOf()

                        await travelPublish(params)
                        plus.nativeUI.toast(`提审成功`)
                        this.openList()
                    } catch (error) {
                        plus.nativeUI.toast(`提审失败: ${error.message}`)
                        console.warn(`publish`)
                    }
                }
            } catch (error) {
                plus.nativeUI.toast(` ${error.message}`)
            }
        },
        validate() {
            // 验证  出差类型  开始时间  结束时间   出差事由
            if (getUserInfo().hasLeading) { // 领导班子不能发起
                plus.nativeUI.toast('领导班子成员无法发起出差申请')
                return false
            }
            if (!this.formInfo.type) {
                plus.nativeUI.toast('请选择出差类型')
                return false
            } else if (!this.formInfo.beginDt) {
                plus.nativeUI.toast('请选择开始时间')
                return false
            } else if (!this.formInfo.endDt) {
                plus.nativeUI.toast('请选择结束时间')
                return false
            } else if (!(this.formInfo.reason && this.formInfo.reason.trim())) {
                plus.nativeUI.toast('请输入出差事由')
                return false
            }
            return true
        },
        /** 验证时间条件  */
        async dateChanged(beginDt, endDt) {
            try {
                plus.nativeUI.showWaiting()
                const params = {
                    beginDate: beginDt,
                    endDate: endDt,
                    moduleName: 'BusinessTravel'
                }
                if (this.formInfo.id) {
                    params.bizId = this.formInfo.id
                }
                await validateSignFlowDate(params)
            } catch (error) {
                this.formInfo.beginDt = ''
                this.formInfo.endDt = ''
                Toast(`${error.message}`)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        openList() {
            if (!this.showList) {
                const openerWebview = plus.webview.currentWebview().opener()
                fire(openerWebview, 'customEvent')
                plus.webview.close(plus.webview.currentWebview(), 'auto')
            } else {
                openWebview({
                    url: 'businessTravelList.html',
                    id: 'businessTravelList'
                })
            }
        }
    },
    watch: {

    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
.leave-new{
    width: 100%;
    height: 100%;
}
.leave-new-block{
    position: absolute;
    top: 45px;
    bottom: 0px;
    width:100%;
    // overflow:hidden;
}
.busTravel{
    width: 100%;
    height: 100%;
    &-tab {
        width: 100%;
        height: 100%;
    }
    &-container{
        position: absolute;
        width:100%;
        top:0px;
        bottom:40px;
        overflow-y: auto;
    }
}
.submit-button__submit{
    background: $bg10;
    border-color: $bg10;
}
.i-go-list{
    width:46px;
    height:46px;
    font-size:24px;
    text-align: right;
    line-height:46px;
    display:block;
    color: #0072fe;
}
.i-go-list:active{background: #eee;}
</style>
