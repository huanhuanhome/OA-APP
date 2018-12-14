/*
 * @Author: LG
 * @Last Modified by: LG
 * @Last Modified time: 2018-10-10 17:27:16
 */
/**
|--------------------------------------------------
| 销假详情模块 {{ leaveInfo.entryDt | dateTimeFarmatHIS }}
|--------------------------------------------------
*/
<template>
    <div class="cancelLeave-detail">
        <bimHeader title="销假详情" left-arrow/>

            <div class="collapse-block">
                <van-collapse v-model="activeNames">
                    <van-collapse-item title="基础信息" name="1">
                        <ul class="g-list-2">
                            <li><span class="label">姓名：</span>{{ cancelInfo.createName }}</li>
                            <li><span class="label">部门：</span>{{ cancelInfo.createOrgName }}</li>
                            <li><span class="label">职务：</span>{{ positionName }}</li>
                            <li><span class="label">入职时间：</span>暂无</li>
                        </ul>
                    </van-collapse-item>
                    <van-collapse-item title="销假信息" name="2">
                        <ul class="g-list-2 g-list-2--span90">
                            <li><span class="label">请假申请单：</span>{{ cancelInfo.leaveInfo.title }}</li>
                            <li><span class="label">请假类别：</span>{{ cancelInfo.leaveInfo.leaveTypeChinese }}</li>
                            <li><span class="label">请假开始时间：</span>{{ cancelInfo.leaveInfo.startDt | dateTimeFarmat }}</li>
                            <li><span class="label">请假结束时间：</span>{{ cancelInfo.leaveInfo.endDt | dateTimeFarmat }}</li>
                            <li><span class="label">销假开始时间：</span>{{ cancelInfo.cancelStartDt | dateTimeFarmat }}</li>
                            <li><span class="label">销假结束时间：</span>{{ cancelInfo.cancelEndDt | dateTimeFarmat }}</li>
                            <li><span class="label">销假说明：</span>{{ cancelInfo.cancelExplanation }}</li>
                        </ul>
                    </van-collapse-item>
                    <van-collapse-item title="审批详情" name="3">
                        <template v-if="cancelInfo.hasOwnProperty('hisOpinions') && cancelInfo.hisOpinions.length > 0">
                            <ul class="g-list-2" v-for="(hisOpinion, index) in cancelInfo.hisOpinions" :key="index">
                                <li><span class="label">所属部门：</span>{{ hisOpinion.createOrgName }}</li>
                                <li><span class="label">审批人：</span>{{ hisOpinion.createName }}</li>
                                <li><span class="label">审批意见：</span>{{ hisOpinion.opinion }}</li>
                                <li><span class="label">审批时间：</span>{{ hisOpinion.createDt | dateTimeFarmatHIS }}</li>
                                <li><span class="label">审批状态：</span>{{ hisOpinion.agree ? '已通过' : '已驳回' }}</li>
                            </ul>
                        </template>
                        <template v-else>
                            <ul class="g-list-2--nolabel">
                                <li>暂无部门领导审批信息</li>
                            </ul>
                        </template>
                    </van-collapse-item>
                </van-collapse>
            </div>
    </div>
</template>
<script>
  import { getCancelLeaveDetail, getHisDetail } from '@/api/workflow'
import { parseTime } from '@/common/utils.js'
  import { getUserInfo, getMappingCfg } from '@/common/app'
import bimHeader from '@/component/bimHeader/bimHeader'
import { Collapse, CollapseItem } from 'vant'
export default {
      components: {
          bimHeader,
          [Collapse.name]: Collapse,
          [CollapseItem.name]: CollapseItem
      },
      data() {
          return {
              activeNames: ['1', '2', '3'],
              mySelf: plus.webview.currentWebview(),
              positionName: '',
              cancelId: '',
              hisTaskId: '',
              cancelInfo: {}
          }
      },
      created() { // positionName
          if (this.mySelf.detailObj) { // 已完成进入
              this.hisTaskId = this.mySelf.detailObj.id
              this.doneInit()
          } else { //  模块列表进入
              this.cancelId = this.mySelf.cancelId
              this.positionName = getUserInfo().positionName || '暂无'
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
                  cancelId: this.cancelId
              }
            plus.nativeUI.showWaiting()   // eslint-disable-line
              getCancelLeaveDetail(params)
                  .then(res => {
                      if (res) {
                          res.leaveInfo.leaveTypeChinese = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][res.leaveInfo.leaveType].value
                          this.cancelInfo = res
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
                          res.leaveInfo.leaveTypeChinese = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][res.leaveInfo.leaveType].value
                          this.cancelInfo = res
                          this.positionName = res.positionName || '暂无'
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

.cancelLeave-detail{
  width:100%;
  height:100%;
}
</style>