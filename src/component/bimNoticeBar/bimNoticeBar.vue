/*
 * @Author: LG
 * @Last Modified by: LG
 * @Last Modified time: 2018-09-10 13:12:21
 */
/**
|--------------------------------------------------
|  描述:单行公告(通知)公共组件，如果文字超出宽度会自动滚动
|  使用说明: 
|  vantNoticeBar轮播组件的二次封装,父级引用形式：import bimNoticeBar from '@/component/bimNoticeBar/bimNoticeBar'
|  props接收noticeObj参数，数据类型Object
|  数据格式(例：父级_home.vue noticeDataObj): 
|  noticeDataObj: {
|        mode: '模式',
|        msg: '文字区域',
|        fontColor: '#文字颜色',
|        fontBgColor: '#文字滚动区域背景颜色'
|  }
|--------------------------------------------------
*/
<template>
  <div class="bim-notice-bar">
    <van-notice-bar
        :mode="noticeObj.mode"
        :color="noticeObj.fontColor"
        :background="noticeObj.fontBgColor"
    >
      {{ noticeObj.msg }}
  </van-notice-bar>
  </div>
</template>
<script>
import { NoticeBar } from 'vant'
export default {
    components: {
        [NoticeBar.name]: NoticeBar
    },
    props: {
        noticeObj: {
            type: Object,
            default: _ => ({})
        }
    },
    data() {
      return {}
    }
}
</script>