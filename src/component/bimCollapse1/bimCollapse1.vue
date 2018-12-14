/*
 * @Author: LG
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-12 15:33:03
 */
/**
|--------------------------------------------------
|  描述:单元格公共组件一，带右侧箭头。
|  使用说明: 
|  Collapse折叠面板组件的二次封装,父级引用形式：import bimCollapse1 from '@/component/bimCollapse1/bimCollapse1'
|  props接收bimCollapse1Array参数，数据类型Array
|  数据格式(例：父级party-cost/partyMemberPage.vue bimCollapse1Data1): 
|  bimCollapse1Data1: [
|     {
|        year: '年份',
|        shouldPayTotal: '需交',
|        actualPayTotal: '已交',
|        monthArray: [
|           {month: '月份', payMoney: '已交', payMoney: '缴费数额' status: '已缴费、未缴费', payDate: '缴费时间', shouldPayDate: '应缴费日期'},...
|        ]
|      },...
|  ]
|--------------------------------------------------
*/
<template>
    <div class="bimCollapse1">
        <van-collapse v-model="activeNames" accordion>
            <van-collapse-item v-for="(cItem, index) in bimCollapse1Array" :is-link="cItem.shouldPayTotal !== null" :key="index" :name="(index+1)">
                <div slot="title">
                  <div class="bimCollapse1__title">
                    <span class="p-ellipsis">{{cItem.year}}年({{cItem.shouldPayTotal}}元)</span>
                    <span></span>
                    <span v-if="cItem.actualPayTotal !== null"><b>已缴费{{cItem.actualPayTotal}}元</b></span>
                  </div>
                </div>
                <ul class="bimCollapse1__item">
                    <li 
                        v-for="(item, index) in cItem.monthArray" 
                        :key="index" 
                        :class="[item.status === '待缴费' ? 'no-pay' : '', 'clearfix']"
                        @click="item.status === '待缴费' ? openWindow(item) : popMssage(item)">
                        <template v-if="item.status === '待缴费'" >
                            <span class="pay" >{{ item.month }}待缴费</span>
                            <span class="datetime"></span>
                            <span class="money">{{ item.payMoney }}元</span>
                        </template>
                        <template v-else>
                            <span class="pay">{{ item.month }}已缴费</span>
                            <span class="datetime">{{ item.payDate | dateTimeFarmat }}</span>
                            <span class="money">{{ item.payMoney }}元</span>
                            <i class="icon-dishouju"><img src="../../assets/images/dianzishouju.png"/></i>
                        </template>
                    </li>
                </ul>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>
<script>
import { Collapse, CollapseItem, ImagePreview } from 'vant'
import { dateTimeFormatCustom } from '@/common/utils.js'
import { openWebview } from '@/utils/webview'
export default {
    components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [ImagePreview.name]: ImagePreview
    },
    props: {
        bimCollapse1Array: {
            type: Array,
            default: _ => []
        }
    },
    data() {
        return {
            activeNames: ['1']
        }
    },
    filters: {
        dateTimeFarmat: dateTimeFormatCustom()
    },
    methods: {
        popMssage(item) {
            ImagePreview([
                require('@/assets/images/shouju.jpg')
            ])
        },
        openWindow(item) {
            openWebview(
                {
                    url: './party-cost.partyPayFee.html',
                    id: 'party-cost.partyPayFee'
                },
                {},
                {
                    unPaymentInfo: item
                }
            )
        }
    }
}

</script>
<style lang="scss" scoped>
@import '@/assets/css/defalut-theme/color.scss';
.bimCollapse1{
 /deep/ .van-collapse-item__content{
    padding: 0px 15px 0px 15px;
  }
  &__title{
    font-size: 12px;
    span{
      display: block;
      width: 33.3%;
      height:24px;
      float: left;
      line-height:24px;
      font-size:12px;

      b{
        color: $textc9;
        font-weight: normal;
      }
    }
  }
  &__item{
    li{
      font-size:12px;
      color: $textc6;
      position: relative;
      padding-right: 17px;
      span{
        display: block;
        width: 33.3%;
        height:36px;
        float: left;
        line-height:36px;
      }
      .pay{
        text-align: left;
      }
      .datetime{
        text-align: left;
        text-indent: 10px;
      }
      .money{
        text-align: center;
      }
      .icon-dishouju{
        display:inline-block;
        width:36px;
        height:36px;
        text-align: right;
        position: absolute;
        right:0;
        top:0px;
        img{
          width:20px;
          position:relative;
          top: 8px;
          vertical-align: top;
        }
      }
    }
    li.no-pay{
      span{
        color: $textc8
      }
    }
    li:before {
      content: "";
      position: absolute;
      left: 0;
      bottom: -1px;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #D9D9D9;
      color: #D9D9D9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    li:last-child::before{
      border-bottom: none;
    }
  }
}
</style>
>