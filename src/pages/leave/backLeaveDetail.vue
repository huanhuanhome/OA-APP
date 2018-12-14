/*
 * @Author: LG
 * @Last Modified by: suntingting
 * @Last Modified time: 2018-09-18 10:55:23
 */
/**
|--------------------------------------------------
| 请销假列表模块
|--------------------------------------------------
*/
<template>
  <div class="leave-list">
    <bimHeader
      :title="pageTitle"
      left-arrow
      @click-right="selectDT"
    >
      <div class="btn-select btn-select--noborder" solt="right" style="top:6px;">
        <button class="btn-select__normal">
          <span class="btn-select__text">{{ yearObj.year }}</span>
            <i class="iconfont icon-unfold btn-select__icon btn-select__icon--blue"></i>
          </button>
      </div>
    </bimHeader>

    <div class="leave-list-block">
      <van-tabs v-model="active" class="busTravel-tab pr">
        <van-tab
        title="请假列表"
        class="busTravel-container"
      >
        <van-list
          v-model="loading"
          :finished="finished"
                    :offset="offset"
                    @load="leaveData()"
                    >
                    <div v-if="isLeaveItem" class="no-notice-block">
                        <i class="iconfont icon-emoji icon-wh"></i>
                        <p>您无请假数据</p>
                    </div>
                    <ul class="g-list-1 g-list-1--type1" v-else>
                        <li v-for="item in leaveItem" :key="item.id" @click="showDetail(item)">
                            <span class="type">{{ item.noticeTypeChinese | firstName }}</span>
                            <span class="status s-putong" v-if="item.importance === 'Ordinary'">{{ item.importanceChinese }}</span>
                            <span class="status s-jinji" v-else>{{ item.importanceChinese }}</span>
                            <p class="title p-ellipsis">{{ item.title }}</p>
                            <p class="more clearfix">
                                <span> {{item.createDate | dateTimeFarmat }} </span>
                                <span>{{ item.notifierOrgName }}：{{ item.notifierName }}</span>
                                <span>浏览人次：{{ item.noticeNumber }}</span>
                            </p>
                        </li>
                    </ul>
                    </van-list>
                </van-tab>
                
                <van-tab
                :title="myNoticeNumber" 
                class="busTravel-container" 
                >
                <van-list
                    v-model="loading"
                    :finished="finished"
                    :offset="offset"
                    @load="mySubmitNoticeData()"
                    >
                    <div v-if="isNoticeItem" class="no-notice-block">
                        <i class="iconfont icon-emoji icon-wh"></i>
                        <p>您暂无发起公告数据</p>
                    </div>
                    <ul class="g-list-1 g-list-1--type1" v-else>
                        <li v-for="item in noticeItem" :key="item.id" @click="showDetail(item)">
                            <span class="type">{{ item.noticeTypeChinese | firstName }}</span>
                            <span class="status s-putong" v-if="item.importance === 'Ordinary'">{{ item.importanceChinese }}</span>
                            <span class="status s-jinji" v-else>{{ item.importanceChinese }}</span>
                            <p class="title p-ellipsis">{{ item.title }}</p>
                            <p class="more clearfix">
                                <span> {{item.createDt | dateTimeFarmat }} </span>
                                <span>{{ item.createOrgName }}：{{ item.createName }}</span>
                                <span>浏览人次：{{ item.noticeNumber }}</span>
                            </p>
                        </li>
                    </ul>
                    
                </van-list>

                </van-tab>
            </van-tabs>
    </div>
    <van-popup v-model="isShow" position="bottom">
        <van-picker
            value-key="name"
            show-toolbar
            :columns="asActions" 
            @cancel="isShow = false"
            @confirm="onSelect"
        />
    </van-popup>
  </div>
</template>
<script>
import { Tab, Tabs, List, Cell, PullRefresh, Loading, Popup, Picker } from 'vant'
import { openWebview } from "@/utils/webview";
import { parseTime } from '@/common/utils.js'
import bimHeader from '@/component/bimHeader/bimHeader'
export default {
  components: {
    bimHeader,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [Cell.name]: Cell,
    [PullRefresh.name]: PullRefresh,
    [Loading.name]: Loading,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
  },
  data() {
    return {
      pageTitle: '请假列表',
      yearObj: {
        year: 2018,
        yearId: '2018-01-01&2018-12-31',
      },
      isShow: false,
      asActions: [],
      active: 0,
      loading: false,
      finished: false,
      offset: 50,
      userId: '',
      pageSize: 10,
      pageNo: 1,
      leaveItem: [],
      isLeaveItem: false
    }
  },
  created() {
    this.yearObj.year = parseTime(new Date(), '{y}')
    for (let i = 0; i <= 10; i++) {
      this.asActions.push({ name: this.yearObj.year - i, yearId: this.yearObj.year - i + '-01-01&' + this.yearObj.year - i + '-12-31' })
    }
  },
  methods: {
    selectDT() {
      this.isShow = true
    },
    onSelect(item) {
      this.yearObj.year = item.name
      this.yearObj.yearId = item.yearId
      this.pageNo = 1
      this.leaveItem = []
      this.finished = false
      this.isShow = false
    },
    leaveData() { //  请假列表数据

    },
    showDetail(value) { //  请假详情

    },
  }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
.leave-list{
  width:100%;
  height:100%;
}
.leave-list-block{
    position: absolute;
    top: 45px;
    bottom: 0;
    width:100%;
    overflow:hidden;
}
.busTravel{
    width: 100%;
    height: 100%;
    
    &-tab {
        width: 100%;
        height: 100%;
    }
    &-container{
        position: absolute;
        width:100%;
        top:0px;
        bottom:50px;
        overflow-y: auto;
        
    }
}
/deep/ .van-tabs__nav--line .van-tabs__line{
        background-color: #0066CC;
    }
/deep/ .van-tab.van-tab--active{
    background: #fff;
}
/deep/ .van-tab .van-ellipsis {
    color: $textc6;
}
/deep/ .van-tab--active .van-ellipsis{
    color: #0066CC;
}
/deep/ .van-tabs .van-tabs__content{
    width: 100%;
    height:100%;
    position: relative;
}
/deep/ .van-list__loading{
    height:50px;
    display:block;
    overflow:hidden;
    position: relative;
}
</style>
