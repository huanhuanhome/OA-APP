/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-30 16:36:51
 */
/**
|--------------------------------------------------
| 外出申请
|--------------------------------------------------
*/
<template>
    <div class="goout">
        <bimHeader title="外出申请" left-arrow @click-right="onClickRight">
            <i class="iconfont icon-sortlight i-go-list" v-if="!todolist&&!hasLeading"></i><!-- 从待办进入和领导都不能查看列表页 -->
        </bimHeader>

        <div class="collapse-block">
            <van-collapse v-model="activeNames">
                <van-collapse-item title="基础信息" name="1">
                    <ul class="g-list-2">
                        <li><span class="label">姓名：</span>{{ infoForm.createName }}</li>
                        <li><span class="label">部门：</span>{{ infoForm.createOrgName }}</li>
                    </ul>
                </van-collapse-item>
                <van-collapse-item title="外出信息" name="2">
                    <ul class="g-list-2">
                        <li class="required" @click="show('startDatePicker')">
                            <span class="label">开始日期：</span>
                            <van-field 
                                v-model="outingStartDate"
                                disabled 
                                placeholder="请选择外出开始日期"
                            />
                            <i class="iconfont icon-right"></i>
                        </li>
                        <li class="required" @click="show('startTimePicker')">
                            <span class="label">开始时间：</span>
                            <van-field 
                                v-model="outingStartTime"
                                disabled 
                                placeholder="请选择外出开始时间"
                                class="content-color"
                            />
                            <i class="iconfont icon-right"></i>
                        </li>
                        <li class="required" @click="show('endDatePicker')">
                            <span class="label">结束日期：</span>
                            <van-field 
                                v-model="outingEndDate"
                                disabled 
                                placeholder="请选择外出结束日期"
                                class="content-color"
                            />
                            <i class="iconfont icon-right"></i>
                        </li>
                        <li class="required" @click="show('endTimePicker')">
                            <span class="label">结束时间：</span>
                            <van-field 
                                v-model="outingEndTime"
                                disabled 
                                placeholder="请选择外出结束时间"
                                class="content-color"
                            />
                            <i class="iconfont icon-right"></i>
                        </li>
                        <li class="required" ><span class="label">外出事由：</span>
                            <van-field
                                v-model="infoForm.outingCause"
                                type="textarea"
                                placeholder="请输入外出事由"
                                class="content-color"
                                rows="1"
                                autosize
                            />
                        </li>
                        <li class="nolabel">{{infoForm.cumulativeLength}}累计有效时长：{{infoForm.cumulativeLength?infoForm.cumulativeLength:"0"}} 小时</li>
                    </ul>
                </van-collapse-item>
                <!-- 附件信息 -->
                <van-collapse-item title="附件信息" name="3" v-if="!hasLeading">
                    <bimMedia :files="infoForm.fileList" upload></bimMedia>
                </van-collapse-item>

                <van-collapse-item title="审批流程" name="4" v-if="!hasLeading && approveList && approveList.length > 0">
                    <ul class="g-list-2">
                        <li class="required" v-if="hasOrgResponsibleUser" @click="selectApprovePer">
                            <span class="label">分管领导：</span>
                            <van-field 
                                v-model ="infoForm.approveInfo.name"
                                disabled
                                placeholder="请选择用户名" 
                                class="content-color"
                            />
                            <i class="iconfont icon-right"></i>
                        </li>
                        <li class="required indent20" v-else>
                            <span class="label">部门负责人</span>
                            <span class="content-color">{{infoForm.approveInfo.name || '暂无部门负责人' }}</span>
                        </li>
                    </ul>
                </van-collapse-item>
            </van-collapse>
            <div class="collapse-block__operation" v-if="!hasLeading">
                <div class="submit-button plr15 pt20 pb20">
                    <van-button type="primary" size="large" class="submit-button__submit mb10" @click="submit">
                        提交
                    </van-button>
                </div>
            </div>
        </div>
        <!-- 开始日期 -->
        <van-popup v-model="startDatePicker" position="bottom">
            <van-datetime-picker
                v-model="startCurrentDate"
                type="date"
                @confirm="selcetStartTime"
                @cancel="cancel('startDatePicker')"
                :min-date="minStartCurrentDate"
            />
        </van-popup>
        <!-- 开始时间 -->
        <van-popup v-model="startTimePicker" position="bottom">
            <van-picker
                v-model="outingStartTime"
                show-toolbar
                ref="startTime"
                :columns="outingOptionArr"
                @cancel="cancel('startTimePicker')"
                @confirm="selcetStartTime"/>
        </van-popup>
        <!-- 结束日期 -->
        <van-popup v-model="endDatePicker" position="bottom">
            <van-datetime-picker
                v-model="endCurrentDate"
                type="date"
                @confirm="selcetEndTime"
                @cancel="cancel('endDatePicker')"
                :min-date="minEndCurrentDate"
            />
        </van-popup>
        <!-- 结束时间 -->
        <van-popup v-model="endTimePicker" position="bottom">
            <van-picker
                v-model="endCurrentTime"
                show-toolbar
                ref="endTime"
                :columns="outingOptionArr"
                @cancel="cancel('endTimePicker')"
                @confirm="selcetEndTime"/>
        </van-popup>
        <!-- 选择人 -->
        <van-popup v-model="approvePerPicker" position="bottom">
            <van-picker 
                show-toolbar 
                :columns="approveList"
                value-key="name" 
                @confirm="approvePerConfirm"
                @cancel="cancel('approvePerPicker')"
            />
        </van-popup>
    </div>
</template>

<script>
import { Icon, Field, DatetimePicker, Button, Checkbox, CheckboxGroup, Picker, Popup, Collapse, CollapseItem } from 'vant'
import { outingPublish, getUsefulDays } from '@/api/workflow'
import { uploadFileAtt } from '@/api/form'
import { getOrgResponsibleUser, getLeadershipRanksUserList } from '@/api/oaUser'
import { getUserInfo } from '@/common/app'
import bimHeader from '@/component/bimHeader/bimHeader'
import { dateTimeFormatCustom } from '@/common/utils'// parseTime typeOf
import { openWebview } from '@/utils/webview'
import moment from 'moment'
import bimMedia from '@/component/bimMedia/bimMedia.vue'
import { fire } from '@/utils/envent.js'
/* global plus*/
export default {
    components: {
        [DatetimePicker.name]: DatetimePicker,
        [CheckboxGroup.name]: CheckboxGroup,
        [Checkbox.name]: Checkbox,
        [Button.name]: Button,
        [Picker.name]: Picker,
        [Popup.name]: Popup,
        [Icon.name]: Icon,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Field.name]: Field,
        bimHeader,
        bimMedia
    },
    created() {
        if (this.cws.detailObj) { // 待办进入
            this.todolist = true
            this.init(this.cws.detailObj)
        } else {
            this.init()
        }
    },
    filters: {
        dateFormat: dateTimeFormatCustom('YYYY-MM-DD'),
        timeFormat: dateTimeFormatCustom('HH:mm')
    },
    data() {
        return {
            cws: plus.webview.currentWebview(),
            todolist: false,
            activeNames: ['1', '2', '3', '4'],
            infoForm: {
                createName: '', // 创建人
                createUserId: '', // id
                createOrgName: '', // 组织名字
                leaderPublish: '', // 领导发布
                republish: '', // 重新发起
                outingStartDate: '', // 外出日期
                outingStartTime: '', // 外出时间
                outingEndDate: '', // 外出日期
                outingEndTime: '', // 外出时间
                outingCause: '', // 外出原因
                fileList: [], // 附件
                approveInfo: {}, // 审批人
                cumulativeLength: 0
            },
            outingStartDate: '', // 外出开始日期  string
            outingEndDate: '', // 外出结束日期  string
            outingStartTime: '', // 开始时间
            outingEndTime: '', // 结束时间
            signInfoEntity: null, // 上下班时间
            // 审批人
            approveList: [],
            // 当前时间
            currentTime: new Date(),
            // 开始时间
            startDatePicker: false,
            startTimePicker: false,
            startCurrentDate: new Date(),
            startCurrentTime: '',
            minStartCurrentDate: new Date(),
            maxStartCurrentDate: '',
            // 结束时间
            endDatePicker: false,
            endTimePicker: false,
            endCurrentDate: new Date(),
            minEndCurrentDate: new Date(),
            endCurrentTime: '',
            pickerType: '',
            // 审批人
            approvePerPicker: false,
            pickerOptions: [],
            startOption: null,
            endOption: null,
            hasOrgResponsibleUser: true,
            hasLeading: false,
            userInfo: getUserInfo()
        }
    },
    computed: {
        columns() {
            return this.pickerOptions.map(item => dateTimeFormatCustom('MM-DD HH:mm')(item))
        },
        startTimestamp() {
            return +new Date(this.outingStartDate.replace(/-/g, '/') + ' ' + this.outingStartTime + ':00')
        },
        endTimestamp() {
            return +new Date(this.outingEndDate.replace(/-/g, '/') + ' ' + this.outingEndTime + ':00')
        },
        outingOptionArr() {
            const outingOptionArr = []
            if (this.userInfo.signInfoEntity) {
                this.signInfoEntity = this.userInfo.signInfoEntity
                const start = this.signInfoEntity.signStartTime.split(':')
                const end = this.signInfoEntity.signEndTime.split(':')
                let starTime = start[0] * 60 + start[1] * 1 // 分单位
                const endTime = end[0] * 60 + end[1] * 1
                while (starTime <= endTime) {
                    outingOptionArr.push(Math.floor(starTime / 60) + ':' + ((starTime % 60) > 10 ? (starTime % 60) : '0' + (starTime % 60)))
                    starTime += 30
                }
            }
            return outingOptionArr
        },
        // 是否是同一天
        isSameDate() {
            return (this.endTimestamp - this.startTimestamp) < (1000 * 60 * 60 * 24)
        }
    },
    methods: {
        // 初始化
        async init(detailData) {
            try {
                plus.nativeUI.showWaiting()
                this.signInfoEntity = this.userInfo.signInfoEntity
                this.hasLeading = this.userInfo.hasLeading
                /** 设置弹出框日期时间  初始化数据 */
                this.setTime()
                if (!detailData) { // 初始化没有值
                    this.infoForm = Object.assign({}, this.infoForm, {
                        createName: this.userInfo.name,
                        createUserId: this.userInfo.id,
                        createOrgName: this.userInfo.mainOrgName,
                        createOrgId: this.userInfo.mainOrgId
                    })
                } else {
                    // 开始结束时间赋值
                    this.outingStartDate = moment(detailData.outingStartDate).format('YYYY-MM-DD')
                    this.outingEndDate = moment(detailData.outingEndDate).format('YYYY-MM-DD')
                    this.outingStartTime = moment(detailData.outingStartDate).format('HH:mm')
                    this.outingEndTime = moment(detailData.outingEndDate).format('HH:mm')

                    this.startCurrentDate = new Date(moment(detailData.outingStartDate))
                    this.endCurrentDate = new Date(moment(detailData.outingEndDate))

                    this.infoForm = Object.assign({}, this.infoForm, detailData)
                }
                /** 获取领导和部门负责人 */
                this.getDirector()
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        // 获取领导和部门负责人
        async getDirector() {
            try {
                plus.nativeUI.showWaiting()
                this.hasOrgResponsibleUser = this.userInfo.hasOrgResponsibleUser
                let appproveList = []
                // 判断是否为普通员工发起
                if (this.hasOrgResponsibleUser) {
                // 获取行政办公室主任
                    appproveList = await getLeadershipRanksUserList()
                    this.approveList = appproveList
                    if (appproveList && appproveList.length > 0) {
                        if (this.infoForm.hisOpinions && this.infoForm.hisOpinions.length > 0) {
                            const id = this.infoForm.hisOpinions[this.infoForm.hisOpinions.length - 1].createUid
                            this.infoForm.approveInfo = this.findInfoById(appproveList, id)
                        } else {
                            this.infoForm.approveInfo = appproveList[0]
                        }
                    }
                } else {
                    // 获取部门负责人
                    appproveList = await this.getResponsibleInfo()
                    appproveList = appproveList.user
                    this.approveList = [appproveList]
                    this.infoForm.approveInfo = appproveList
                }

                if (!this.infoForm.approveInfo) {
                    const message = this.infoForm.leaderPublish ? '当前没有领导可以审批流程，无法发起' : '当前没有部门负责人可以审批流程，无法发起'
                    plus.nativeUI.toast(message)
                }
                if (this.hasLeading) {
                    return plus.nativeUI.toast('领导班子成员无法发起外出申请')
                }
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        findInfoById(list, id) {
            let obj = list[0]
            for (let index = 0; index < list.length; index++) {
                const temp = list[index]
                if (temp.id === id) {
                    obj = temp
                    break
                }
            }
            return obj
        },
        // 获取部门负责人信息
        async getResponsibleInfo() {
            try {
                plus.nativeUI.showWaiting()
                return await getOrgResponsibleUser(this.userInfo.id)
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        // 上传附件
        async onRead(file) {
            try {
                plus.nativeUI.showWaiting()
                const formData = new FormData()
                formData.append('files', file.file)
                const res = await uploadFileAtt(formData)
                this.infoForm.fileList.push(...res)
                plus.nativeUI.closeWaiting()
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            }
        },
        /** 设置选择时间 */
        setTime() {
            /** 开始日期 */
            /** 如果当前时间 大于 下班时间   开始日期选择为明天  否则为当天 */
            if (this.signInfoEntity.signEndTime && this.signInfoEntity.signEndTime <= moment(this.currentTime).format('HH:mm:ss')) {
                this.startCurrentTime = new Date(moment(this.currentTime).add(1, 'days'))
                this.minStartCurrentDate = new Date(moment(this.currentTime).add(1, 'days'))
            } else {
                this.startCurrentTime = new Date()
                this.minStartCurrentDate = new Date()
            }
            /** 结束日期  结束日期为开始日期 */
            this.endCurrentDate = this.startCurrentTime
            this.minEndCurrentDate = this.startCurrentTime
            /** 开始时间 */
            /** 获取当前时间的下一个半点时间段  this.currentTime.getMinutes()*/
            const currentTime = this.currentTime.getMinutes() > 30 ? (this.currentTime.getHours() + 1) + ':00' : (this.currentTime.getHours()) + ':30'
            const signStartTime = this.signInfoEntity.signStartTime.slice(0, 5)
            this.startCurrentTime = signStartTime
            if (currentTime > signStartTime && currentTime < this.signInfoEntity.signEndTime.slice(0, 5)) {
                this.startCurrentTime = currentTime
            }
            /** 结束时间 */
            this.endCurrentTime = this.signInfoEntity.signEndTime.slice(0, 5)
            if (this.outingOptionArr.length > 0) {
                this.endCurrentTime = this.outingOptionArr[this.outingOptionArr.length - 1]
            }
        },
        // 设置选择弹框显示
        show(params) {
            // 未选择开始日期  不能点结束日期
            if (this.outingStartDate === '') {
                if (params === 'endDatePicker' || params === 'startTimePicker' || params === 'endTimePicker') {
                    plus.nativeUI.toast('请先设置开始日期')
                    return
                }
            }
            // 未选择开始时间  不能点结束时间
            if (this.outingStartTime === '') {
                if (params === 'endDatePicker' || params === 'endTimePicker') {
                    plus.nativeUI.toast('请先设置开始时间')
                    return
                }
            }
            this.pickerType = params
            this[params] = true
            this.$nextTick(_ => {
                if (params === 'startTimePicker') {
                    const i = this.outingOptionArr.indexOf(this.startCurrentTime)
                    this.$refs['startTime'].setColumnIndex(0, i < 0 ? 0 : i)
                }
                if (params === 'endTimePicker') {
                    const i = this.outingOptionArr.indexOf(this.endCurrentTime)
                    this.$refs['endTime'].setColumnIndex(0, i < 0 ? 0 : i)
                }
            })
        },
        // 选择开始日期
        selcetStartTime(value, index) {
            if (this.pickerType === 'startDatePicker') {
                // 选择的开始时间
                this.infoForm.outingStartDate = value
                this.endCurrentDate = value
                this.minEndCurrentDate = value
                this.outingStartDate = moment(value).format('YYYY-MM-DD')
                this.cancel('startDatePicker')
            } else {
                this.infoForm.outingStartTime = value
                this.outingStartTime = value

                this.cancel('startTimePicker')
                if (this.startTimestamp < +new Date()) {
                    plus.nativeUI.toast('请选择当前时间之后的时间')
                    this.outingStartTime = ''
                    return
                }
                // 设置结束时间默认选择
                this.endCurrentTime = value
            }
            // 开始时间 日期 时间 结束日期时间 均不为空 校验时间段
            if (this.outingStartDate !== '' && this.outingEndDate !== '' && this.outingStartTime !== '' && this.outingEndTime !== '') {
                const start = this.outingStartDate + ' ' + this.outingStartTime
                const end = this.outingEndDate + ' ' + this.outingEndTime
                this.computeGoOutTime(start, end)
            }
        },
        // 选择结束时间
        selcetEndTime(value, index) {
            if (this.pickerType === 'endDatePicker') {
                this.infoForm.outingEndDate = value
                this.outingEndDate = moment(value).format('YYYY-MM-DD')
                this.cancel('endDatePicker')
            } else {
                this.infoForm.outingEndTime = value
                this.outingEndTime = value
                this.cancel('endTimePicker')
            }
            // 开始时间 日期 时间 结束日期时间 均不为空 校验时间段
            if (this.outingStartDate !== '' && this.outingEndDate !== '' && this.outingStartTime !== '' && this.outingEndTime !== '') {
                // console.log(this.outingStartDate, this.outingEndDate, this.outingStartTime, this.outingEndTime)
                const start = this.outingStartDate + ' ' + this.outingStartTime
                const end = this.outingEndDate + ' ' + this.outingEndTime
                this.computeGoOutTime(start, end)
            }
        },
        // 选择审批人
        selectApprovePer() {
            this.approvePerPicker = true
        },
        // 选择审批人确认
        approvePerConfirm(value, index) {
            this.infoForm.approveInfo = value
            this.approvePerPicker = false
        },
        // 取消
        cancel(params) {
            this[params] = false
        },

        // 校验时间
        async computeGoOutTime(start, end) {
            const totalHour = (this.endTimestamp - this.startTimestamp) / (1000 * 60 * 60)
            if (this.isSameDate && totalHour === 0) {
                this.outingEndTime = ''
                return plus.nativeUI.toast('外出累计时长不能为 0 小时')
            }

            if (this.isSameDate && totalHour < 0) {
                this.outingEndDate = ''
                return plus.nativeUI.toast('开始时间不能大于结束时间')
            }

            if (!Number.isInteger(totalHour)) {
                this.outingEndTime = ''
                return plus.nativeUI.toast('开始时间、结束时间间隔必须为整小时')
            }
            try {
                plus.nativeUI.showWaiting()
                const bizId = this.infoForm.republish ? this.infoForm.id : null
                const validate = await getUsefulDays(start, end, bizId)
                if (validate === 0) {
                    this.outingStartDate = this.outingEndDate = this.outingStartTime = this.outingEndTime = ''
                    plus.nativeUI.toast('外出时间不能为节假日')
                    return
                }
                if (validate != null) {
                    this.infoForm.cumulativeLength = Math.floor(validate / 60)
                } else {
                    this.infoForm.cumulativeLength = null
                }
            } catch (e) {
                console.warn(e)
                this.infoForm.cumulativeLength = null
                plus.nativeUI.toast(e && e.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        async submit() {
            try {
                if (this.outingStartDate === '' || this.outingEndDate === '' || this.outingStartTime === '' || this.outingEndTime === '') {
                    return plus.nativeUI.toast('请选择外出开始结束日期及时间')
                }
                if (!this.infoForm.cumulativeLength) {
                    return plus.nativeUI.toast('外出累计时长不能为 0 小时')
                }
                if (!(this.infoForm.outingCause && this.infoForm.outingCause.trim())) {
                    return plus.nativeUI.toast('请输入外出事由')
                }
                this.infoForm = Object.assign({}, this.infoForm, {
                    outingStartDate: this.startTimestamp,
                    outingEndDate: this.endTimestamp
                })
                // 判断是否是部门负责人发起
                if (!this.infoForm.leaderPublish) {
                    this.infoForm = Object.assign({}, this.infoForm, {
                        moduleAtUserEntity: {
                            atUserId: this.infoForm.approveInfo.id,
                            id: this.cws.detailObj && this.cws.detailObj.moduleAtUserEntity.id
                            // atUserOrgId: this.infoForm.approveInfo.nodeId
                        }
                    })
                } else {
                    this.infoForm = Object.assign({}, this.infoForm, {
                        moduleAtUserEntity: {
                            atUserId: this.infoForm.approveInfo.id,
                            id: this.cws.detailObj && this.cws.detailObj.moduleAtUserEntity.id
                            // atUserOrgId: this.infoForm.approveInfo.orgId
                        }
                    })
                }
                // 上传附件校验
                // if (this.infoForm.fileList.length <= 0) {
                //     return plus.nativeUI.toast('请上传附件资料')
                // }
                plus.nativeUI.showWaiting()
                await outingPublish(this.infoForm)
                plus.nativeUI.closeWaiting()
                plus.nativeUI.toast('已提交')
                // console.
                if (this.todolist) {
                    const openerWebview = plus.webview.currentWebview().opener()
                    fire(openerWebview, 'customEvent')
                    this.cws.close()
                } else {
                    this.onClickRight(true)
                }
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            }
        },
        onClickRight(params) {
            plus.nativeUI.showWaiting()
            openWebview({
                url: 'outingList.html',
                id: 'outingList'
            }, {}, {
                applySuccess: params
            })
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
@import '../../assets/font/iconfont.css';
.goout-list{
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    .goout-listimg{
        display: block;
        height: 20px;
    }
}
.submit-button__submit{
    background: $bg10;
    border-color: $bg10;
}
.goout .i-go-list{
    width:46px;
    height:46px;
    font-size:24px;
    text-align: right;
    line-height:46px;
    display:block;
    color: #0072fe;
}
.goout .i-go-list:active{background: #eee;}


</style>