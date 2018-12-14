/*
 * @Author: LG
 * @Last Modified by: LG
 * @Last Modified time: 2018-09-11 14:10:23
 */
/**
|--------------------------------------------------
|  描述:单元格公共组件二，带右侧箭头。
|  使用说明: 
|  Collapse折叠面板组件的二次封装,父级引用形式：import bimCollapse2 from '@/component/bimCollapse2/bimCollapse2'
|  props接收bimCollapse1Array参数，数据类型Array
|  数据格式(例：父级party-cost/secretaryPage.vue bimCollapse2Data1): 
|  bimCollapse2Data1: [
|     {
|        year: '年份',
|        shouldPayTotal: '需交',
|        actualPayTotal: '已交',
|        monthArray: [
|           {month: '月份', payMoney: '已交', payMoney: '缴费数额' status: '已缴费、未缴费', payDate: '缴费时间'},...
|        ]
|      },...
|  ]
|--------------------------------------------------
*/
<template>
    <div class="bimCollapse1">
        <van-collapse v-model="activeNames" accordion v-for="(cItem, index) in bimCollapse2Array" :key="index" @change="getItem(cItem, index)">
            <van-collapse-item v-if="cItem.status" :name="(index+1)">
                <div slot="title">
                  <div class="bimCollapse1__title">
                    <span>{{cItem.year}}-{{cItem.month}}</span>
                    <span><b>{{cItem.actualPayTotal}}/{{cItem.shouldPayTotal}}元</b></span>
                    <span></span>
                  </div>
                </div>
                <ul class="bimCollapse1__item">
                    <li class="clearfix" v-for="(item, index) in cItem.recordEntityList" :key="index">
                        <span class="user">
                          <i>{{ item.userName | firstName }}</i>
                          <b class="f">{{ item.userName }}</b>
                          <b class="s">{{ item.payMoney }}元</b>
                        </span>
                        <span class="datetime">
                          <b>{{ item.shouldPayDate | dateTimeFarmat }}</b>
                          <b>{{ item.status }}</b>
                        </span>
                    </li>
                </ul>
            </van-collapse-item>
            <ul class="bimCollapse2__item" v-else @click="popMssage(cItem)">
              <li class="clearfix">
                <span class="pay">{{cItem.year}}-{{cItem.month}}</span>
                <span class="datetime">{{cItem.actualPayTotal}}/{{cItem.shouldPayTotal}}元</span>
                <span class="money"></span>
                <i class="icon-dishouju"><img src="../../assets/images/dianzishouju.png"/></i>
              </li>
          </ul>
        </van-collapse>
    </div>
</template>
<script>
import { Collapse, CollapseItem, ImagePreview } from 'vant'
import { dateTimeFormatCustom } from '@/common/utils.js'
export default {
    components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [ImagePreview.name]: ImagePreview
    },
    props: {
        bimCollapse2Array: {
            type: Array,
            default: _ => []
        }
    },
    data() {
        return {
            activeNames: ['1']
        }
    },
    mounted() {
    },
    filters: {
        dateTimeFarmat: dateTimeFormatCustom('YYYY-MM-DD'),
        firstName(value) {
            return value.substr(0, 1)
        }
    },
    methods: {
        popMssage(item) {
            ImagePreview([
                require('@/assets/images/shouju.jpg')
            ])
        },
        getItem(item) {
            const bimCollapse2BackData = {}
            const im = item.month
            bimCollapse2BackData.jnMonth = im.charAt(0) == 0 ? im.charAt(1) : im
            bimCollapse2BackData.jnUserNum = item.recordEntityList.length
            this.$emit('bimCollapse2BackObj', bimCollapse2BackData);
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
    color: $textc8;
    span{
      display: block;
      width: 33.3%;
      height:24px;
      float: left;
      line-height:24px;
      font-size:14px;
      b{
        display: block;
        font-weight: normal;
        text-indent: 20px;
      }
    }
  }
  &__item{
    li{
      font-size:12px;
      color: $textc6;
      position: relative;
      padding-right: 17px;
      padding-top:10px;
      padding-bottom:10px;
      span{
        display: block;
        width: 50%;
        height:36px;
        float: left;
        line-height:18px;
      }
      b{
        display: block;
        font-weight: normal;
      }
      .user{
        text-align: left;
        font-size: 14px;
        b{
          margin-left:46px;
        }
        b.f{
          line-height: 22px;
          color: $textc1;
        }
        b.s{
          font-size:12px;
          line-height:14px;
        }
        i{
          width: 36px;
          height: 36px;
          display: inline-block;
          top: 0px;
          text-align: center;
          background: $bg5;
          color: #fff;
          font-size:14px;
          font-family: "SimHei";
          border-radius: 36px;
          line-height: 36px;
          font-style: normal;
          position:absolute;
          top:10px;
          left:0;
        }
      }
      .datetime{
        text-align: right;
        color: $textc8;
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
.bimCollapse2__item{
  height:44px;
  li{
      font-size:14px;
      color: $textc5;
      position: relative;
      padding: 0px 32px 0px 15px;
      background: $bg2;
      span{
        display: block;
        width: 33.3%;
        height:44px;
        float: left;
        line-height:44px;
      }
      .pay{
        text-align: left;
      }
      .datetime{
        text-align: left;
        text-indent: 20px;
      }
      .money{
        text-align: center;
      }
      .icon-dishouju{
        display:inline-block;
        width:44px;
        height:44px;
        text-align: right;
        position: absolute;
        right: 10px;
        top: 0px;
        img{
          width:20px;
          position:relative;
          top: 12px;
          vertical-align: top;
        }
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
</style>