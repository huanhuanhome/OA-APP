/*
 * @Author: LG
 * @Last Modified by: LG
 * @Last Modified time: 2018-08-23 16:31:41
 */
/**
|--------------------------------------------------
|  描述:单元格公共组件一，带右侧箭头。
|  使用说明: 
|  vantCell单元格组件的二次封装,父级引用形式：import bimCellGroup1 from '@/component/bimCellGroup1/bimCellGroup1'
|  props接收bimCellGroup1Array参数，数据类型Array
|  数据格式(例：父级pages/contact-book/_contactBook.vue.vue bimCellGroup2Data1): 
|  bimCellGroup2Data1: [
|     {
|        title: '标题',
|        iconUrl: require('@/assets/images/左侧图标'),
|        value: '右侧内容',
|        childrenNum: '这个部门下人数'
|      }
|  ]
|--------------------------------------------------
*/
<template>
  <div class="bim-cell-group2">
    <van-cell-group>
      <van-cell v-for="(item, index) in bimCellGroup2Array" :key="index" :is-link="item.isChildren" @click="contactBookUpData(item)">
        <template slot="title">
          <i class="bim-cell-group2__icon"><img :src="item.iconUrl"/></i>
          <span class="bim-cell-group2__title">{{ item.title }} <span v-if="item.isPerson">({{ item.childrenNum }})</span></span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>
<script>
import { Cell, CellGroup, Icon } from 'vant'
export default {
    components: {
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Icon.name]: Icon
    },
    props: {
        bimCellGroup2Array: {
            type: Array,
            default: []
        }
    },
    methods: {
        contactBookUpData(data) {
            if (data.isPerson || data.children) {
                this.$emit('departmentData', data)
            } else {
                 plus.nativeUI.toast('该部门没有数据') // eslint-disable-line
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.bim-cell-group2{
  &__icon{
    width: 18px;
    height: 18px;
    display: inline-block;
    top: 2px;
    left: 5px;
    text-align: center;
    position:relative;
    img{
      width: 100%;
      vertical-align: top;
    }
  }
  &__title{
      font-family: "SimHei";
      font-size: 14px;
      margin-left: 15px;
  }
}
</style>