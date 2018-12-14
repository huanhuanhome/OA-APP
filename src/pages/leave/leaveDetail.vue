/*
 * @Author: LG
 * @Last Modified by: LG
 * @Last Modified time: 2018-10-10 16:40:02
 */
/**
|--------------------------------------------------
| 请假详情模块 {{ leaveInfo.entryDt | dateTimeFarmatHIS }}
|--------------------------------------------------
*/
<template>
    <div class="leave-detail">
        <bimHeader title="请假详情" left-arrow/>

            <div class="collapse-block">
                <van-collapse v-model="activeNames">
                    <van-collapse-item title="基础信息" name="1">
                        <ul class="g-list-2">
                            <li><span class="label">姓名：</span>{{ leaveInfo.createName }}</li>
                            <li><span class="label">部门：</span>{{ leaveInfo.createOrgName }}</li>
                            <li><span class="label">职务：</span>{{ positionName }}</li>
                            <li><span class="label">入职时间：</span>暂无</li>
                        </ul>
                    </van-collapse-item>
                    <van-collapse-item title="请假类别" name="2">
                        <ul class="g-list-2">
                            <li><span class="label">请假标题：</span>{{ leaveInfo.title }}</li>
                            <li><span class="label">请假类别：</span>{{ leaveInfo.leaveTypeChinese }}</li>
                            <li class="nolabel" v-if="leaveInfo.leaveType === 'AnnualLeave'">已休天数：{{ leaveInfo.annualLeaveNum }}天</li>
                            <li v-if="leaveInfo.leaveType === 'OtherLeave'"><span class="label">请假事由：</span>{{ leaveInfo.leaveExplanation }}</li>
                        </ul>
                    </van-collapse-item>
                    <van-collapse-item title="请假期限" name="3">
                        <ul class="g-list-2">
                            <li><span class="label">开始时间：</span>{{ leaveSDT | dateTimeFarmat }}</li>
                            <li><span class="label">结束时间：</span>{{ leaveEDT | dateTimeFarmat }}</li>
                            <li><span class="label">共计：</span>{{ leaveInfo.leaveTotalNum }}天</li>
                        </ul>
                    </van-collapse-item>
                    <!-- <van-collapse-item title="附件信息" name="4">
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
                    <van-collapse-item title="审批详情" name="5">
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
                </van-collapse>
            </div>
    </div>
</template>
<script>
import { getLeaveDetail, getHisDetail } from '@/api/workflow'
import { parseTime } from '@/common/utils.js'
import bimHeader from '@/component/bimHeader/bimHeader'
import bimMedia from '@/component/bimMedia/bimMedia.vue'
import { getUserInfo, getMappingCfg } from '@/common/app'
import { Collapse, CollapseItem } from 'vant'
export default {
    components: {
        bimHeader,
        bimMedia,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem
    },
    data() {
        return {
            activeNames: ['1', '2', '3', '4', '5'],
            mySelf: plus.webview.currentWebview(),
            positionName: '',
            leaveId: '',
            hisTaskId: '',
            leaveInfo: {},
            userId: '',
            leaveSDT: '',
            leaveEDT: '',
            isOwner: false,
            notifyScopeObj: {
                NoticeSumOrg: '公司',
                NoticeOrg: '部门',
                NoticeUser: '个人'
            }
        }
    },
    created() { // positionName
        this.positionName = getUserInfo().positionName || '暂无'
        if (this.mySelf.detailObj) { // 已完成进入
            this.hisTaskId = this.mySelf.detailObj.id
            this.doneInit()
        } else { //  模块列表进入
            this.leaveId = this.mySelf.leaveId
            this.modulInit()
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
    methods: {
        modulInit() { //  模块
            const params = {
                leaveId: this.leaveId
            }
            plus.nativeUI.showWaiting()   // eslint-disable-line
            getLeaveDetail(params)
                .then(res => {
                    if (res) {
                        res.leaveTypeChinese = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][res.leaveType].value
                        this.leaveInfo = res
                        this.leaveSDT = this.leaveInfo.details[0].leaveStartDt
                        this.leaveEDT = this.leaveInfo.details[0].leaveEndDt
                    } else {
                        plus.nativeUI.toast('数据错误')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting() // eslint-disable-line
                })
        },
        doneInit() { //  待办已完成列表进入
            plus.nativeUI.showWaiting()   // eslint-disable-line
            getHisDetail(this.hisTaskId)
                .then(res => {
                    if (res) {
                        res.leaveTypeChinese = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][res.leaveType].value
                        this.leaveInfo = res
                        this.leaveSDT = this.leaveInfo.details[0].leaveStartDt
                        this.leaveEDT = this.leaveInfo.details[0].leaveEndDt
                    } else {
                        plus.nativeUI.toast('数据错误')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting() // eslint-disable-line
                })
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';

.leave-detail{
  width:100%;
  height:100%;
  &--block {
      margin-top: 46px;
      background: $bg2;
  }
  &--box{
      background: $bg2;
      vertical-align:middle;
      h3{
          font-size:12px;
          height:32px;
          line-height:32px;
          background: $bg4;
          color:#0c2f58;
          padding:0 15px;
          margin:0;
          font-weight: 800;
       }
       &__list1{
           position: relative;
           li{
               font-size: 12px;
               line-height:18px;
               min-height: 18px;
               padding: 10px 0px 10px 70px;
               position: relative;
               span.label {
                   position: absolute;
                   font-size: 12px;
                   line-height:18px;
                   display: inline-block;
                   width: 65px;
                   left:0;
                   top:10px;
                   font-weight:800;
                //    background: #eee;
               }
           }
           li:before{
                content: "";
                position: absolute;
                left: 0px;
                bottom: -1px;
                right: 0;
                height: 1px;
                border-bottom: 1px solid #D9D9D9;
                -webkit-transform-origin: 0 0;
                transform-origin: 0 0;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
            }
            li:last-child:before{
                border-bottom:none;
            }
       }
        &__list1:before{
            content: "";
            position: absolute;
            left: 0px;
            bottom: -1px;
            right: 0;
            height: 1px;
            border-bottom: 1px solid #D9D9D9;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }
        &__list1:last-child:before{
            border-bottom:none;
        }
        &__list2{
           padding: 10px 0;
           li{
               font-size: 12px;
               line-height:18px;
               float: left;
               margin-right:8px;
           }
       }
       &__list2:before{
            content: "";
            position: absolute;
            left: 0px;
            bottom: -1px;
            right: 0;
            height: 1px;
            border-bottom: 1px solid #D9D9D9;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }
    }
}
</style>