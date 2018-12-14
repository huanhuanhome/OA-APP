/*
 * @Author: LG
 * @Last Modified by: suntingting
 * @Last Modified time: 2018-09-18 10:55:29
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
        <div class="p10" style="background:#f2f2f2;">
            <van-search
                placeholder="标题/发起人/部门"
                class="search"
                v-model.trim="searchValue"
                @search="onSearch"
            />
        </div>
        <van-tab
        title="请假"
        class="busTravel-container"
        >
          <div v-if="isLeaveItem" class="no-leave-block">
            <i class="iconfont icon-emoji icon-wh"></i>
            <p>您在{{ yearObj.year }}年没有请假数据</p>
          </div>
          <ul class="g-list-1 g-list-1--type1" v-else>
            <li v-for="item in leaveItem" :key="item.id" @click="showDetail(item, 'qj')">
              <span class="type">{{ item.leaveTypeChinese | firstName }}</span>
              <p class="jiaqi p-ellipsis">
                {{ item.title }}
                <span class="date-section">{{ item.startDt | dateTimeFarmat }} 至 {{ item.endDt | dateTimeFarmat }}</span>
              </p>
              <p class="xiaojia p-ellipsis">
                请假时间：{{ item.createDt | dateTimeFarmatHMS }}
                <span class="date-section">{{ item.leaveTotalNum }}天</span>
              </p>
            </li>
          </ul>
        </van-tab>
                
        <van-tab
          title="销假"
          class="busTravel-container"
        >
            <div v-if="isCanceLeaveItem" class="no-leave-block">
              <i class="iconfont icon-emoji icon-wh"></i>
              <p>您在{{ yearObj.year }}年没有销假数据</p>
            </div>
            <ul class="g-list-1 g-list-1--type1" v-else>
              <li v-for="item in canceLeaveItem" :key="item.id" @click="showDetail(item, 'xj')">
                <span class="type">{{ item.leaveInfo.leaveTypeChinese | firstName }}</span>
                <p class="jiaqi p-ellipsis">
                  {{ item.leaveInfo.leaveTypeChinese }}
                  <span class="date-section">请假时间：{{ item.leaveInfo.startDt | dateTimeFarmat }} - {{ item.leaveInfo.endDt | dateTimeFarmat }}</span>
                </p>
                <p class="xiaojia p-ellipsis">
                  销假时间：{{ item.cancelStartDt | dateTimeFarmat }} - {{ item.cancelEndDt | dateTimeFarmat }}
                  <span class="date-section">{{ item.cancelTotalNum }}天</span>
                </p>
              </li>
            </ul>  

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
import { getLeaveList, getCanceLeaveList } from '@/api/workflow'
import { openWebview } from "@/utils/webview"
import { parseTime } from '@/common/utils.js'
import { getUserInfo, getMappingCfg } from '@/common/app'
import { Tab, Tabs, List, Cell, PullRefresh, Loading, Search, Popup, Picker  } from 'vant'
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
    [Search.name]: Search,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
  },
  data() {
    return {
      pageTitle: '请假列表',
      searchValue: '',
      isComeSelect: false,
      yearObj: {
        year: 2018,
        yearId: '2018-01-01&2018-12-31',
      },
      keyWord: '',
      isShow: false,
      active: 0,
      userId: '',
      leaveItem: [],
      isLeaveItem: false,
      canceLeaveItem: [],
      isCanceLeaveItem: false
    }
  },
  computed:{
      asActions(){
          const year = new Date().getFullYear()
          this.yearObj.year = year
          let list = []
          for (let index = 0; index < 10; index++) {
              list.push({ name: year-index, yearId: year-index})                
          }
          return list
      }
  },
  created() {
      this.leaveData()
  },
  watch: {
      active(newValue) {
          this.searchValue = ''
          if (newValue === 0) {
              this.pageTitle = '请假列表'
              this.leaveItem = []
              this.leaveData()
          }
          if (newValue === 1) {
              this.pageTitle = '销假列表'
              this.canceLeaveItem = []
              this.cancelLeaveData()
          }
      },
      searchValue(newValue) {
          if(newValue === '' && !isComeSelect) {
              if(this.active === 0){
                  this.leaveItem = []
                  this.leaveData()
              }else{
                  this.canceLeaveItem = []
                  this.cancelLeaveData()
              }
          }
      }
  },
  filters: {
    dateTimeFarmat(val) { // {h}:{i}:{s}
      return parseTime(val, '{y}-{m}-{d}')
    },
    dateTimeFarmatHMS(val) {
      return parseTime(val, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    firstName(value) {
      return value.substr(0, 1)
    }
  },
  methods: {
    selectDT() {
      this.isShow = true
    },
    onSelect(item) {  //选择年份
      this.yearObj.year = item.name
      this.yearObj.yearId = item.yearId
      this.isComeSelect = true
      this.searchValue = ''
      this.isShow = false
      if (this.active === 0) {
          this.leaveItem = []
          this.leaveData()
      } else {
          this.canceLeaveItem = []
          this.cancelLeaveData()
      }
    },
    leaveData() { //  请假列表数据
      let params = {
        year: this.yearObj.year,
        keyWord: this.searchValue
      }
      plus.nativeUI.showWaiting()   // eslint-disable-line
      getLeaveList(params)
        .then(res => {
          this.isLeaveItem = false;
          if (res && res.length > 0) {
            res.forEach((val) => {
              val.leaveTypeChinese = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][val.leaveType].value
              this.leaveItem.push(val)
            })
          } else {
            this.isLeaveItem = true;
            plus.nativeUI.toast("暂无数据")
          }
        })
        .catch(e => {
          plus.nativeUI.toast(e && e.message) // eslint-disable-line
        })
        .finally(() => {
          plus.nativeUI.closeWaiting() // eslint-disable-line
        })
    },
    cancelLeaveData() { //  销假列表数据
      let params = {
        year: this.yearObj.year,
        keyWord: this.searchValue
      }
      plus.nativeUI.showWaiting()   // eslint-disable-line
      getCanceLeaveList(params)
        .then(res => {
          this.isCanceLeaveItem = false
          if (res && res.length > 0) {
            res.forEach((val) => {
              val.leaveInfo.leaveTypeChinese = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][val.leaveInfo.leaveType].value
              this.canceLeaveItem.push(val)
            })
          } else {
            this.isCanceLeaveItem = true;
            plus.nativeUI.toast("暂无数据")
          }
        })
        .catch(e => {
          plus.nativeUI.toast(e && e.message) // eslint-disable-line
        })
        .finally(() => {
          plus.nativeUI.closeWaiting() // eslint-disable-line
        })
    },
    showDetail(val, type) { //  请假销假详情
        if(type === 'qj') {
            openWebview({
                url: "leaveDetail.html",
                id: "leaveDetail"
            },{},
            {
                leaveId: val.id
            })
        } else {
            openWebview({
                url: "cancelLeaveDetail.html",
                id: "cancelLeaveDetail"
            },{},
            {
                cancelId: val.id
            })
        }
    },
    onSearch() {
        if(this.active === 0){
            this.leaveItem = []
            this.leaveData()
        }else{
            this.canceLeaveItem = []
            this.cancelLeaveData()
        }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/css/c.css';
  @import '../../assets/font/iconfont.css';
  @import '@/assets/css/defalut-theme/color.scss';
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
.no-leave-block{
    position:absolute;
    width:100%;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    color: $linkc1;
    top: 50%;
    margin-top: -150px;
    i.icon-wh{
        display:inline-block;
        width:102px;
        height:102px;
        font-size:90px;
        line-height:102px;
        color: #ccc;
    }
    p{
        color: $textc6;
    }
}
.busTravel{
    width: 100%;
    height: 100%;
    &-tab {
        width: 100%;
        height: 100%;
    }
    &-container{
        -webkit-overflow-scrolling: touch;
        position: absolute;
        width:100%;
        top:50px;
        bottom:50px;
        overflow: scroll;
    }
    &-container::-webkit-scrollbar{display:none}
}
/deep/ .van-search{padding:0;}
 /deep/ .van-icon.van-icon-search{
            left:0px;
            width:8px;
            height:24px;
            display:block;
        }
/deep/ .van-field__control,.van-field__control .van-field__control{font-size:12px;line-height:24px;}
</style>
