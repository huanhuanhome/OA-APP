/*
 * @Author: suntingting 
 * @Date: 2018-09-12 17:14:51 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-21 17:54:07
 */
/**
|--------------------------------------------------
| 
|   出差详情
| 
| 
|--------------------------------------------------
*/
<template>
    <div class="notice">
        <bimHeader 
            title="出差详情"
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
                <van-collapse-item title="审批详情" name="3">
                    <template v-if="formInfo.hisOpinions && formInfo.hisOpinions.length > 0" >
                        <ul class="g-list-2" v-for="item in formInfo.hisOpinions" :key="item.id">
                            <li><span class="label">所属部门：</span>{{item.createOrgName}}</li>
                            <li><span class="label">审批人：</span>{{item.createName}}</li>
                            <li><span class="label">审批意见：</span>{{item.opinion?item.opinion:'无'}}</li>
                            <li><span class="label">审批时间：</span>{{item.createDt | dateFormat}}</li>
                            <li><span class="label">审批状态：</span>{{ item.agree ? '已通过' : '已驳回' }}</li>
                        </ul>
                    </template>
                    <template v-else>
                        <ul class="g-list-2--nolabel">
                            <li>暂无审批信息</li>
                        </ul>
                    </template>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>
<script>
import bimHeader from '@/component/bimHeader/bimHeader'
import { travelDetail, getHisDetail } from '@/api/workflow'
import { getMappingCfg } from '@/common/app'
import { dateTimeFormatCustom } from '@/common/utils'
import { Row, Col } from 'vant'
import { Cell, Field, Collapse, CollapseItem } from 'vant'

export default {
    name: 'businessTravelDetail',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Cell.name]: Cell,
        [Field.name]: Field,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        bimHeader
    },
    data() {
        return {
            activeNames: ['1', '2', '3'],
            formInfo: {}
        }
    },
    filters: {
        dateFormat: dateTimeFormatCustom('YYYY-MM-DD')
    },
    created() {
        this.travelTypeOptions = Object.values(getMappingCfg()['WorkFlow.Personnel.BusinessTravel.Type'])
        const self = plus.webview.currentWebview()
        const data = self.detailObj
        if (data.detailType) { // 判断详情来源  存在则为从列表进入  不存在则为待办已完成进入
            this.init(data.id)
        } else {
            this.initHisDetail(data.id)
        }
    },
    methods: {
        // 初始化
        async init(id) {
            try {
                plus.nativeUI.showWaiting()
                const res = await travelDetail(id)
                this.formInfo = res
            } catch (error) {
                plus.nativeUI.toast(`${error.message}`)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        async initHisDetail(id) {
            try {
                plus.nativeUI.showWaiting()
                const res = await getHisDetail(id)
                this.formInfo = res
            } catch (error) {
                plus.nativeUI.toast(`${error.message}`)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.notice{
  width:100%;
  height:100%;
  &--block {
      padding-top: 46px;
      background: $bg2;
      font-size: 12px;
      line-height:24px;
      h2{
          font-size:14px;
          line-height:24px;
          color: $textc5;
          text-align: center;
          font-weight: 800;
          padding:0;
          margin:0;
      }
      &__editer{
          span{
              float: left;
              text-align: center;
              font-size:0.8em;
              width:33.3%;
          }
      }
  }
}
</style>