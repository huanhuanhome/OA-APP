/*
 * @Author: LG
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-12 14:26:10
 */
/**
|--------------------------------------------------
| HOME页事项汇总公共组件，包含消息提醒功能(红点)
|--------------------------------------------------
*/
<template>
    <div class="bim-event-collect">
        <van-row type="flex" justify="center">
            <!-- 消息 -->
            <van-col span="5">
                <div class="bim-event-collect__icon" @click="openWindow()">
                    <img src="@/assets/images/bim-event-collect-xiaoxi.png">
                </div>
                <p class="bim-event-collect__title bim-event-collect__title--unopen">消息</p>
            </van-col>
            <!-- 待办 -->
            <van-col span="5">
                <div class="bim-event-collect__icon" @click="openWindow('toDoList')">
                    <img src="@/assets/images/bim-event-collect-daiban.png">
                    <div class="bim-event-collect__msg" v-if="msgCount.taskNumber > 0">{{ msgCount.taskNumber }}</div>
                    <!-- <div class="bim-event-collect__lit"/> -->
                    <!-- 待开放 -->
                    <!-- <div class="bim-event-collect__msg" v-if="msgCount.informationNumber > 0">{{ msgCount.informationNumber }}</div>
                    <div class="bim-event-collect__lit"/> -->
                </div>
                <p class="bim-event-collect__title">待办</p>
            </van-col>
            <!-- 提醒 -->
            <van-col span="5">
                <div class="bim-event-collect__icon" @click="openWindow('message')">
                    <img src="@/assets/images/bim-event-collect-tixing-bei.png">
                    <div class="bim-event-collect__msg" v-if="msgCount.remindNumber > 0">{{ msgCount.remindNumber }}</div>
                    <!-- <div class="bim-event-collect__lit"/> -->
                </div>
                <p class="bim-event-collect__title bim-event-collect__title--unopen">提醒</p>
            </van-col>
            <!-- 认领 -->
            <van-col span="5">
                <div class="bim-event-collect__icon" @click="openWindow()">
                    <img src="@/assets/images/bim-event-collect-jinkuanrenling.png">
                </div>
                <p class="bim-event-collect__title bim-event-collect__title--unopen">进款认领</p>
            </van-col>
            <!-- 领导在线 -->
            <van-col span="5">
                <div class="bim-event-collect__icon" @click="openWindow('leader-online.leaderOnline')">
                    <img src="@/assets/images/bim-event-collect-lingdaozaixian.png">
                    <div class="bim-event-collect__msg" v-if="msgCount.leadingOnlineNumber > 0">{{ msgCount.leadingOnlineNumber }}</div>
                </div>
                <p class="bim-event-collect__title">领导在线</p>
            </van-col>
        </van-row>
    </div>
</template>
<script>
import { openWebview } from '@/utils/webview'
import { Row, Col, Toast } from 'vant'
/* global plus */
export default {
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Toast.name]: Toast
    },
    props: {
        msgCount: {
            type: Object,
            default: _ => ({})
        }
    },
    methods: {
        // 打开页面
        openWindow(url) {
            if (url) {
                openWebview({
                    url: url + '.html',
                    id: url
                })
            } else {
                plus.nativeUI.toast('模块暂未开放')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/defalut-theme/color.scss';
.bim-event-collect{
    font-size:12px;
    color:#fff;
    &__title{
        color: $textc2;
        text-align: center;
        line-height: 28px;
    }
    // 未开放
    .bim-event-collect__title--unopen{
        color: #A5A3A4;
    }
    &__icon{
        width:42px;
        margin: 0 auto;
        position: relative;
        img{width:100%;}
    }
    &__msg,&__lit{
        width:16px;
        height:16px;
        font-size: 0.8em;
        line-height: 16px;
        text-align: center;
        color: $textc2;
        border-radius:8px;
        background: $bg3;
        position: absolute;
        right:-5px;
        top:0px;
    }
    &__lit{
        width:8px;
        height:8px;
        right:0px;
        top:5px;
    }
}
</style>
