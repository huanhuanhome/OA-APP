/*
 * @Author: suntingting 
 * @Date: 2018-09-12 16:11:09 
 * @Last Modified by: panjiayan
 * @Last Modified time: 2018-10-30 11:49:12
 */
/**
|--------------------------------------------------
| 
|   出差列表页
| 
| 
|--------------------------------------------------
*/
<template>
    <div class="leave-list">
        <bimHeader 
            title="出差列表"
            left-arrow
        >
            <div class="btn-select btn-select--noborder" solt="right" style="top:6px;">
                <button class="btn-select__normal" @click="showTime=true">
                    <span class="btn-select__text">{{ currentYear }}</span>
                    <i class="iconfont icon-unfold btn-select__icon btn-select__icon--blue"></i>
                </button>
            </div>
        </bimHeader>
        <div class="leave-list-block">
            <van-search placeholder="请输入搜索关键词(事由/类型)" show-action v-model="keyWord">
                <div slot="action" @click="onSearch">搜索</div>
            </van-search>
            <!-- 出差列表 -->
            <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoad"
                >
                <ul class="g-list-1 g-list-1--type1">
                    <li v-for="item in list" :key="item.id"  @click="getDetail(item.id)">
                        <span class="type">{{getType(item.type).substr(0, 1)}}</span>
                        <span class="hours">{{getType(item.type)}}：{{item.days}}天</span>
                        <p class="time-ynd p-ellipsis">{{item.beginDt | dateFormat}} 至 {{item.endDt | dateFormat}}</p>
                        <p class="work p-ellipsis">事由：{{item.reason}}</p>
                    </li>
                </ul>
            </van-list>
            <div v-if="list.length === 0" class="no-leave-block">
                <i class="iconfont icon-emoji icon-wh"></i>
                <p>您在{{ currentYear }}年没有出差数据</p>
            </div>
        </div>
        <template>
            <!-- 年度选择  -->
            <van-popup v-model="showTime" position="bottom">
                <van-picker
                    v-model="currentYear"
                    show-toolbar
                    :columns="yearList" 
                    @cancel="showTime = false"
                    @confirm="onConfirmTime"
                />
            </van-popup>
        </template>
    </div>
</template>
<script>
import { openWebview } from '@/utils/webview'
import bimHeader from '@/component/bimHeader/bimHeader'
import { getMappingCfg } from '@/common/app'
import { dateTimeFormatCustom } from '@/common/utils'
import { travelList } from '@/api/workflow'
import { Popup, Picker, Search, List } from 'vant'
/* global plus*/
export default {
    name: 'businessTravelList',
    components: {
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Search.name]: Search,
        [List.name]: List,
        bimHeader
    },
    data() {
        return {
            list: [],
            showTime: false,
            currentYear: '', // 当前选择的年份
            keyWord: '', // 搜索关键字
            pageNo: 1, // 页数
            pageSize: 20, // 大小
            pageCount: 1,
            loading: false,
            finished: false
        }
    },
    filters: {
        dateFormat: dateTimeFormatCustom('YYYY.MM.DD')
    },
    computed: {
        yearList() {
            const year = new Date().getFullYear()
            this.currentYear = year
            const list = []
            for (let index = 0; index < 10; index++) {
                list.push(year - index)
            }
            return list
        },
        travelTypeOptions() {
            return Object.values(getMappingCfg()['WorkFlow.Personnel.BusinessTravel.Type'])
        }
    },
    created() {
        this.init()// 获取出差申请初始化
        plus.key.removeEventListener('backbutton', function() {})
        plus.key.addEventListener(
            'backbutton',
            function() {
                var ws = plus.webview.currentWebview()
                const opener = ws.opener()
                if (parent) {
                    opener.close()
                }
                if (ws.webviewPreload === true) {
                    plus.webview.hide(ws, 'auto')
                } else {
                    plus.webview.close(ws, 'auto')
                }
            },
            false
        )
    },
    methods: {
        // 初始化
        init() {
            this.getList(this.currentYear, this.pageNo, this.pageSize)
        },
        /** 选择年份 */
        onConfirmTime(value, index) {
            this.showTime = false
            this.currentYear = value
            // 确认年份后 更新列表
            this.pageNo = 1
            this.list = []
            this.getList(this.currentYear, this.pageNo, this.pageSize)
        },
        onLoad() {
            this.pageNo = this.pageNo + 1
            this.getList(this.currentYear, this.pageNo, this.pageSize)
        },
        onSearch() {
            if (!(this.keyWord && this.keyWord.trim())) return
            this.pageNo = 1
            this.list = []
            this.getList(this.currentYear, this.pageNo, this.pageSize)
        },
        async getList(yearStr, pageNo, pageSize) {
            try {
                plus.nativeUI.showWaiting()
                this.loading = true
                const params = {
                    year: yearStr,
                    keyWord: this.keyWord,
                    pageNo,
                    pageSize
                }
                const res = await travelList(params)
                this.pageNo = res.pageNo
                this.pageCount = res.pageCount
                this.list = [...this.list, ...res.entities]
                this.loading = false
                if (res.pageCount < this.pageNo) {
                    this.finished = true
                } else {
                    this.finished = false
                }
            } catch (error) {
                plus.nativeUI.toast(`${error.message}`)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        getDetail(id) {
            openWebview({
                url: 'businessTravelDetail.html',
                id: 'businessTravelDetail'
            },
            {},
            {
                detailObj: { id, detailType: 'list' }
            }
            )
        },
        getType(key) {
            let value
            this.travelTypeOptions.forEach(item => {
                if (item.key === key) {
                    value = item.value
                }
            })
            // const value = this.travelTypeOptions.find(v => v.key === key).value
            return value
        }
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
    // overflow:hidden;
}
.no-leave-block{
    position:relative;
    width:100%;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    color: $linkc1;
    // top: 50%;
    top:100px;
    // margin-top: -150px;
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
</style>
