/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-14 18:01:48
 */
/**
|--------------------------------------------------
| 任务流,补卡审批页
|--------------------------------------------------
*/
<template>
    <div class="approve-mend-clock">
        <bimHeader title="补卡审批" left-arrow></bimHeader>
        
        <div class="collapse-block">
            <van-collapse v-model="activeNames">
                <van-collapse-item title="基础信息" name="1">
                    <ul class="g-list-2">
                      <li><span class="label">姓名：</span>{{ mendClockObj.createName }}</li>
                      <li><span class="label">部门：</span>{{ mendClockObj.createOrgName }}</li>
                    </ul>
                </van-collapse-item>
                <van-collapse-item title="补卡信息" name="2">
                    <ul class="g-list-2 g-list-2--span90" v-for="(item, index) in mendClockItem"  :key="item.id">
                        <li><span class="label">序号：</span>{{ index+1 }}</li>
                        <li><span class="label">日期：</span>{{ item.signDate | dateTimeFormat }}</li>
                        <li v-if="item.hasOwnProperty('signInDate')"><span class="label">签到时间：</span>{{ item.signInDate | dateTimeFormat }}</li>
                        <li v-else><span class="label">签到时间(补)：</span>缺卡</li>
                        <li v-if="item.hasOwnProperty('signOutDate')"><span class="label">签退时间：</span>{{ item.signOutDate | dateTimeFormat }}</li>
                        <li v-else><span class="label">签退时间(补)：</span>缺卡</li>
                        <li><span class="label">补卡事由：</span>{{ reasonMapCfg[item.reasonKey] }} ({{ item.desc }})</li>
                    </ul>
                </van-collapse-item>
                <template v-if="mendClockObj.hasOwnProperty('approveInfo')">
                    <van-collapse-item title="审批流程" name="3">
                        <ul class="g-list-2 g-list-2--span90">
                            <li v-if="mendClockObj.leaderPublish"><span class="label">分管领导：</span>{{ approveInfo.name }}</li>
                            <li v-else><span class="label">部门负责人：</span>{{ approveInfo.name }}</li>
                        </ul>
                    </van-collapse-item>
                </template>
                <van-collapse-item title="审批" name="4">
                    <div class="i-textarea-block">
                      <van-field
                        v-model="opinionText"
                        type="textarea"
                        placeholder="请输入审批意见"
                        rows="1"
                        autosize
                      />
                      <span class="i-textarea-block__tools" @click="chooseOpinion()">
                          <i class="iconfont icon-community"></i>
                          快捷意见
                      </span>
                  </div>
                </van-collapse-item>
            </van-collapse>
            <div class="collapse-block__operation">
                <div class="submit-button plr15 pt20 pb20">
                  <van-button type="primary" size="large" class="submit-button__submit mb10" @click="handleApprove(true)">
                      通过
                  </van-button>
                  <van-button type="default" size="large" class="submit-button__cancel" @click="handleApprove(false)">
                      驳回
                  </van-button>
              </div>
            </div>
        </div>

        <van-actionsheet
            v-model="opinionShow"
            :actions="opinionActions"
            @select="onSelect"
        />
    </div>
</template>

<script>
import bimHeader from '@/component/bimHeader/bimHeader'
import bimHeaderMyInfo from '@/component/bimHeaderMyInfo/bimHeaderMyInfo'
import {Collapse, CollapseItem, Button, Field, Actionsheet } from 'vant'
import { approve } from '@/api/workflow'
import { fire } from "@/utils/envent.js";
import { dateTimeFormatCustom, parseTime, handleMapCfgToObj } from '@/common/utils'
export default {
    components: {
        [Button.name]: Button,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Field.name]: Field,
        [Actionsheet.name]: Actionsheet,
        bimHeader
    },
    data() {
        return {
            mySelf: plus.webview.currentWebview(),
            activeNames: ['1', '2', '3', '4'],
            mendClockObj: {},
            mendClockItem: [], // 列表数组
            approveInfo: {}, // 审批人信息
            opinionText: "",
            opinionShow: false,
            opinionActions: [
                {name: '同意'},
                {name: '拟办'},
                {name: '收到'},
            ],
            reasonMapCfg: handleMapCfgToObj('WorkFlow.Personnel.MendClock.Reasons')
        }
    },
    created() {
        this.mendClockObj = this.mySelf.detailObj
        if(this.mendClockObj.hasOwnProperty('details') && this.mendClockObj.details.length > 0){
            this.mendClockItem = []
            this.mendClockObj.details.forEach((val) => {
                this.mendClockItem.push(val)
            })
        }
        this.approveInfo = this.mySelf.approveInfo && this.mySelf.approveInfo[0] || {}
    },
    filters: {
        dateTimeFormat: dateTimeFormatCustom('YYYY-MM-DD'),
        dateTimeFarmatHI(value) {
            return parseTime(value, '{y}-{m}-{d} {h}:{i}')
        },
    },
    methods: {
        chooseOpinion() {
            this.opinionShow = true
        },
        onSelect(item) {
            this.opinionText = item.name
            this.opinionShow = false
        },
        handleApprove(data) {
            this.mendClockObj.opinion = {}
            this.mendClockObj.opinion.opinion = this.opinionText
            this.mendClockObj.opinion.agree = data
            plus.nativeUI.showWaiting() // eslint-disable-line
            approve(this.mendClockObj)
                .then(res => {
                    plus.nativeUI.toast('提交成功') // eslint-disable-line
                    let openerWebview = this.mySelf.opener()
                    plus.nativeUI.toast('数据处理成功')
                    fire(openerWebview, "customEvent");
                    this.overrideBack()
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast( e && e.message) // eslint-disable-line
                })
                .finally(() => { plus.nativeUI.closeWaiting() }) // eslint-disable-line
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
.approve-mend-clock{
    width: 100%;
    height: 100%;
}
.collapse-block{
    padding-top: 45px;
}
.submit-button__submit{
    background: $bg10;
    border-color: $bg10;
}
</style>