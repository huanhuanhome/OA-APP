/*
 * @Author: suntingting 
 * @Date: 2018-09-11 11:28:10 
 * @Last Modified by: suntingting
 * @Last Modified time: 2018-09-18 17:30:36
 */
/**
|--------------------------------------------------
| 
|   出差审批
| 
| 
|--------------------------------------------------
*/
<template>
    <div class="approve">
        <bimHeader 
            title="出差审批"
            left-arrow
        >
        </bimHeader>
        <div class="collapse-block">
            <van-collapse v-model="activeNames">
              <van-collapse-item title="基础信息" name="1">
                <ul class="g-list-2">
                    <li><span class="label">姓名：</span>{{ formInfo.createrName }}</li>
                    <li><span class="label">部门：</span>{{ formInfo.createrOrgName }}</li>
                    <li><span class="label">申请日期：</span>{{ formInfo.createDt | dateFormat }}</li>
                </ul>
            </van-collapse-item>
            <van-collapse-item title="出差信息" name="2">
                <ul class="g-list-2">
                    <li><span class="label">出差地点：</span>{{formInfo.place?formInfo.place:'未填写'}}</li>
                    <li><span class="label">同行人员：</span>{{formInfo.withPeople?formInfo.withPeople:'无'}}</li>
                    <li><span class="label">开始时间：</span>{{formInfo.beginDt | dateFormat}}</li>
                    <li><span class="label">结束时间：</span>{{formInfo.endDt | dateFormat}}</li>
                    <li><span class="label">出差天数：</span>{{formInfo.days}}天</li>
                    <li><span class="label">出差事由：</span>{{formInfo.reason}}</li>
                </ul>
            </van-collapse-item>
            <van-collapse-item title="审批" name="5">
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
import { getMappingCfg } from '@/common/app'
import { dateTimeFormatCustom } from '@/common/utils'
import { fire } from '@/utils/envent.js'
import { travelApprove } from '@/api/workflow'
import { Collapse, CollapseItem, Button, Field, Actionsheet } from 'vant'
/*global plus */
export default {
    name: 'businessTravelApply',
    components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Button.name]: Button,
        [Field.name]: Field,
        [Actionsheet.name]: Actionsheet,
        bimHeader
    },
    data() {
        return {
            activeNames: ['1', '5'],
            mySelf: plus.webview.currentWebview(),
            formInfo: {},
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
        dateFormat: dateTimeFormatCustom('YYYY-MM-DD')
    },
    created() {
        this.travelTypeOptions = Object.values(getMappingCfg()['WorkFlow.Personnel.BusinessTravel.Type'])
        this.init(this.mySelf.detailObj) // 获取出差审批数据
    },
    methods: {
        // 初始化
        init(data) {
            this.formInfo = data
        },
        handleApprove(data) {
            plus.nativeUI.showWaiting()
            // 提交数据
            console.log(this.formInfo, 'this.formInfo', data)
            this.formInfo.opinion = {}
            this.formInfo.opinion.opinion = this.opinionText
            this.formInfo.opinion.agree = data

            travelApprove(this.formInfo)
                .then(res => {
                    const openerWebview = this.mySelf.opener()
                    plus.nativeUI.toast('审批成功')
                    fire(openerWebview, 'customEvent')
                    this.overrideBack()
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast( '审批失败'+ e && e.message) // eslint-disable-line
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                }) // eslint-disable-line
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
    &__operation{

    }
}
.submit-button__submit{
    background: $bg10;
    border-color: $bg10;
}
</style>