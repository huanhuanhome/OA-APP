/*
 * @Author: LG
 * @Last Modified by: suntingting
 * @Last Modified time: 2018-09-18 10:55:41 class="{item.hasRead:}"
 */
/**
|--------------------------------------------------
| 通知公告模块
|--------------------------------------------------
*/
<template>
    <div class="notice">
        <bimHeader
            title="通知公告"
            left-arrow
            @click-right="selectDT"
        >
            <div class="btn-select btn-select--noborder" solt="right" style="top:6px;">
                <button class="btn-select__normal">
                    <span class="btn-select__text">{{ year }}</span>
                     <i class="iconfont icon-unfold btn-select__icon btn-select__icon--blue"></i>
                </button>
            </div>
        </bimHeader>

        <div class="notice-block">

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
                :title="noticeAllNumber"
                class="busTravel-container"
                >
                <van-list
                    v-model="loading"
                    :finished="finished"
                    :offset="offset"
                    @load="noticeData()"
                >
                    <div v-if="isNoticeItem" class="no-notice-block">
                        <i class="iconfont icon-emoji icon-wh"></i>
                        <p>您无通知公告数据</p>
                    </div>
                    <ul class="g-list-1 g-list-1--type1" v-else>
                        <li v-for="item in noticeItem" :key="item.id" :class="{'hasready': item.hasRead}" @click="showDetail(item)">
                            <span class="type">{{ item.noticeTypeChinese | firstName }}</span>
                            <span class="status s-putong" v-if="item.importance === 'Ordinary'">{{ item.importanceChinese }}</span>
                            <span class="status s-jinji" v-else>{{ item.importanceChinese }}</span>
                            <span class="status1 s-putong" v-if="item.hasRead">已阅</span>
                            <span class="status1 s-jinji" v-else>未阅</span>
                            <p class="title p-ellipsis">{{ item.title }}</p>
                            <p class="more clearfix">
                                <span> {{item.noticerCreateDt | dateTimeFarmat }} </span>
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
                        <p>您无发起通知公告数据</p>
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
  import { getNoticeUserListByParameter, getNoticeListByParameters, getNoticeUserCountByParameter, updateNoticeById } from '@/api/workflow'
  import { getUserInfo, getMappingCfg } from '@/common/app'
  import { parseTime } from '@/common/utils.js'
  import { openWebview } from '@/utils/webview'
  import bimHeader from '@/component/bimHeader/bimHeader'
  import { Tab, Tabs, List, Cell, PullRefresh, Actionsheet, Loading, Search , Popup, Picker} from 'vant'
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
          [Picker.name]: Picker
      },
    data() {
        return {
            searchValue: '',
            year: 2018,
            yearId: '2018-01-01&2018-12-31',
            isShow: false, // 弹出下拉菜单
            asActions: [],
            active: 0,
            loading: false,
            finished: false,
            list: [],
            offset: 50,
            userId: '',
            pageSize: 10,
            pageNo: 1,
            noticeItem: [],
            isNoticeItem: false,
            listenFunction: 0,
            noticeAllNumber: '',
            myNoticeNumber: ''
        }
    },
    created() {
        let userInfo = getUserInfo()
        if ( userInfo && userInfo.id !== '' ) {
            this.userId = userInfo.id
        }
        this.year = parseTime(new Date(), '{y}')
        for (var i = 0; i <= 10; i++) {
            let yearFormat = this.year - i
            this.asActions.push({ name: this.year - i, yearId: yearFormat + '-01-01&' + yearFormat + '-12-31' })
        }
        this.noticeNum()
        window.addEventListener('customEvent', _ => {
            this.noticeNum()
            this.requestData()
        })
    },
    watch: {
        active(newValue) {
            this.active = newValue
            this.requestData()
        },
        searchValue(newValue) {
            if(newValue === '') {
                this.noticeItem = []
                if (this.active === 0) {
                    this.noticeData()
                }
                if (this.active === 1) {
                    this.mySubmitNoticeData()
                }
            }
        }
    },
    filters: {
        dateTimeFarmat(value) { // {h}:{i}:{s}
            return parseTime(value, '{y}-{m}-{d}')
        },
        firstName(value) {
            return value.substr(0, 1)
        }
    },
    methods: {
        noticeNum() {
            let params = {
                startDate: this.yearId.split("&")[0],
                endDate: this.yearId.split("&")[1]
            }
            getNoticeUserCountByParameter(params)
                .then(res => {
                    if(res){
                        this.noticeAllNumber = '公告列表(' +res.receiveNumber + ')'
                        this.myNoticeNumber = '我发起的(' + res.initiateNumber + ')'
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting() // eslint-disable-line
                })
        },
        mySubmitNoticeData() { // 当前用户发起的通知公告 filter
            this.listenFunction++
            let params = {
                startDate: this.yearId.split("&")[0],
                endDate: this.yearId.split("&")[1],
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                filter: this.searchValue
            }
            plus.nativeUI.showWaiting()   // eslint-disable-line
            getNoticeListByParameters(params)
                .then(res => {
                    this.loading=true
                    this.isNoticeItem = false;
                    setTimeout(() => {
                      if(res && res.entities.length > 0) {
                            res.entities.forEach((item) => {
                                item.noticeTypeChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Type'][item.noticeType].value
                                item.importanceChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Importance'][item.importance].value
                                this.noticeItem.push(item)
                            })
                          this.loading = false
                          if(this.pageNo >= res.pageCount) {
                              this.finished = true;
                          }else{
                              this.pageNo++
                          }
                      } else {
                        this.loading = false;
                        this.finished = true;
                        this.isNoticeItem = true;
                        plus.nativeUI.toast("暂无数据")
                      }
                      },800)
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting() // eslint-disable-line
                })
        },
        noticeData() {  //  公告列表数据
            this.listenFunction++
            let params = {
                startDate: this.yearId.split("&")[0],
                endDate: this.yearId.split("&")[1],
                userId: this.userId,
                pageSize: this.pageSize,
                pageNo: this.pageNo,
                filter: this.searchValue
            }
            plus.nativeUI.showWaiting()   // eslint-disable-line
            getNoticeUserListByParameter(params)
                .then(res => {
                    this.loading=true
                    this.isNoticeItem = false;
                    setTimeout(() => {
                      if(res && res.entities.length > 0) {
                            res.entities.forEach((item) => {
                                item.noticeTypeChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Type'][item.noticeType].value
                                item.importanceChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Importance'][item.importance].value
                                this.noticeItem.push(item)
                            })
                            this.loading = false
                            if(this.pageNo >= res.pageCount) {
                                this.finished = true;
                            }else{
                                this.pageNo++
                            }
                      } else {
                        this.loading = false;
                        this.finished = true;
                        this.isNoticeItem = true;
                        plus.nativeUI.toast("暂无数据")
                      }
                      },800)
                  })
                  .catch(e => {
                      plus.nativeUI.toast(e && e.message) // eslint-disable-line
                  })
                  .finally(() => {
                      plus.nativeUI.closeWaiting() // eslint-disable-line
                  })
        },
        selectDT() {
            this.isShow = true
        },
        onSelect(item) {
            this.year = item.name
            this.yearId = item.yearId
            this.isShow = false
            this.noticeNum()
            this.requestData()
        },
        requestData() {
            this.searchValue = ''
            this.listenFunction = 0
            this.pageNo = 1
            this.noticeItem = []
            this.finished = false
            setTimeout( () => {
                if (this.listenFunction < 1 && this.active === 0) {
                    this.listenFunction = 0
                    this.noticeData()
                }
                if (this.listenFunction < 1 && this.active === 1) {
                    this.listenFunction = 0
                    this.mySubmitNoticeData()
                }
            }, 500)
        },
        showDetail(val) {
            if(this.active === 0 && !val.hasRead) {  //  公告列表
                plus.nativeUI.showWaiting()   // eslint-disable-line
                let params = {
                    noticeId: val.id
                }
                updateNoticeById(params)
                    .then(res => {
                        if(res){
                            openWebview(
                                {
                                    url: "noticeDetail.html",
                                    id: "noticeDetail"
                                },{},
                                {
                                    noticeId: val.businessId,
                                    hasRead: val.hasRead
                                }
                            )
                        } else {
                            plus.nativeUI.toast('已阅数据处理错误')
                        }
                    })
                    .catch(e => {
                        plus.nativeUI.toast(e && e.message) // eslint-disable-line
                    })
                    .finally(() => {
                        plus.nativeUI.closeWaiting() // eslint-disable-line
                    })
            }else{
                openWebview(
                    {
                        url: "noticeDetail.html",
                        id: "noticeDetail"
                    },{},
                    {
                        noticeId: (this.active === 0) ? val.businessId : val.id
                    }
                )
            }
        },
        onSearch() {
           this.noticeItem = []
           this.pageNo = 1
           this.pageSize = 1000
           if(this.active === 0) {
               this.noticeData()
           } else {
               this.mySubmitNoticeData()
           }
        }
    }
  }
</script>
<style lang="scss" scoped>
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
.no-notice-block{
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
.notice{
  width:100%;
  height:100%;
}
.notice-block{
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
        -webkit-overflow-scrolling: touch;
        position: absolute;
        width:100%;
        top:50px;
        bottom:50px;
        overflow: scroll;
    }
    &-container::-webkit-scrollbar{display:none}
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
 /deep/ .van-search{padding:0;}
 /deep/ .van-icon.van-icon-search{
            left:0px;
            width:8px;
            height:24px;
            display:block;
        }
/deep/ .van-field__control,.van-field__control .van-field__control{font-size:12px;line-height:24px;}
</style>