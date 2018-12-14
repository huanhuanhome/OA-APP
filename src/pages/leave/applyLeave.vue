/*
 * @Author: gl
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-13 14:54:16
 */
/**
|--------------------------------------------------
| 请假申请 {{ leaveInfoObj.leaderApproveInfo[0].name }} icon-sortlight，当年年假天数：{{ leaveInfoObj.leaveTotalNum }}天，未休天数：{{ leaveInfoObj.leaveTotalNum-leaveInfoObj.annualLeaveNum }}天
|--------------------------------------------------
*/
<template>
    <div class="leave-new">
        <bimHeader :title="headTitle" left-arrow @click-right="openWindow('leaveList')">
            <i solt="right" v-if="!isLeader" class="iconfont icon-sortlight i-go-list"></i>
        </bimHeader>

        <div class="leave-new-block">
            <van-tabs v-model="active" class="busTravel-tab pr">
                <van-tab
                    title="请假"
                    class="busTravel-container"
                >
                    <div class="collapse-block" style="padding-top:0px;">
                        <van-collapse v-model="activeNames">
                            <van-collapse-item title="基础信息" name="1">
                                <ul class="g-list-2">
                                    <li><span class="label">姓名：</span>{{ leaveInfoObj.createName }}</li>
                                    <li><span class="label">部门：</span>{{ leaveInfoObj.createOrgName }}</li>
                                    <li><span class="label">职务：</span>{{ positionName }}</li>
                                    <li><span class="label">入职时间：</span>{{ leaveInfoObj.hasOwnProperty('entryDt') ? leaveInfoObj.entryDt : '暂无' }}</li>
                                </ul>
                            </van-collapse-item>
                            <van-collapse-item title="请假类别" name="2">
                                <ul class="g-list-2">
                                    <li v-if="leaveType.name && isStarLeaveDay"><span class="label">请假标题：</span>{{ leaveTitle }}</li>
                                    <li class="required" @click="chooseLeaveType()">
                                        <span class="label">请假类别：</span>
                                        <van-field
                                          v-model="leaveType.name"
                                          placeholder="请选择请假类别"
                                          disabled
                                        />
                                        <i class="iconfont icon-right"></i>
                                    </li>
                                    <li class="nolabel" v-if="leaveType.code === 'AnnualLeave'">已休天数：{{ leaveInfoObj.annualLeaveNum }}天</li>
                                    <li class="required" v-if="leaveType.code === 'OtherLeave'">
                                        <span class="label">请假事由：</span>
                                        <van-field
                                          v-model="leaveAccount"
                                          type="textarea"
                                          placeholder="请输入请假事由"
                                          rows="1"
                                          autosize
                                        />
                                    </li>
                                </ul>
                            </van-collapse-item>
                            <van-collapse-item title="请假期限" name="3">
                                <ul class="g-list-2">
                                    <li class="required" @click="chooseDt('star')">
                                        <span class="label">开始时间：</span>
                                        <van-field
                                            v-model="dateObj.dtStar"
                                            disabled
                                            placeholder="请选择请假开始时间"
                                        />
                                        <i class="iconfont icon-right"></i>
                                    </li>
                                    <li class="required" @click="chooseDt('end')">
                                        <span class="label">结束时间：</span>
                                        <van-field
                                            v-model="dateObj.dtEnd"
                                            disabled
                                            placeholder="请选择请假结束时间"
                                        />
                                        <i class="iconfont icon-right"></i>
                                    </li>
                                    <li class="nolabel" v-if="isLeaveDay">累计有效天数：<b>{{ leaveDay }}</b>天</li>
                                </ul>
                            </van-collapse-item>

                            <van-collapse-item title="附件信息" name="4"
                            v-if="leaveType.code === 'SickLeave' ||
                                  leaveType.code === 'MarriageLeave'||
                                  leaveType.code === 'MaternityLeave'
                                ">
                                <bimMedia :files="fileList" upload></bimMedia>
                            </van-collapse-item>

                            <van-collapse-item title="审批流程" name="5">
                                <ul class="g-list-2 g-list-2--span90" v-if="leaveInfoObj.leaderPublish">
                                    <li class="required" @click="chooseLeader('fg')">
                                        <span class="label">分管领导:</span>
                                        <van-field
                                            v-model="leaderObj.name"
                                            disabled
                                            placeholder="请选择部门分管领导"
                                        />
                                        <i class="iconfont icon-right"></i>
                                    </li>
                                    <li class="required" @click="chooseLeader('dsz')">
                                        <span class="label">董事长/总经理:</span>
                                        <van-field
                                            v-model="dszObj.name"
                                            type="textarea"
                                            placeholder="请选择董事长/总经理"
                                            disabled
                                            rows="1"
                                            autosize
                                        />
                                        <i class="iconfont icon-right"></i>
                                    </li>
                                </ul>
                                <ul class="g-list-2" v-else>
                                    <li>
                                        <span class="label">主管领导：</span>
                                        <van-field
                                            v-model="leaveInfoObj.leaderApproveInfo[0].name"
                                            disabled
                                        />
                                    </li>
                                    <li class="required" @click="chooseLeader('fg')">
                                        <span class="label">分管领导：</span>
                                        <van-field
                                            v-model="leaderObj.name"
                                            type="textarea"
                                            placeholder="请选择分管领导"
                                            disabled
                                            rows="1"
                                            autosize
                                        />
                                        <i class="iconfont icon-right"></i>
                                    </li>
                                </ul>
                            </van-collapse-item>
                        </van-collapse>
                        <div class="collapse-block__operation" v-if="!isLeader">
                            <div class="submit-button plr15 pt20 pb20">
                                <van-button type="primary" size="large" class="submit-button__submit mb10" @click="applyLeaveData()">
                                    提交
                                </van-button>
                            </div>
                        </div>
                    </div>
                </van-tab>
                
                <van-tab
                    title="销假"
                    class="busTravel-container"
                >
                    <div class="collapse-block" style="padding-top:0px;">
                        <van-collapse v-model="applyCancelLeaveActiveNames">
                            <van-collapse-item title="基础信息" name="1">
                                <ul class="g-list-2">
                                    <li><span class="label">姓名：</span>{{ cancelLeaveInfoObj.createName }}</li>
                                    <li><span class="label">部门：</span>{{ cancelLeaveInfoObj.createOrgName }}</li>
                                    <li><span class="label">职务：</span>{{ positionName }}</li>
                                    <li><span class="label">入职时间：</span>{{ cancelLeaveInfoObj.hasOwnProperty('entryDt') ? cancelLeaveInfoObj.entryDt : '暂无' }}</li>
                                </ul>
                            </van-collapse-item>
                            <van-collapse-item title="销假信息" name="2">
                                <ul class="g-list-2 g-list-2--span90">
                                    <li class="required" @click="chooseCancelLeaveVoucher()">
                                        <span class="label">请假申请单：</span>
                                        <van-field
                                            v-model="cancelLeaveVoucher.name"
                                            disabled
                                            placeholder="请选择假申请单"
                                        />
                                        <i class="iconfont icon-right"></i>
                                    </li>
                                    <template v-if="cancelLeaveVoucher.hasOwnProperty('name')">
                                        <li><span class="label">请假类型：</span>{{ cancelLeaveVoucher.leaveTypeChinese }}</li>
                                        <li><span class="label">请假开始时间：</span>{{ cancelLeaveVoucher.leaveStartDt | dateTimeFarmat }}</li>
                                        <li><span class="label">请假结束时间：</span>{{ cancelLeaveVoucher.leaveEndDt | dateTimeFarmat }}</li>
                                        <li class="required" @click="chooseDt('cancelStar')">
                                            <span class="label">销假开始时间：</span>
                                            <van-field
                                                v-model="cancelLeaveDateObj.dtStar"
                                                disabled
                                                placeholder="请选择销假开始时间"
                                            />
                                            <i class="iconfont icon-right"></i>
                                        </li>
                                        <li class="required" @click="chooseDt('cancelEnd')">
                                            <span class="label">销假结束时间：</span>
                                            <van-field
                                                v-model="cancelLeaveDateObj.dtEnd"
                                                disabled
                                                placeholder="请选择销假结束时间"
                                            />
                                            <i class="iconfont icon-right"></i>
                                        </li>
                                        <li>
                                            <span class="label">销假说明：</span>
                                            <van-field
                                                v-model="cancelleaveAccount"
                                                placeholder="请输入50字以内文字描述"
                                                type="textarea"
                                                rows="1"
                                                autosize
                                            />
                                        </li>
                                    </template>
                                </ul>
                            </van-collapse-item>
                            <van-collapse-item title="审批流程" name="3">
                                <ul class="g-list-2 g-list-2--span90">
                                    <template v-if="cancelLeaveInfoObj.leaderPublish">
                                        <li class="required" @click="chooseLeader('cll')">
                                            <span class="label">部门分管领导：</span>
                                            <van-field
                                                v-model="cancelLeaveFgObj.name"
                                                disabled
                                                placeholder="请选择部门分管领导"
                                            />
                                            <i class="iconfont icon-right"></i>
                                        </li>
                                    </template>
                                    <template v-else>
                                        <li><span class="label">部门主管领导：</span>{{ cancelZgLeave }}</li>
                                    </template>
                                </ul>
                            </van-collapse-item>
                        </van-collapse>
                        <div class="collapse-block__operation" v-if="!isLeader">
                            <div class="submit-button plr15 pt20 pb20">
                                <van-button type="primary" size="large" class="submit-button__submit mb10" @click="applyCancelLeaveData()">
                                    提交
                                </van-button>
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>

        <van-popup v-model="popObj.isShow" position="bottom">
            <van-picker
                value-key="name"
                show-toolbar
                :columns="popObj.asActions"
                @cancel="popObj.isShow = false"
                @confirm="onSelect"
            />
        </van-popup>
        <van-popup v-model="popObj.isShowDate" position="bottom">
            <van-datetime-picker
                v-model="currentDate"
                type="date"
                :min-date="minDate"
                :max-date="maxDate"
                @cancel="popObj.isShowDate=false"
                @confirm="chooseDate"
            />
        </van-popup>
    </div>
</template>
<script>
import { leaveInit, getUseLeavefulDays, leavePublish, cancelLeaveInit, cancelLeavePublish, validateCancelDate } from '@/api/workflow'
import moment from 'moment'
import { parseTime } from '@/common/utils.js'
import bimHeader from '@/component/bimHeader/bimHeader'
import bimMedia from '@/component/bimMedia/bimMedia.vue'
import { getUserInfo, getMappingCfg } from '@/common/app'
import { openWebview } from '@/utils/webview'
import { fire } from '@/utils/envent.js'
import { Tab, Tabs, Collapse, CollapseItem, Button, Field, Popup, Picker, DatetimePicker } from 'vant'

export default {
    components: {
        bimHeader,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Button.name]: Button,
        [Field.name]: Field,
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [DatetimePicker.name]: DatetimePicker,
        bimMedia
    },
    data() {
        return {
            headTitle: '请假申请',
            mySelf: plus.webview.currentWebview(),
            toDoFirst: 0,
            active: 0,
            activeNames: ['1', '2', '3', '4', '5'],
            applyCancelLeaveActiveNames: ['1', '2', '3'],
            leaveInfoObj: {
                leaderApproveInfo: [
                    {
                        name: ''
                    }
                ]
            },
            positionName: '',
            fileList: [],
            popObj: { //  弹窗信息
                isShow: false,
                isShowDate: false,
                asActions: []
            },
            leaveType: {
                name: '',
                code: ''
            },
            dateObj: {
                dtStar: '',
                dtEnd: ''
            },
            chooseDateType: '',
            responsibleList: [],
            chairmanList: [],
            leaderObj: {
                name: '',
                userId: '',
                orgId: ''
            },
            dszObj: {
                name: '',
                dszUserId: '',
                dszOrgId: ''
            },
            leaveAccount: '',
            currentDate: new Date(),
            minDate: new Date(),
            maxDate: new Date(2050, 10, 1),
            leaveDay: '',
            isLeaveDay: false,
            isStarLeaveDay: false,
            cancelLeaveInfoObj: {},
            cancelLeaveVoucherList: [], //  请假申请单数据
            cancelLeaveVoucher: {}, //  选中请假申请单
            cancelZgLeave: '',
            cancelLeaveFgItem: [], //  请假分管领导数据
            cancelLeaveFgObj: {}, //  请假分管领导数据
            cancelLeaveDateObj: {
                dtStar: '',
                dtEnd: ''
            },
            cancelleaveAccount: '',
            isCancelLeaveDay: false,
            leaveInitNum: 0,
            cancelLeaveInitNum: 0,
            isLeader: false
        }
    },
    filters: {
        dateTimeFarmat(value) {
            return parseTime(value, '{y}-{m}-{d}')
        },
        dateTimeFarmatHIS(value) {
            return parseTime(value, '{y}-{m}-{d} {h}:{i}:{s}')
        }
    },
    created() {
        if (getUserInfo().hasLeading) { // 领导班子不能发起
            this.isLeader = true
            plus.nativeUI.toast('领导班子成员无法发起请假申请')
            return
        }
        this.positionName = getUserInfo().positionName || '暂无'
        if (this.mySelf.detailObj && this.mySelf.detailObj.hasOwnProperty('currentApproverDivision') && this.mySelf.detailObj.currentApproverDivision.moduleType === 'Leave') { // 从请假申请驳回点进
            this.headTitle = '请假申请'
            this.leaveInfoObj = this.mySelf.detailObj
            this.leaveType.name = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][this.leaveInfoObj.leaveType].value
            this.leaveType.code = this.leaveInfoObj.leaveType
            this.dateObj.dtStar = this.leaveInfoObj.details[0].leaveStartDt ? moment(this.leaveInfoObj.details[0].leaveStartDt).format('YYYY-MM-DD') : '暂无'
            this.dateObj.dtEnd = moment(this.leaveInfoObj.details[0].leaveEndDt).format('YYYY-MM-DD')
            this.getLeaveDay()
            this.leaveDay = this.leaveInfoObj.leaveTotalNum
            if (this.leaveType.code === 'SickLeave' ||
                this.leaveType.code === 'MarriageLeave' ||
                this.leaveType.code === 'MaternityLeave') {
                this.fileList = this.leaveInfoObj.fileList
            }
            if (this.leaveInfoObj.hasOwnProperty('divisionLeaderApproveInfo') && this.leaveInfoObj.divisionLeaderApproveInfo && this.leaveInfoObj.divisionLeaderApproveInfo.length > 0) {
                this.responsibleList = this.leaveInfoObj.divisionLeaderApproveInfo.map(v => ({
                    name: v.name,
                    userId: v.id,
                    orgId: v.orgId
                }))
            } else {
                plus.nativeUI.toast('暂无部门分管领导')
            }

            if (this.leaveInfoObj.leaderPublish) {
                if (this.leaveInfoObj.chairmanApproveInfo && this.leaveInfoObj.chairmanApproveInfo.length) {
                    this.chairmanList = this.leaveInfoObj.chairmanApproveInfo.map(v => ({
                        name: v.name,
                        userId: v.id,
                        orgId: v.orgId
                    }))
                } else {
                    plus.nativeUI.toast('暂无董事长或总经理')
                }
            }

            if (this.leaveInfoObj.hasOwnProperty('currentApproverChairman')) { // 董事长总经理
                this.dszObj.name = this.leaveInfoObj.currentApproverChairman.userName
                this.dszObj.dszUserId = this.leaveInfoObj.currentApproverChairman.atUserId
                this.dszObj.dszOrgId = this.leaveInfoObj.currentApproverChairman.atUserOrgId
            }
            if (this.leaveInfoObj.hasOwnProperty('leaveExplanation')) {
                this.leaveAccount = this.leaveInfoObj.leaveExplanation
            }
            this.leaderObj.name = this.leaveInfoObj.currentApproverDivision.userName
            this.leaderObj.userId = this.leaveInfoObj.currentApproverDivision.atUserId
            this.leaderObj.orgId = this.leaveInfoObj.currentApproverDivision.atUserOrgId
        } else if (this.mySelf.detailObj && this.mySelf.detailObj.subject === 'CancelLeave') { //  销假进入
            this.active = 1
            this.headTitle = '销假申请'
            this.cancelLeaveVoucherList = []
            this.cancelLeaveInitNum++
            this.cancelLeaveInfoObj = this.mySelf.detailObj
            this.cancelLeaveVoucher.name = this.cancelLeaveInfoObj.leaveInfo.title
            this.cancelLeaveVoucher.clvId = this.cancelLeaveInfoObj.leaveInfo.id
            this.cancelLeaveVoucher.leaveType = this.cancelLeaveInfoObj.leaveInfo.leaveType
            this.cancelLeaveVoucher.leaveTypeChinese = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][this.cancelLeaveVoucher.leaveType].value
            this.cancelLeaveVoucher.leaveStartDt = this.cancelLeaveInfoObj.leaveInfo.startDt
            this.cancelLeaveVoucher.leaveEndDt = this.cancelLeaveInfoObj.leaveInfo.endDt
            this.cancelleaveAccount = this.cancelLeaveInfoObj.cancelExplanation
            this.cancelLeaveDateObj.dtStar = moment(this.cancelLeaveInfoObj.cancelStartDt).format('YYYY-MM-DD')
            this.cancelLeaveDateObj.dtEnd = moment(this.cancelLeaveInfoObj.cancelEndDt).format('YYYY-MM-DD')
            this.getCancelDay()
            if (this.cancelLeaveInfoObj.leaderPublish) {
                if (this.mySelf.detailObj.hasOwnProperty('divisionLeaderApproveInfo') && this.mySelf.detailObj.divisionLeaderApproveInfo.length > 0) {
                    this.mySelf.detailObj.divisionLeaderApproveInfo.forEach((val) => {
                        this.cancelLeaveFgItem.push({ //  请假分管领导数据
                            name: val.name,
                            userId: val.id,
                            orgId: val.orgId
                        })
                    })
                }
                this.cancelLeaveFgObj.name = this.cancelLeaveInfoObj.currentApprover.userName
                this.cancelLeaveFgObj.clfgUserId = this.cancelLeaveInfoObj.currentApprover.atUserId
                this.cancelLeaveFgObj.clfgOrgId = this.cancelLeaveInfoObj.currentApprover.atUserOrgId
            } else {
                this.cancelZgLeave = this.cancelLeaveInfoObj.leaderApproveInfo[0].name
            }
            if (this.mySelf.detailObj.hasOwnProperty('leaveInfoList') && this.mySelf.detailObj.leaveInfoList.length > 0) {
                this.mySelf.detailObj.leaveInfoList.forEach((val) => {
                    this.cancelLeaveVoucherList.push({
                        name: val.title,
                        clvId: val.id,
                        leaveType: val.leaveType,
                        leaveTypeChinese: getMappingCfg()['WorkFlow.Personnel.Leave.Type'][val.leaveType].value,
                        leaveStartDt: val.details[0].leaveStartDt,
                        leaveEndDt: val.details[0].leaveEndDt
                    })
                })
            }
        } else { // 新发起
            this.init()
        }
    },
    computed: {
        leaveTitle() {
            return this.leaveInfoObj.createName + this.leaveType.name + '申请' + moment(this.dateObj.dtStar).format('YYYY-MM-DD')
        }
    },
    watch: {
        active(newValue) {
            // this.toDoFirst = 0
            if (newValue === 0) {
                this.headTitle = '请假申请'
            } else {
                this.headTitle = '销假申请'
            }
            if (newValue === 1 && this.cancelLeaveInitNum === 0) {
                this.headTitle = '销假申请'
                this.applyCancelLeaveInit()
            }
            if (newValue === 0 && this.leaveInitNum === 0) {
                this.headTitle = '请假申请'
                this.init()
            }
        },
        dateObj: {
            handler(val, oldVal) {
                if (val.dtStar) {
                    this.isStarLeaveDay = true
                } else {
                    this.isStarLeaveDay = false
                }
                if (val.dtEnd && val.dtStar) {
                    if (moment(val.dtEnd) >= moment(val.dtStar)) {
                        this.isLeaveDay = true
                        if (this.mySelf.detailObj && this.toDoFirst === 0) {
                            this.toDoFirst = 1
                        } else {
                            this.getLeaveDay()
                        }
                    } else {
                        this.isLeaveDay = false
                        plus.nativeUI.toast('请假开始时间必须早于结束时间！')
                    }
                }
            },
            deep: true
        },
        cancelLeaveVoucher: {
            handler(val, oldVal) {
                this.cancelleaveAccount = ''
            },
            deep: true
        },
        cancelLeaveDateObj: {
            handler(val, oldVal) {
                if (val.dtEnd && val.dtStar) {
                    if (moment(val.dtEnd) >= moment(val.dtStar)) {
                        if (this.mySelf.detailObj && this.toDoFirst === 0) {
                            this.toDoFirst = 1
                        } else {
                            this.getCancelDay()
                        }
                    } else {
                        plus.nativeUI.toast('销假开始时间必须早于结束时间！')
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        init() {
            leaveInit()
                .then(res => {
                    if (res) {
                        this.leaveInitNum++
                        this.leaveInfoObj = res
                        if (res.divisionLeaderApproveInfo && res.divisionLeaderApproveInfo.length) {
                            this.responsibleList = res.divisionLeaderApproveInfo.map(v => ({
                                name: v.name,
                                userId: v.id,
                                orgId: v.orgId
                            }))
                        } else {
                            plus.nativeUI.toast('暂无部门分管领导')
                        }

                        if (res.leaderPublish) {
                            if (res.chairmanApproveInfo && res.chairmanApproveInfo.length) {
                                this.chairmanList = res.chairmanApproveInfo.map(v => ({
                                    name: v.name,
                                    userId: v.id,
                                    orgId: v.orgId
                                }))
                            } else {
                                plus.nativeUI.toast('暂无董事长或总经理')
                            }
                        }
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        applyCancelLeaveInit() {
            cancelLeaveInit()
                .then(res => {
                    if (res) {
                        this.cancelLeaveVoucherList = []
                        this.cancelLeaveInitNum++
                        this.cancelLeaveInfoObj = res
                        if (this.cancelLeaveInfoObj.leaderPublish) {
                            if (res.hasOwnProperty('divisionLeaderApproveInfo') && res.divisionLeaderApproveInfo.length > 0) {
                                res.divisionLeaderApproveInfo.forEach((val) => {
                                    this.cancelLeaveFgItem.push({ //  请假分管领导数据
                                        name: val.name,
                                        userId: val.id,
                                        orgId: val.orgId
                                    })
                                })
                            }
                        } else {
                            this.cancelZgLeave = this.cancelLeaveInfoObj.leaderApproveInfo[0].name
                        }
                        if (res.hasOwnProperty('leaveInfoList') && res.leaveInfoList.length > 0) {
                            res.leaveInfoList.forEach((val) => {
                                this.cancelLeaveVoucherList.push({
                                    name: val.title,
                                    clvId: val.id,
                                    leaveType: val.leaveType,
                                    leaveTypeChinese: getMappingCfg()['WorkFlow.Personnel.Leave.Type'][val.leaveType].value,
                                    leaveStartDt: val.details[0].leaveStartDt,
                                    leaveEndDt: val.details[0].leaveEndDt
                                })
                            })
                        }
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        getLeaveDay() {
            plus.nativeUI.showWaiting()
            const params = {
                endDate: moment(this.dateObj.dtEnd),
                startDate: moment(this.dateObj.dtStar)
            }
            if (this.mySelf.detailObj) {
                params.bizId = this.mySelf.detailObj.id
            }
            getUseLeavefulDays(params)
                .then(res => {
                    if (res) {
                        this.isLeaveDay = true
                        this.leaveDay = res
                    } else {
                        plus.nativeUI.toast('数据请求失败')
                    }
                })
                .catch(e => {
                    this.isLeaveDay = false
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        getCancelDay() {
            plus.nativeUI.showWaiting()
            const params = {
                endDate: moment(this.cancelLeaveDateObj.dtEnd),
                startDate: moment(this.cancelLeaveDateObj.dtStar),
                leaveType: this.cancelLeaveVoucher.leaveType,
                leaveId: this.cancelLeaveVoucher.clvId
            }
            if (this.mySelf.detailObj) {
                params.bizId = this.mySelf.detailObj.id
            }
            validateCancelDate(params)
                .then(res => {
                    if (res) {
                        this.isCancelLeaveDay = true
                        this.isCancelLeaveDay = res
                    } else {
                        plus.nativeUI.toast('数据请求失败')
                    }
                })
                .catch(e => {
                    this.isCancelLeaveDay = false
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        openWindow(url) {
            openWebview(
                {
                    url: url + '.html',
                    id: url
                }, {}
            )
        },
        chooseLeaveType() { //  选择请假类型
            this.popObj.asActions = []
            // const leaveType = getMappingCfg()['WorkFlow.Personnel.Leave.Type']
            const leaveType = [
                {
                    key: 'BusinessLeave',
                    value: '事假'
                },
                {
                    key: 'SickLeave',
                    value: '病假/工伤假'
                },
                {
                    key: 'AnnualLeave',
                    value: '年休假'
                },
                {
                    key: 'MarriageLeave',
                    value: '婚假'
                },
                {
                    key: 'MaternityLeave',
                    value: '产假/节育假'
                },
                {
                    key: 'ParentalLeave',
                    value: '探亲假'
                },
                {
                    key: 'FuneralLeave',
                    value: '丧假'
                },
                {
                    key: 'OtherLeave',
                    value: '其他假'
                }
            ]
            for (const key in leaveType) {
                this.popObj.asActions.push({ name: leaveType[key].value, code: leaveType[key].key })
            }
            this.popObj.isShow = true
        },
        chooseDt(val) { //  选择请假日期
            this.chooseDateType = val
            if (val === 'cancelStar' || val === 'cancelEnd') {
                const startDate = this.cancelLeaveVoucher.leaveStartDt > (+new Date()) ? this.cancelLeaveVoucher.leaveStartDt : (+new Date())
                this.currentDate = new Date(startDate)
                this.minDate = new Date(startDate) // 2018-08-19
                this.maxDate = new Date(this.cancelLeaveVoucher.leaveEndDt) // 2018-08-19
            } else {
                this.currentDate = new Date()
                this.minDate = new Date()
                this.maxDate = new Date(2050, 10, 1)
            }
            this.popObj.isShowDate = true
        },
        chooseLeader(val) { //  选择分管领导或者董事长
            this.popObj.asActions = []
            switch (val) {
                case 'fg': // 分管领导
                    this.responsibleList.forEach((key) => {
                        this.popObj.asActions.push({ name: key.name, userId: key.userId, orgId: key.orgId })
                    })
                    break
                case 'dsz': // 董事长钟经理
                    this.chairmanList.forEach((key) => {
                        this.popObj.asActions.push({ name: key.name, dszUserId: key.userId, dszOrgId: key.orgId })
                    })
                    break
                case 'cll': //  销假审核领导
                    this.cancelLeaveFgItem.forEach((key) => {
                        this.popObj.asActions.push({ name: key.name, clfgUserId: key.userId, clfgOrgId: key.orgId })
                    })
                    break
                default:
                    console.log('领导暂时无法获取')
            }
            this.popObj.isShow = true
        },
        onSelect(item) {
            if (item.hasOwnProperty('code')) { //  请假类别
                this.leaveType.name = item.name
                this.leaveType.code = item.code
            }
            if (item.hasOwnProperty('userId')) { //  分管领导
                this.leaderObj.name = item.name
                this.leaderObj.userId = item.userId
                this.leaderObj.orgId = item.orgId
            }
            if (item.hasOwnProperty('dszUserId')) { //  董事长总经理
                this.dszObj.name = item.name
                this.dszObj.dszUserId = item.dszUserId
                this.dszObj.dszOrgId = item.dszOrgId
            }
            if (item.hasOwnProperty('clvId')) { // 选择请假申请单
                this.cancelLeaveVoucher = item
                this.cancelLeaveDateObj.dtStar = ''
                this.cancelLeaveDateObj.dtEnd = ''
            }
            if (item.hasOwnProperty('clfgUserId')) { //  销假领导
                this.cancelLeaveFgObj.name = item.name
                this.cancelLeaveFgObj.clfgUserId = item.clfgUserId
                this.cancelLeaveFgObj.clfgOrgId = item.clfgOrgId
            }
            this.popObj.isShow = false
        },
        chooseDate(val) { // cancelStar cancelEnd
            switch (this.chooseDateType) {
                case 'star':
                    this.dateObj.dtStar = moment(val).format('YYYY-MM-DD')
                    break
                case 'end':
                    this.dateObj.dtEnd = moment(val).format('YYYY-MM-DD')
                    break
                case 'cancelStar':
                    this.cancelLeaveDateObj.dtStar = moment(val).format('YYYY-MM-DD')
                    break
                case 'cancelEnd':
                    this.cancelLeaveDateObj.dtEnd = moment(val).format('YYYY-MM-DD')
                    break
                default:
                    console.log('时间暂时无法获取')
            }
            this.popObj.isShowDate = false
        },
        chooseCancelLeaveVoucher() { //  选择请假申请单
            this.popObj.asActions = []
            if (this.cancelLeaveVoucherList.length > 0) {
                this.cancelLeaveVoucherList.forEach((val) => {
                    this.popObj.asActions.push({
                        name: val.name,
                        clvId: val.clvId,
                        leaveType: val.leaveType,
                        leaveTypeChinese: val.leaveTypeChinese,
                        leaveStartDt: val.leaveStartDt,
                        leaveEndDt: val.leaveEndDt
                    })
                })
                this.popObj.isShow = true
            } else {
                plus.nativeUI.toast('对不起，您目前没有请假申请单')
            }
        },
        applyLeaveData() {
            if (getUserInfo().hasLeading) { // 领导班子不能发起
                plus.nativeUI.toast('领导班子成员无法发起请假申请')
                return
            }
            if (!this.leaveType.code) {
                plus.nativeUI.toast('请选择请假类别')
                return
            }
            if (!this.isLeaveDay) {
                plus.nativeUI.toast('请正确选择请假开始和结束时间')
                return
            }
            if (!this.leaderObj.name) {
                plus.nativeUI.toast('请选择部门分管领导')
                return
            }
            if (this.leaveType.code === 'OtherLeave') {
                if (!this.leaveAccount) {
                    plus.nativeUI.toast('请填写请假事由')
                    return
                }
            } else {
                this.leaveAccount = ''
            }
            if (this.leaveInfoObj.leaderPublish) { // 部门负责人
                if (!this.dszObj.name) {
                    plus.nativeUI.toast('请选择董事长或总经理')
                    return
                }
            }
            if (this.leaveType.code === 'SickLeave' ||
                this.leaveType.code === 'MarriageLeave' ||
                this.leaveType.code === 'MaternityLeave') {
                const delFilterNum = this.fileList.filter(val =>
                    val.state !== 'Delete'
                )
                if (delFilterNum.length < 1) {
                    plus.nativeUI.toast('请上传附件资料')
                    return
                }
            }
            this.leaveInfoObj.leaveTotalNum = this.leaveDay
            if (this.mySelf.detailObj && this.mySelf.detailObj.hasOwnProperty('currentApproverDivision') && this.mySelf.detailObj.currentApproverDivision.moduleType === 'Leave') { // 从请假申请驳回点进
                this.leaveInfoObj.details.forEach((key) => {
                    key.leaveStartDt = moment(this.dateObj.dtStar).valueOf()
                    key.leaveEndDt = moment(this.dateObj.dtEnd).valueOf()
                })
            } else {
                this.leaveInfoObj.details = [{
                    leaveStartDt: moment(this.dateObj.dtStar).valueOf(),
                    leaveEndDt: moment(this.dateObj.dtEnd).valueOf()
                }]
            }
            if (this.mySelf.detailObj) { // 驳回重新发起
                // 分管领导
                this.leaveInfoObj.currentApproverDivision.atUserId = this.leaderObj.userId
                this.leaveInfoObj.currentApproverDivision.atUserOrgId = this.leaderObj.orgId
                if (this.leaveInfoObj.leaderPublish) {
                    // 董事长
                    this.leaveInfoObj.currentApproverChairman.atUserId = this.dszObj.dszUserId
                    this.leaveInfoObj.currentApproverChairman.atUserOrgId = this.dszObj.dszOrgId
                } else {
                    // 直属领导
                    this.leaveInfoObj.currentApproverLeader.atUserId = this.leaveInfoObj.leaderApproveInfo[0].id
                    this.leaveInfoObj.currentApproverLeader.atUserOrgId = this.leaveInfoObj.leaderApproveInfo[0].orgId
                }
            } else { // 新发起
                // 分管领导
                this.leaveInfoObj.currentApproverDivision = {
                    atUserId: this.leaderObj.userId,
                    atUserOrgId: this.leaderObj.orgId
                }
                if (this.leaveInfoObj.leaderPublish) {
                    // 董事长
                    this.leaveInfoObj.currentApproverChairman = {
                        atUserId: this.dszObj.dszUserId,
                        atUserOrgId: this.dszObj.dszOrgId
                    }
                } else {
                    // 直属领导
                    this.leaveInfoObj.currentApproverLeader = {
                        atUserId: this.leaveInfoObj.leaderApproveInfo[0].id,
                        atUserOrgId: this.leaveInfoObj.leaderApproveInfo[0].orgId
                    }
                }
            }

            this.leaveInfoObj.leaveType = this.leaveType.code
            this.leaveInfoObj.title = this.leaveTitle
            this.leaveInfoObj.leaveExplanation = this.leaveAccount

            // 病假,婚假,产假  上传附件
            if (this.leaveType.code === 'SickLeave' ||
                this.leaveType.code === 'MarriageLeave' ||
                this.leaveType.code === 'MaternityLeave') {
                this.leaveInfoObj.fileList = this.fileList
            }
            plus.nativeUI.showWaiting()
            leavePublish(this.leaveInfoObj)
                .then(res => {
                    if (res) {
                        const openerWebview = this.mySelf.opener()
                        plus.nativeUI.toast('请假申请提交成功')
                        if (this.mySelf.detailObj) { // 从驳回点进需刷新待办页数据
                            fire(openerWebview, 'customEvent')
                        }
                        this.overrideBack()
                    } else {
                        plus.nativeUI.toast('数据提交失败，请重试')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        applyCancelLeaveData() {
            if (getUserInfo().hasLeading) { // 领导班子不能发起
                plus.nativeUI.toast('领导班子成员无法发起请假申请')
                return
            }
            if (!this.isCancelLeaveDay) {
                plus.nativeUI.toast('销假开始与结束时间不正确，请重新选择')
                return
            }
            if (!this.cancelLeaveVoucher.leaveType) {
                plus.nativeUI.toast('请选择请假类型')
                return
            }
            if (this.cancelLeaveInfoObj.leaderPublish && !this.cancelLeaveFgObj.name) {
                plus.nativeUI.toast('请选择分管领导')
                return
            }
            this.cancelLeaveInfoObj.leaveId = this.cancelLeaveVoucher.clvId
            this.cancelLeaveInfoObj.cancelStartDt = moment(this.cancelLeaveDateObj.dtStar).valueOf()
            this.cancelLeaveInfoObj.cancelEndDt = moment(this.cancelLeaveDateObj.dtEnd).valueOf()
            this.cancelLeaveInfoObj.cancelExplanation = this.cancelleaveAccount

            if (this.cancelLeaveInfoObj.leaderPublish) {
                if (this.mySelf.detailObj) {
                    this.cancelLeaveInfoObj.currentApprover.atUserId = this.cancelLeaveFgObj.clfgUserId
                    this.cancelLeaveInfoObj.currentApprover.atUserOrgId = this.cancelLeaveFgObj.clfgOrgId
                } else {
                    this.cancelLeaveInfoObj.currentApprover = {
                        atUserId: this.cancelLeaveFgObj.clfgUserId,
                        atUserOrgId: this.cancelLeaveFgObj.clfgOrgId
                    }
                }
            } else { // 普通员工
                if (!this.mySelf.detailObj) { // 新发起
                    this.cancelLeaveInfoObj.currentApprover = {
                        atUserId: this.cancelLeaveInfoObj.leaderApproveInfo[0].id,
                        atUserOrgId: this.cancelLeaveInfoObj.leaderApproveInfo[0].orgId
                    }
                }
            }
            cancelLeavePublish(this.cancelLeaveInfoObj)
                .then(res => {
                    if (res) {
                        const openerWebview = this.mySelf.opener()
                        plus.nativeUI.toast('销假申请提交成功')
                        if (this.mySelf.detailObj) { // 从驳回点进需刷新待办页数据
                            fire(openerWebview, 'customEvent')
                        }
                        this.overrideBack()
                    } else {
                        plus.nativeUI.toast('数据提交失败，请重试')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        overrideBack() {
            plus.webview.close(this.mySelf, 'auto')
        }
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
    overflow:hidden;
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
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
    }
}
.submit-button__submit{
    background: $bg10;
    border-color: $bg10;
}
.leave-new .i-go-list{
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