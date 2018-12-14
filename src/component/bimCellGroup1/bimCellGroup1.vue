/*
 * @Author: LG
 * @Last Modified by: LG
 * @Last Modified time: 2018-09-10 10:49:02
 */
/**
|--------------------------------------------------
|  描述:单元格公共组件一，带右侧箭头。
|  使用说明: 
|  vantCell单元格组件的二次封装,父级引用形式：import bimCellGroup1 from '@/component/bimCellGroup1/bimCellGroup1'
|  props接收bimCellGroup1Array参数，数据类型Array
|  数据格式(例：父级_my.vue bimCellGroup1Data1): 
|  bimCellGroup1Data1: [
|     {
|        title: '标题',
|        iconUrl: require('@/assets/images/左侧图标'),
|        value: '右侧内容',
|      }
|  ]
|--------------------------------------------------
*/
<template>
  <div class="bim-cell-group1">
    <van-cell-group>
      <van-cell v-for="(item, index) in bimCellGroup1Array" :value="item.value" :key="index" is-link @click="openWindow(item)">
        <template slot="title">
          <i class="bim-cell-group1__icon pr"><img :src="item.iconUrl"/></i>
          <span class="bim-cell-group1__title">{{ item.title }}</span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>
<script>
import { Cell, CellGroup, Icon, Toast } from 'vant'
import { openWebview } from "@/utils/webview"
export default {
    components: {
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Icon.name]: Icon,
        [Toast.name]: Toast
    },
    props: {
        bimCellGroup1Array: {
            type: Array,
            default: _ => []
        }
    },
    methods: {
        openWindow(item) {
            if (item.url) {
                openWebview({
                    url: item.url+'.html',
                    id: item.url
                })
            } else {
                plus.nativeUI.toast('模块暂未开放')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.bim-cell-group1{
  &__icon{
    width: 18px;
    height: 18px;
    display: inline-block;
    top: 2px;
    text-align: center;
    margin-right: 10px;
    img{
      width: 100%;
      vertical-align: top;
    }
  }
}
</style>