/*
 * @Author: BAICHONG 
 * @Date: 2018-08-02 11:35:18
 */
/**
|--------------------------------------------------
| 打卡模块路由页
|--------------------------------------------------
*/
<template>
    <div class="punchSign">
        <punchSign v-show="tabShow" ref="punchSign"></punchSign>
        <statistics v-if="!hasLeading" v-show="!tabShow"></statistics>


        <van-tabbar v-model="active" @change="tabChange" v-if="!hasLeading">
            <van-tabbar-item @click="handlePunch">
                <span slot-scope="props" :style="{color: props.active ? '#2776bf' : ''}">打卡</span>
                <img slot="icon" slot-scope="props" :src="props.active ? cardIcon.active : cardIcon.normal"/>
            </van-tabbar-item>

            <van-tabbar-item>
                <span slot-scope="props" :style="{color: props.active ? '#2776bf' : ''}">统计</span>
                <img slot="icon" slot-scope="props" :src="props.active ? statisticsIcon.active : statisticsIcon.normal"/>
            </van-tabbar-item>
        </van-tabbar>

    </div>
</template>
<script>

import { Tabbar, TabbarItem } from 'vant'
import punchSign from './punchSign.vue'
import statistics from './statistics.vue'
import { getUserInfo } from '@/common/app'
export default {
    components: {
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem,
        punchSign,
        statistics
    },
    data() {
        return {
            active: 0,
            tabShow: true,
            // 打卡图标切换
            cardIcon: {
                normal: require('@/assets/images/sign-card.png'),
                active: require('@/assets/images/sign-card-active.png')
            },
            statisticsIcon: {
                normal: require('@/assets/images/statistics.png'),
                active: require('@/assets/images/statistics-active.png')
            },
            hasLeading: getUserInfo()['hasLeading']
        }
    },
    methods: {
        handlePunch() {
            // 刷新位置信息
            this.$refs.punchSign.refurbish()
        },
        tabChange(index) {
            if (index === 0) {
                this.tabShow = true
            } else {
                this.tabShow = false
            }
        }
    }
}
</script>
<style>
.punchSign{
    width: 100%;
    height: 100%;
    background: white;
}
</style>
