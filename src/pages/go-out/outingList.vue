/*
 * @Author: BAICHONG 
 * @Date: 2018-09-18 09:44:28 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-10 15:31:40
 */
/**
|--------------------------------------------------
| 外出列表页
|--------------------------------------------------
*/
<template>
    <div class="leave-list">
        <bimHeader 
            title="外出记录"
            left-arrow
            right-text="2018"
            @click-right="onClickRight"
        >
            <div class="btn-select btn-select--noborder" solt="right" style="top:6px;">
                <button class="btn-select__normal">
                    <span class="btn-select__text">{{ year }}</span>
                    <i class="iconfont icon-unfold btn-select__icon btn-select__icon--blue"></i>
                </button>
            </div>
        </bimHeader>
        <div class="leave-list-block" style="padding-top:46px">
            <van-search placeholder="请输入事由查询" show-action v-model="params.filter">
                    <div slot="action" @click="onSearch">搜索</div>
                </van-search>
            <div class="gooutlist-container">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    @load="onLoad"
                >   
                    <template v-if="Object.keys(entities).length > 0">
                        <ul class="g-list-1 g-list-1--type1">
                            <li v-for="item in entities" :key="item.id" @click="openDetail(item)">
                                <span class="type">外</span>
                                <span class="hours">{{item.cumulativeLength }}小时</span>
                                <p class="title">外出日期: {{item.outingStartDate | format}}</p>
                                <p class="more clearfix" style="width:calc(100% - 50px);">
                                    <span class="p-ellipsis" style="width:100%;">外出事由： {{ item.outingCause }}</span>
                                </p>
                            </li>
                        </ul>
                    </template>
                    <template v-else>
                        <div  class="no-leave-block">
                            <i class="iconfont icon-emoji icon-wh"></i>
                            <p>您在{{ year }}年没有外出数据</p>
                        </div>
                    </template>
                </van-list>
            </div>
        </div>
        <template>
            <van-popup v-model="isShow" position="bottom">
                <van-picker
                    value-key="name"
                    show-toolbar
                    :columns="asActions" 
                    @cancel="isShow = false"
                    @confirm="onSelect"
                />
            </van-popup>
        </template>
    </div>
</template>

<script>
import bimHeader from '@/component/bimHeader/bimHeader'
import goOutListItem from './goOutListItem'
import { parseTime } from '@/common/utils.js'
import { getOutingListByParameters } from '@/api/workflow'
import { openWebview } from '@/utils/webview'
import { List, Popup, Picker, Search } from 'vant'
import { dateTimeFormatCustom } from '@/common/utils'
/* global plus */
export default {
    components: {
        [List.name]: List,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Search.name]: Search,
        bimHeader,
        goOutListItem
    },
    filters: {
        format: dateTimeFormatCustom('YYYY-MM-DD')
    },
    data() {
        return {
            cws: plus.webview.currentWebview(),
            year: 2018,
            asActions: [],
            isShow: false, // 弹出下拉菜单
            entities: [],
            loading: false,
            params: {
                startDate: '',
                endDate: '',
                filter: '',
                pageNo: 0,
                pageSize: 10
            },
            pageCount: 0,
            finished: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.getYearList()
        },
        getYearList() {
            this.year = +parseTime(new Date(), '{y}')
            for (var i = 0; i <= 10; i++) {
                this.asActions.push({ name: this.year - i, yearId: (this.year - i + '-01-01&') + (+this.year - i) + '-12-31' })
            }
        },
        onClickRight() {
            this.isShow = true
        },
        onSelect(item) {
            this.year = item.name
            this.params.startDate = item.yearId.split('&')[0]
            this.params.endDate = item.yearId.split('&')[1]
            this.params.pageNo = 0
            this.entities = []
            this.finished = false
            this.isShow = false
            this.onLoad()
        },
        async onLoad() {
            try {
                this.params.pageNo++
                plus.nativeUI.showWaiting()
                const res = await getOutingListByParameters(this.params)
                this.pageCount = res.pageCount
                this.loading = false
                if (this.params.pageNo >= res.pageCount) {
                    this.finished = true
                }
                this.entities = [...this.entities, ...res.entities]
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            } finally { plus.nativeUI.closeWaiting() }
        },
        openDetail(item) {
            item.businessId = item.id
            openWebview({
                url: 'goOutDetail.html',
                id: 'goOutDetail'
            }, {}, {
                detailObj: item
            })
        },
        onSearch() {
            if (!(this.params.filter && this.params.filter.trim())) return
            this.params.pageNo = 0
            this.entities = []
            this.onLoad()
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
@import '../../assets/font/iconfont.css';
.gooutlist{
    .gooutlist-content{
        .gooutlist-container{
            // background: white;
            padding-left: 10px;
            padding-right: 10px;
        }
    }
    .empty{
        text-align: center;
        height: 50px;
        line-height: 50px;
        font-size: 13px;
    }
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