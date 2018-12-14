/*
 * @Author: LG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-21 17:52:24
 */
/**
|--------------------------------------------------
| 申请销假模块
|--------------------------------------------------
*/
<template>
    <div class="apply-cancel-leave">
        <bimHeader title="销假申请" left-arrow/>

            <div class="collapse-block">
                <van-collapse v-model="activeNames">
                    <van-collapse-item title="基础信息" name="1">
                        <ul class="g-list-2">
                            <li><span class="label">姓名：</span>{{ applyCancelLeave.createName }}</li>
                            <li><span class="label">部门：</span>{{ applyCancelLeave.createOrgName }}</li>
                            <li><span class="label">职务：</span>{{ applyCancelLeave.positionName || '暂无' }}</li>
                            <li><span class="label">入职时间：</span>暂无</li>
                        </ul>
                    </van-collapse-item>
                    
                    <van-collapse-item title="审批详情" name="3">
                        <template v-if="cancelInfo.hasOwnProperty('hisOpinionsFirst') && cancelInfo.hisOpinionsFirst.length > 0">
                            <ul class="g-list-2" v-for="hisFirstItem in cancelInfo.hisOpinionsFirst">
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
                    </van-collapse-item>
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
                
            </div>
    </div>
</template>
<script>
  import { cancelLeaveInit, cancelLeavePublish, validateCancelDate } from '@/api/workflow'
import { parseTime } from '@/common/utils.js'
  import moment from 'moment'
  import { fire } from '@/utils/envent.js'
import { getUserInfo, getMappingCfg } from '@/common/app'
import bimHeader from '@/component/bimHeader/bimHeader'
import { Collapse, CollapseItem, Button, Field, Popup, Picker, DatetimePicker } from 'vant'
export default {
      components: {
          bimHeader,
          [Collapse.name]: Collapse,
          [CollapseItem.name]: CollapseItem,
          [Button.name]: Button,
          [Field.name]: Field,
          [Popup.name]: Popup,
          [Picker.name]: Picker,
          [DatetimePicker.name]: DatetimePicker
      },
      data() {
          return {
              activeNames: ['2', '4'],
              mySelf: plus.webview.currentWebview(),
              positionName: '',
              cancelInfo: {}
          }
      },
      created() { // positionName
          this.positionName = getUserInfo().positionName || '暂无'
          if (this.mySelf.detailObj) { // 从驳回点进

          } else {
              this.applyCancelLeaveInit()
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
          applyCancelLeaveInit() {
              cancelLeaveInit()
                  .then(res => {
                      if (res) {
  
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
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
.approve-cancel-leave{
  width:100%;
  height:100%;
}
// .collapse-block{
//     padding-top: 45px;
// }
.submit-button__submit{
    background: $bg5;
    border-color: $bg5;
}
</style>