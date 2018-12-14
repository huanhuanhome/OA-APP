/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-11 10:20:24
 */
/**
|--------------------------------------------------
| 待办
|--------------------------------------------------
*/
<template>
    <div class="to-do-list">
        <bimHeader 
            title="待办"
            left-arrow
            override
            :overrideBack="overrideBack"
        />
        <!-- top start -->
        <div class="to-do-list--title">
            <bimHeaderTab>
                <div class="to-do-list__left" slot="left" @click="todolistActive">
                    <span class="to-do-list__bot_bor" 
                    :class="[isTodolist ? 'todolist--bottom-white' : '']">
                    待办({{toDoListCount}})</span>
                </div>
                <div class="to-do-list__right" slot="right" @click="completedActive">
                    <span class="to-do-list__bot_bor" 
                    :class="[!isTodolist ? 'todolist--bottom-white' : '']">
                    已完成</span>
                </div>
            </bimHeaderTab>
        </div>
        <!-- top end -->

        <div class="to-do-list__container pa content--top">

            <!-- todolist start -->
            <div v-show="isTodolist">
                <van-list
                    v-model="toDoListLoading"
                    :finished="toDoListFinished"
                    @load="toDoListOnLoad"
                >
                    <div class="list__container">
                        <div class="list__item"
                            v-for="(item,index) in toDoListEntities" 
                            :key="item.id"
                            @click="handleTodolist(item, index)"
                        >
                            <div class="list__item_mark">
                                <div class="item__round">
                                    <span class="round__text">{{TO_DO_LIST[item.subject] || TO_DO_LIST.DEFAULT}}</span>
                                </div>
                            </div>
                            <div class="list__item_detail">
                                <div class="detail__top">
                                    <div class="detail__name">{{item.bizTitle||item.processName}}({{item.owner}})</div>
                                    <div class="detail__state" :style="{color: WORK_FLOW_STATE[item.bizStatus+'_COLOR']}">{{WORK_FLOW_STATE[item.bizStatus]}}</div>
                                </div>
                                <div class="detail__bottom">
                                    <div class="detail__company">{{item.publishOrgName}}</div>
                                    <div class="detail__date">{{item.proPublishTime | formatDate}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </div>
            <!-- todolist end -->

            <!-- completed start -->
            <div v-show="!isTodolist">
                <van-list
                    v-model="completedLoading"
                    :finished="completedFinished"
                    @load="completedOnLoad"
                    ref="completed"
                >
                    <div class="list__container">
                        <div class="list__item" 
                            v-for="(item,index) in completedEntities" 
                            :key="item.id"
                            @click="handleCompleted(item, index)">
                            <div class="list__item_mark">
                                <div class="item__round">
                                    <span class="round__text">{{TO_DO_LIST[item.subject] || TO_DO_LIST.DEFAULT}}</span>
                                </div>
                            </div>
                            <div class="list__item_detail">
                                <div class="detail__top">
                                    <div class="detail__name">{{item.bizTitle||item.processName}}({{item.owner}})</div>
                                    <div class="detail__state" :style="{color: WORK_FLOW_STATE[item.bizStatus+'_COLOR']}">{{WORK_FLOW_STATE[item.bizStatus]}}</div>
                                </div>
                                <div class="detail__bottom">
                                    <div class="detail__company">{{item.publishOrgName}}</div>
                                    <div class="detail__date">{{item.proPublishTime | formatDate}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </div>
            <!-- completed end -->
        </div>
    </div>
</template>

<script>
import bimHeaderTab from '@/component/bimHeaderMyInfo/bimHeaderTab'
import bimHeader from '@/component/bimHeader/bimHeader'
import { List } from 'vant'
import { todoList, allHistoryList, todoCount, getTodoDetail } from '@/api/workflow'
import { TO_DO_LIST, WORK_FLOW_STATE } from '@/common/globalConstCfg'
import { dateTimeFormatCustom } from '@/common/utils'
import { openWebview } from '@/utils/webview'
import { fire } from '@/utils/envent.js'
/* global plus */
export default {
    name: 'ToDoList',
    components: {
        [List.name]: List,
        bimHeaderTab,
        bimHeader
    },
    created() {
        // 获取待办消息数量
        this.getTodoCount()
        window.addEventListener('customEvent', _ => {
            this.getTodoCount()
            this.toDoListEntities = []
            this.completedEntities = []
            this.toDoListParams.pageNo = 1
            this.completedParams.pageNo = 1
            this.toDoListOnLoad()
            this.completedOnLoad()
        })
    },
    data() {
        return {
            isTodolist: true,
            // todolist参数
            toDoListParams: {
                pageSize: 10,
                pageNo: 1
            },
            toDoListCount: 0,
            toDoListLoading: false,
            toDoListFinished: false,
            toDoListEntities: [], // 待办对象数组
            // completed参数
            completedParams: {
                pageSize: 10,
                pageNo: 1
            },
            completedCount: 0,
            completedLoading: false,
            completedFinished: false,
            completedEntities: [], // 已完成对象数组
            TO_DO_LIST, // todolist常量
            WORK_FLOW_STATE // 工作流状态常量
        }
    },
    filters: {
        formatDate: dateTimeFormatCustom()
    },
    methods: {
        // 待办消息数量
        getTodoCount() {
            plus.nativeUI.showWaiting()
            todoCount()
                .then(res => {
                    this.toDoListCount = res
                    // this.todolistActive()
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => { plus.nativeUI.closeWaiting() })
        },
        // 获取待办数据
        toDoListOnLoad() {
            plus.nativeUI.showWaiting()
            const params = {
                pageSize: this.toDoListParams.pageSize,
                pageNo: this.toDoListParams.pageNo++
            }
            todoList(params)
                .then(res => {
                    this.toDoListEntities = [...this.toDoListEntities, ...res.entities]
                    this.toDoListLoading = false
                    if (res.pageCount < this.toDoListParams.pageNo) {
                        this.toDoListFinished = true
                    }
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        // 获取已完成数据
        completedOnLoad() {
            plus.nativeUI.showWaiting()
            const params = {
                pageSize: this.completedParams.pageSize,
                pageNo: this.completedParams.pageNo++
            }
            allHistoryList(params)
                .then(res => {
                    this.completedEntities = [...this.completedEntities, ...res.entities]
                    this.completedLoading = false
                    if (res.pageCount < this.completedParams.pageNo) {
                        this.completedFinished = true
                    }
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        // allHistoryList
        todolistActive() {
            this.isTodolist = true
            this.toDoListEntities = []
            // this.completedEntities = []
            this.toDoListParams.pageNo = 1
            this.toDoListFinished = false
            // this.completedParams.pageNo = 1
            // !this.toDoListFinished &&
            this.toDoListOnLoad()
        },
        completedActive() {
            this.isTodolist = false
            // !this.completedFinished &&
            this.completedParams.pageNo = 1
            this.completedEntities = []
            this.completedFinished = false
            this.completedOnLoad()
        },
        // 处理待办点击
        handleTodolist(item, index) {
            plus.nativeUI.showWaiting()
            getTodoDetail(item.id)
                .then(res => {
                    if (res && res.republish && item.subject === 'Notice') {
                        plus.nativeUI.toast('对不起 通知公告请在Web端发起，谢谢！')
                        return
                    }
                    if (res && res.republish) { //   拒绝-重新申请
                        if (item.subject === 'CancelLeave') {
                            res.subject = 'CancelLeave'
                            openWebview({
                                url: 'applyLeave.html',
                                id: 'applyLeave'
                            },
                            {},
                            {
                                detailObj: res
                            })
                            return
                        }
                        openWebview({
                            url: 'apply' + item.subject + '.html',
                            id: 'apply' + item.subject
                        },
                        {},
                        {
                            detailObj: res
                        })
                    } else {
                        openWebview({ // 处理
                            url: 'approve' + item.subject + '.html',
                            id: 'approve' + item.subject
                        }, {},
                        {
                            detailObj: res
                        })
                    }
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => { plus.nativeUI.closeWaiting() })
        },
        // 已完成跳详情
        handleCompleted(item, index) {
            const subjectToLow = item.subject
            item.subjectLowcase = this.replaceStr(subjectToLow)
            openWebview({
                url: item.subjectLowcase + 'Detail.html',
                id: item.subjectLowcase + 'Detail'
            },
            {},
            {
                detailObj: item
            })
        },
        overrideBack() {
            const mySelf = plus.webview.currentWebview()
            const openerWebview = mySelf.opener()
            fire(openerWebview, 'customEvent')
            plus.webview.close(mySelf, 'auto')
        },
        replaceStr(str) {
            var strTemp = '' // 新字符串
            for (var i = 0; i < str.length; i++) {
                if (i === 0) {
                    strTemp += str[i].toLowerCase() // 第一个
                    continue
                }
                if (str[i] === ' ' && i < str.length - 1) { // 空格后
                    strTemp += ' '
                    strTemp += str[i + 1].toLowerCase()
                    i++
                    continue
                }
                strTemp += str[i]
            }
            return strTemp
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/css/defalut-theme/color.scss';
.todolist--bottom-white{
    border-bottom-style: solid;
}
.to-do-list{
    -webkit-overflow-scrolling: touch;
    .to-do-list--title{
        position: fixed;
        z-index: 1;
        width: 100%;
        top: 46px;
        left: 0px;
        .to-do-list__left {
            color: white;
            text-align: center;

            .to-do-list__bot_bor{
                // border-bottom-style: solid;
                border-bottom-width: 1px;
                border-bottom-color: #FFF;
                display: inline-block;
                height:34px;
            }
        }
        .to-do-list__right {
            color: white;
            text-align: center;
            
            .to-do-list__bot_bor{
                // border-bottom-style: solid;
                border-bottom-width: 1px;
                border-bottom-color: #FFF;
                display: inline-block;
                height:34px;
            }
        }
    }
    &__container {
        top: 96px;

        .list__container{
            padding: 0 15px 0 15px;
            background: $bg2;
            .list__item{
                display: flex;
                height: 70px;
                border-bottom: 1px solid #ebebeb;
                padding: 10px 0 10px 0;
                &_mark{
                    margin-top: 10px;
                    margin-right: 10px;
                    .item__round{
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border: 2px solid #276ab0;
                        .round__text{
                            line-height: 53px;
                            text-align: center;
                            display: block;
                            font-size: 26px;
                            color: #276ab0;
                        }
                    }
                }
                &_detail{
                    width: calc(100% - 64px); // ios样式兼容
                    line-height: 25px;
                    padding-top: 12px;
                    padding-bottom: 12px;
                    font-size: 14px;
                    .detail__top{
                        display: flex;
                        .detail__name{
                            width: calc(100% - 60px);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .detail__state{
                            width: 60px;
                            text-align: right;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }

                    .detail__bottom{
                        display: flex;
                        
                        .detail__company{
                            width: 50%;
                            color: #9b9a9a;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .detail__date{
                            width: 50%;
                            text-align: right;
                            color: #9b9a9a;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }
    }
}
</style>