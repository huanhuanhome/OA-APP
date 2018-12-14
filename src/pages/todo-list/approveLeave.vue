/*
 * @Author: gl
 * @Last Modified by: LG
 * @Last Modified time: 2018-10-10 16:40:46
 */
/**
|--------------------------------------------------
| 请假审批 ，当年年假天数：{{ leaveInfoObj.annualLeaveNum }}天， 未休天数：{{ leaveInfoObj.leaveTotalNum-leaveInfoObj.annualLeaveNum }}天
|--------------------------------------------------
*/
<template>
  <div class="approve">
      <bimHeader title="请假审批" left-arrow/>

      <div class="collapse-block">
          <van-collapse v-model="activeNames">
              <van-collapse-item title="基础信息" name="1">
                  <ul class="g-list-2">
                      <li><span class="label">姓名：</span>{{ leaveInfo.createName }}</li>
                      <li><span class="label">部门：</span>{{ leaveInfo.createOrgName }}</li>
                      <li><span class="label">职务：</span>{{ leaveInfo.positionName || '暂无' }}</li>
                     <li><span class="label">入职时间：</span>暂无</li>
                  </ul>
              </van-collapse-item>
              <van-collapse-item title="请假类别" name="2">
                  <ul class="g-list-2">
                      <li><span class="label">请假类别：</span>{{ leaveInfo.leaveTypeChinese }}</li>
                      <li class="nolabel" v-if="leaveInfo.leaveType === 'AnnualLeave'">已休天数：{{ leaveInfo.annualLeaveNum }}天</li>
                      <li v-if="leaveInfo.leaveType === 'OtherLeave'"><span class="label">请假事由：</span>{{ leaveInfo.leaveExplanation }}</li>
                  </ul>
              </van-collapse-item>
              <van-collapse-item title="请假期限" name="3">
                  <ul class="g-list-2">
                      <li><span class="label">开始时间：</span>{{ leaveInfo.details[0].leaveStartDt | dateTimeFarmat }}</li>
                      <li><span class="label">结束时间：</span>{{ leaveInfo.details[0].leaveEndDt | dateTimeFarmat }}</li>
                      <li><span class="label">共计：</span>{{ leaveInfo.leaveTotalNum }}天</li>
                  </ul>
              </van-collapse-item>
              <!-- <van-collapse-item title="附件" name="4">
                  <ul class="g-list-2">
                      <li class="nolabel">暂无</li>
                  </ul>
              </van-collapse-item> -->
              <van-collapse-item title="附件信息" name="4"
                    v-if="leaveInfo.leaveType === 'SickLeave' ||
                    leaveInfo.leaveType === 'MarriageLeave'||
                    leaveInfo.leaveType === 'MaternityLeave'
               ">
                    <bimMedia :files="leaveInfo.fileList"></bimMedia>
              </van-collapse-item>
              <van-collapse-item title="历史审批记录" name="5">
                  <template v-if="leaveInfo.hasOwnProperty('hisOpinionsFirst') && leaveInfo.hisOpinionsFirst.length > 0">
                        <ul class="g-list-2" v-for="(hisFirstItem, index) in leaveInfo.hisOpinionsFirst" :key="index">
                            <li><span class="label">所属部门：</span>{{ hisFirstItem.createOrgName }}</li>
                            <li><span class="label">审批人：</span>{{ hisFirstItem.createName }}</li>
                            <li><span class="label">审批意见：</span>{{ hisFirstItem.opinion }}</li>
                            <li><span class="label">审批时间：</span>{{ hisFirstItem.createDt | dateTimeFarmatHIS }}</li>
                            <li><span class="label">审批状态：</span>{{ hisFirstItem.agree ? '已通过' : '已驳回' }}</li>
                        </ul>
                    </template>
                    <template v-else>
                        <ul class="g-list-2--nolabel">
                            <li>暂无部门领导审批信息</li>
                        </ul>
                    </template>
                    <template v-if="leaveInfo.hasOwnProperty('hisOpinionsSecond') &&leaveInfo.hisOpinionsSecond.length > 0">
                        <ul class="g-list-2" v-for="(hisSecondItem, index) in leaveInfo.hisOpinionsSecond" :key="index">
                            <li><span class="label">所属部门：</span>{{ hisSecondItem.createOrgName }}</li>
                            <li><span class="label">审批人：</span>{{ hisSecondItem.createName }}</li>
                            <li><span class="label">审批意见：</span>{{ hisSecondItem.opinion }}</li>
                            <li><span class="label">审批时间：</span>{{ hisSecondItem.createDt | dateTimeFarmatHIS }}</li>
                            <li><span class="label">审批状态：</span>{{ hisSecondItem.agree ? '已通过' : '已驳回' }}</li>
                        </ul>
                    </template>
                    <template v-else>
                        <ul class="g-list-2--nolabel">
                            <li>暂无部门分管领导审批信息</li>
                        </ul>
                    </template>
              </van-collapse-item>
              <van-collapse-item title="审批" name="6">
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
                  <van-button type="primary" size="large" class="submit-button__submit mb10" @click="handleLeave(true)">
                      通过
                  </van-button>
                  <van-button type="default" size="large" class="submit-button__cancel" @click="handleLeave(false)">
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
import { leaveApprove } from '@/api/workflow'
import { parseTime } from '@/common/utils.js'
import { fire } from '@/utils/envent.js'
import bimHeader from '@/component/bimHeader/bimHeader'
import bimMedia from '@/component/bimMedia/bimMedia.vue'
import { getUserInfo, getMappingCfg } from '@/common/app'
import { Collapse, CollapseItem, Button, Field, Actionsheet } from 'vant'
/*global plus */
export default {
    components: {
        bimHeader,
        bimMedia,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Button.name]: Button,
        [Field.name]: Field,
        [Actionsheet.name]: Actionsheet
    },
    data() {
        return {
            activeNames: ['1', '6'],
            mySelf: plus.webview.currentWebview(),
            leaveInfo: {},
            positionName: '',
            opinionText: '',
            opinionShow: false,
            opinionActions: [
                { name: '同意' },
                { name: '拟办' },
                { name: '收到' }
            ]
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
        this.positionName = getUserInfo().positionName || '暂无'
        this.leaveInfo = this.mySelf.detailObj
        this.leaveInfo.leaveTypeChinese = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][this.leaveInfo.leaveType].value
    },
    methods: {
        handleLeave(data) { //  审批
            this.leaveInfo.opinion = {}
            this.leaveInfo.opinion.nodeName = this.leaveInfo.currentNodeName
            this.leaveInfo.opinion.opinion = this.opinionText
            this.leaveInfo.opinion.agree = data
            leaveApprove(this.leaveInfo) //  第二级
                .then(res => {
                    if (res) {
                        const openerWebview = this.mySelf.opener()
                        plus.nativeUI.toast('数据处理成功')
                        fire(openerWebview, 'customEvent')
                        this.overrideBack()
                    } else {
                        plus.nativeUI.toast('数据处理失败，请稍后重试')
                    }
                })
                .catch(e => {
                      plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {
                      plus.nativeUI.closeWaiting() // eslint-disable-line
                })
        },
        chooseOpinion() {
            this.opinionShow = true
        },
        onSelect(item) {
            this.opinionText = item.name
            this.opinionShow = false
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
.collapse-block{
    padding-top: 45px;
}
.submit-button__submit{
    background: $bg10;
    border-color: $bg10;
}
</style>