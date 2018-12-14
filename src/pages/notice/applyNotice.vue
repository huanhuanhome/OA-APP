/*
 * @Author: gl
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-11-01 12:01:15
 */
/**
|--------------------------------------------------
| 新建/重新发起通告 ({{ noticeInfo.valueList.toString(',') }}){{ noticeInfo.hasOwnProperty('content')?  : '暂无'
|--------------------------------------------------
*/
<template>
  <div class="approve notice">
      <bimHeader title="新建通知公告" left-arrow  @click-right="openWindow('notice')">
            <i solt="right" class="iconfont icon-sortlight i-go-list"></i>
      </bimHeader>
      <div class="collapse-block">
          <van-collapse v-model="activeNames">
              <van-collapse-item title="基础信息" name="1">
                  <ul class="g-list-2">
                      <li><span class="label">发起人：</span>{{ noticeInfo.createName }}</li>
                      <li><span class="label">部门：</span>{{ noticeInfo.createOrgName }}</li>
                      <li><span class="label">发起时间：</span>{{ noticeInfo.createDt | dateTimeFarmatHIS }}</li>
                      <li class="required" @click="chooseVa('lx')"><span class="label">类型：</span>
                          <van-field
                            v-model="noticeInfo.noticeTypeChinese"
                            placeholder="请选择类型"
                            disabled
                          />
                          <i class="iconfont icon-right"></i>
                      </li>
                      <li class="required" @click="chooseVa('zycd')"><span class="label">重要程度：</span>
                           <van-field
                            v-model="noticeInfo.importanceChinese"
                            placeholder="请选择重要程度"
                            disabled
                          />
                          <i class="iconfont icon-right"></i>
                      </li>
                      <li class="required"><span class="label">标题：</span>
                            <van-field
                                v-model.trim="noticeInfo.title"
                                placeholder="请输入标题"
                            />
                      </li>
                      <li class="required"><span class="label">内容：</span>
                            <van-field
                                v-model.trim="noticeInfo.content"
                                type="textarea"
                                placeholder="请输入内容"
                                rows="2"
                                autosize
                            />
                      </li>
                      <li class="is-van-switch clearfix">
                            <span class="label">是否转发：</span>
                            <van-switch v-model="noticeInfo.hasTranspond" />
                      </li>
                      <li class="required" v-if="noticeInfo.hasTranspond"><span class="label">消息来源：</span>
                            <van-field
                                v-model.trim="noticeInfo.messageSource"
                                placeholder="请输入消息来源"
                            />
                      </li>
                      <li class="required">
                            <span class="label">通知范围：</span>
                            <van-radio-group v-model="noticeInfo.notifyScope" class="clearfix">
                                <van-radio name="NoticeSumOrg">公司</van-radio>
                                <van-radio name="NoticeOrg">部门</van-radio>
                                <van-radio name="NoticeUser">个人</van-radio>
                            </van-radio-group>
                      </li>
                      <li class="no-padding70 required" v-if="isNoticeSumOrg">
                            <div @click="chooseCompany()">
                                <span class="label">选择公司：</span>
                                <van-field
                                    placeholder="请选择公司"
                                    disabled
                                />
                                <i class="iconfont icon-right"></i>
                            </div>
                            <div class="content">
                                {{ departmentName }}
                            </div>
                      </li>
                      <li class="no-padding70 required" v-if="isNoticeOrg">
                            <div @click="chooseOrg()">
                            <span class="label">选择部门：</span>
                            <van-field
                                placeholder="请选择部门"
                                disabled
                            />
                            <i class="iconfont icon-right"></i>
                            </div>
                            <div class="content">
                                {{ orgName }}
                            </div>
                      </li>
                      <li class="no-padding70 required" v-if="isNoticeUser">
                            <div>
                                <span class="label">选择人员：</span>
                                <van-field
                                    disabled
                                />
                            </div>
                            <ul class="person-list clearfix">
                                <li v-for="item in personItems">
                                    <div class="avatar"><img :src="item.avatarUri"/></div>
                                    <p>{{ item.userName }}</p>
                                    <i class="iconfont icon-roundclosefill i-person" @click="removePerson(item)"></i>
                                </li>
                                <li class="add" @click="choosePerson()">
                                    <i class="iconfont icon-add1 i-jia"></i>
                                </li>
                            </ul>
                      </li>
                  </ul>
              </van-collapse-item>
              <van-collapse-item title="上传附件" name="2">
                  <bimMedia :files="noticeInfo.fileList" upload></bimMedia>
              </van-collapse-item>
              <van-collapse-item title="审批流程" name="3">
                  <template v-if="!isDepartmentalLeader">
                        <!-- 通知公告发起,普通员工发起,部门负责人,办公室主任审批,都不需要选择 -->
                        <ul class="g-list-2 g-list-2--span90">
                             <li>
                                <span class="label">部门负责人:</span>
                                <van-field
                                    v-model="noticeInfo.departmentHeadEntity.atUserName"
                                    disabled
                                />
                            </li>
                            <li><!--  @click="chooseVa('xzbgs')" -->
                                <span class="label" style="width:90px;">行政办公室主任:</span>
                                <span style="padding-left:15px;">程炳丽</span>
                                <!-- <van-field v-model="noticeInfo.executiveOfficeEntity.atUserName" disabled placeholder="请选择行政办公室领导" /><i class="iconfont icon-right"></i> -->
                            </li>
                        </ul>
                  </template>
                  <!-- 部门负责人发起,只能行政办公室主任审批 -->
                  <template v-if="isDepartmentalLeader || isOfficeLeader">
                        <ul class="g-list-2 g-list-2--span90">
                            <li><!--  @click="chooseVa('xzbgs')" -->
                                <span class="label" style="width:90px;">行政办公室主任:</span>
                                <span style="padding-left:15px;">程炳丽</span>
                                <!-- <van-field v-model="noticeInfo.executiveOfficeEntity.atUserName" disabled placeholder="请选择行政办公室领导" /><i class="iconfont icon-right"></i> -->
                            </li>
                        </ul>
                  </template>
              </van-collapse-item>
            </van-collapse>
            <div class="collapse-block__operation" v-if="!isLeader">
                <div class="submit-button plr15 pt20 pb20">
                  <van-button type="primary" size="large" class="submit-button__submit mb10" @click="submitNewNotice()">
                      提交
                  </van-button>
              </div>
            </div>
      </div>
      <van-popup v-model="isVaShow" position="bottom">
            <van-picker
                value-key="name"
                show-toolbar
                :columns="vaItems"
                @cancel="isVaShow = false"
                @confirm="onSelect"
            />
      </van-popup>
  </div>
</template>
<script>
// import { approveDepartmentHead, approveExecutiveOffice } from '@/api/workflow'
import { getOrgResponsibleUser, getTaskNodeUserIdListByTaskName } from '@/api/oaUser'
import { publishNotice } from '@/api/workflow'
import { parseTime } from '@/common/utils.js'
import { openWebview } from '@/utils/webview'
import bimHeader from '@/component/bimHeader/bimHeader'
import bimMedia from '@/component/bimMedia/bimMedia.vue'
import { getUserInfo, getMappingCfg } from '@/common/app'
import { Collapse, CollapseItem, Button, Field, Switch, Popup, Picker, RadioGroup, Radio } from 'vant'
/* global plus */
export default {
    components: {
        bimHeader,
        bimMedia,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Button.name]: Button,
        [Field.name]: Field,
        [Switch.name]: Switch,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio
    },
    data() {
        return {
            activeNames: ['1', '2', '3'],
            mySelf: plus.webview.currentWebview(),
            noticeInfo: {
                title: '',
                content: '',
                hasTranspond: false,
                messageSource: '',
                notifyScope: 'NoticeSumOrg',
                fileList: [],
                leaderPublish: false,
                departmentHeadEntity: { // 部门负责人
                    atUserId: '',
                    atUserName: ''
                },
                executiveOfficeEntity: { // 行政办公室
                    atUserId: '',
                    atUserName: ''
                }
            },
            isNoticeSumOrg: true,
            isNoticeOrg: false,
            isNoticeUser: false,
            noticeTypeItems: [],
            importanceItems: [],
            xzbgsLeaderItems: [],
            isVaShow: false,
            vaItems: [],
            personItems: [],
            departmentItems: [],
            departmentName: '暂无',
            orgItems: [],
            orgName: '暂无',
            isLeader: false, // 领导班子成员
            isDepartmentalLeader: false, //  部门领导
            isOfficeLeader: false // 登录人是办公室领导
        }
    },
    filters: {
        dateTimeFarmat(value) {
            return parseTime(value, '{y}-{m}-{d}')
        },
        dateTimeFarmatHIS(value) {
            return parseTime(value, '{y}-{m}-{d} {h}:{i}:{s}')
        },
        filterHtml(val) {
            return val.replace(/<[^>]*>/g, '') //  去除文字的<...></...>标签
        }
    },
    watch: {
        noticeInfo: {
            handler(val, oldVal) {
                this.isNoticeOrg = false
                this.isNoticeUser = false
                this.isNoticeSumOrg = false
                if (val.notifyScope === 'NoticeSumOrg') {
                    this.isNoticeSumOrg = true
                }
                if (val.notifyScope === 'NoticeOrg') {
                    this.isNoticeOrg = true
                }
                if (val.notifyScope === 'NoticeUser') {
                    this.isNoticeUser = true
                }
            },
            deep: true
        }
    },
    created() {
        window.addEventListener('personEvent', event => { // 个人
            this.personItems = event.detail.choosePersons
        })
        window.addEventListener('departmentEvent', event => { // 公司
            this.departmentItems = event.detail.chooseCompanys
            this.departmentName = ''
            if (this.departmentItems.length > 0) {
                this.departmentItems.forEach((val) => {
                    this.departmentName += val.companyName + '， '
                })
                this.departmentName = this.departmentName.substring(0, this.departmentName.length - 2)
            } else {
                this.departmentName = '暂无'
            }
        })
        window.addEventListener('orgEvent', event => { // 部门
            this.orgItems = event.detail.chooseOrgs
            this.orgName = ''
            if (this.orgItems.length > 0) {
                this.orgItems.forEach((val) => {
                    this.orgName += val.orgName + '， '
                })
                this.orgName = this.orgName.substring(0, this.orgName.length - 2)
            } else {
                this.orgName = '暂无'
            }
        })
        if (getUserInfo().hasLeading) { // 领导班子不能发起
            this.isLeader = true
            plus.nativeUI.toast('领导班子成员不能发起通知公告')
            return
        }
        const noticeTypeObj = getMappingCfg()['WorkFlow.Personnel.Announcement.Type']
        for (const key in noticeTypeObj) {
            this.noticeTypeItems.push({
                name: noticeTypeObj[key].value,
                noticeTypeCode: key
            })
        }
        const importanceObj = getMappingCfg()['WorkFlow.Personnel.Announcement.Importance']
        for (const key in importanceObj) {
            this.importanceItems.push({
                name: importanceObj[key].value,
                importanceCode: key
            })
        }
        this.noticeInfo.createUserId = getUserInfo().id
        this.noticeInfo.createName = getUserInfo().name || '暂无'
        this.noticeInfo.createOrgId = getUserInfo().mainOrgId || '暂无'
        this.noticeInfo.createOrgName = getUserInfo().mainOrgName || '暂无'
        this.noticeInfo.createDt = new Date()
        this.init()
    },
    methods: {
        init() {
            getOrgResponsibleUser(this.noticeInfo.createUserId) //  部门负责人
                .then(res => {
                    if (res) {
                        this.isDepartmentalLeader = this.noticeInfo.createUserId === res.user.id
                        this.noticeInfo.departmentHeadEntity.atUserId = res.user.id
                        this.noticeInfo.departmentHeadEntity.atUserName = res.user.name
                    } else {
                        plus.nativeUI.toast('数据请求失败')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
            getTaskNodeUserIdListByTaskName() //  办公室领导
                .then(res => {
                    if (res && res.length > 0) {
                        this.xzbgsLeaderItems = []
                        let isBreak = false
                        res.forEach((val) => {
                            if (this.noticeInfo.createUserId === val.id && !isBreak) {
                                this.isOfficeLeader = true // 办公室领导
                                isBreak = true
                            }
                            this.xzbgsLeaderItems.push({
                                name: val.name,
                                xzbgsAtUserId: val.id
                            })
                        })
                        this.noticeInfo.executiveOfficeEntity.atUserId = this.xzbgsLeaderItems[0].xzbgsAtUserId
                        this.noticeInfo.executiveOfficeEntity.atUserName = this.xzbgsLeaderItems[0].name
                    } else {
                        plus.nativeUI.toast('数据请求失败')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        chooseVa(val) {
            this.vaItems = []
            if (val === 'lx') {
                this.vaItems = [...this.noticeTypeItems]
            }
            if (val === 'zycd') {
                this.vaItems = [...this.importanceItems]
            }
            if (val === 'xzbgs') {
                this.vaItems = [...this.xzbgsLeaderItems]
            }
            this.isVaShow = true
        },
        onSelect(item) {
            if (item.hasOwnProperty('noticeTypeCode')) { //  类型
                this.noticeInfo.noticeTypeChinese = item.name
                this.noticeInfo.noticeType = item.noticeTypeCode
            }
            if (item.hasOwnProperty('importanceCode')) { //  重要程度
                this.noticeInfo.importanceChinese = item.name
                this.noticeInfo.importance = item.importanceCode
            }
            if (item.hasOwnProperty('xzbgsAtUserId')) { //  行政办公室
                this.noticeInfo.executiveOfficeEntity.atUserId = item.xzbgsAtUserId
                this.noticeInfo.executiveOfficeEntity.atUserName = item.name
            }
            this.isVaShow = false
        },
        chooseCompany() {
            openWebview({
                url: 'chooseCompany.html',
                id: 'chooseCompany'
            },
            {},
            {
                companyObj: this.departmentItems
            })
        },
        chooseOrg() {
            openWebview({
                url: 'chooseOrg.html',
                id: 'chooseOrg'
            },
            {},
            {
                orgObj: this.orgItems
            })
        },
        choosePerson() {
            openWebview({
                url: 'choosePerson.html',
                id: 'choosePerson'
            },
            {},
            {
                personObj: this.personItems
            })
        },
        removePerson(item) {
            const choosePersonsIndex = this.personItems.findIndex(val => {
                return val.userId === item.userId
            })
            this.personItems.splice(choosePersonsIndex, 1)
        },
        submitNewNotice() { //  通知公告发起
            if (!this.noticeInfo.noticeType) {
                return plus.nativeUI.toast('请选择类型')
            }
            if (!this.noticeInfo.importance) {
                return plus.nativeUI.toast('请选择重要程度')
            }
            if (!this.noticeInfo.title) {
                return plus.nativeUI.toast('请输入公告标题')
            }
            if (!this.noticeInfo.content) {
                return plus.nativeUI.toast('请输入公告内容')
            } else {
                const length = this.noticeInfo.content.replace(/[\u4e00-\u9fa5]/g, 'aa').length
                if (length > 65535) {
                    return plus.nativeUI.toast('超出最大字数限制')
                }
            }
            if (this.noticeInfo.hasTranspond) { //  转发
                if (this.noticeInfo.messageSource === '') {
                    return plus.nativeUI.toast('请输入消息来源')
                }
            }
            if (this.isNoticeSumOrg) {
                if (this.departmentItems.length < 1) {
                    return plus.nativeUI.toast('请选择公司')
                } else {
                    this.noticeInfo.moduleValueMappings = []
                    this.departmentItems.forEach((val) => {
                        this.noticeInfo.moduleValueMappings.push({
                            value: val.companyId,
                            valueType: 'NoticeSumOrg',
                            backup: val.backup
                        })
                    })
                }
            }
            if (this.isNoticeOrg) {
                if (this.orgItems.length < 1) {
                    return plus.nativeUI.toast('请选择部门')
                } else {
                    this.noticeInfo.moduleValueMappings = []
                    this.orgItems.forEach((val) => {
                        this.noticeInfo.moduleValueMappings.push({
                            value: val.orgId,
                            valueType: 'NoticeOrg',
                            backup: val.backup
                        })
                    })
                }
            }
            if (this.isNoticeUser) {
                if (this.personItems.length < 1) {
                    return plus.nativeUI.toast('请选择人员')
                } else {
                    this.noticeInfo.moduleValueMappings = []
                    this.personItems.forEach(val => {
                        this.noticeInfo.moduleValueMappings.push({
                            value: val.userId,
                            valueType: 'NoticeUser', // 通知类型个人
                            avatarUri: val.avatarUri,
                            backup: val.userName
                        })
                    })
                }
            }
            if (!this.noticeInfo.executiveOfficeEntity) {
                return plus.nativeUI.toast('请选择行政办公室领导')
            }
            this.noticeInfo.leaderPublish = this.isDepartmentalLeader
            // 部门负责人发起,直接是部门负责人审批
            if (this.noticeInfo.leaderPublish) this.noticeInfo.departmentHeadEntity = null
            plus.nativeUI.showWaiting()
            publishNotice(this.noticeInfo)
                .then(res => {
                    if (res) {
                        plus.nativeUI.toast('通知公告提交成功')
                        this.overrideBack()
                    } else {
                        plus.nativeUI.toast('数据处理失败，请稍后重试')
                    }
                })
                .catch(e => {
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
.approve{
    width: 100%;
    height: 100%;
}
.submit-button__submit{
    background: $bg10;
    border-color: $bg10;
}
.notice .i-go-list{
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