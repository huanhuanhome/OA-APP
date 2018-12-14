/*
 * @Author: BAICHONG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-11 11:35:55
 */
/**
|--------------------------------------------------
| 首页 页面
|--------------------------------------------------
*/
<template>
    <div class="height100">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="height100">
            <div class="homeRecommendBlock pr">
                <div class="homeRecommendBlock__name p20">
                    <p class="homeRecommendBlock__name__name">{{ userName }}</p>
                    <p class="homeRecommendBlock__name__duty">{{ mainOrgName }}</p>
                    <p class="homeRecommendBlock__name__duty" v-if="isLeading">{{ positionName }}</p>
                </div>
                <compWeather class="homeRecommendBlock__weater"/>

                <!-- 待办,消息,领导在线 模块 -->
                <div class="bim-event-collect-position pa">
                    <bimEventCollect :msgCount="msgCount"></bimEventCollect>
                </div>
            </div>

            <!-- 滚动轮播 -->
            <!-- <bimNoticeBar :noticeObj='noticeDataObj'/> -->

            <!-- 企业知识库 通讯录 个人日常 -->
            <div class="mt5 homeModuleBlock">
                <bimModulGroup :bimModuleGroupObj="bimModuleGroupData"></bimModulGroup>
            </div>

            <!-- 轮播 -->
            <bimSwipeText :bimSwipeTextArray="bimSwipeTextData" v-if="isSwipeTextLoad"></bimSwipeText>
        </van-pull-refresh>
    </div>
</template>

<script>
import { PullRefresh } from 'vant'
import { getUserModuleCount } from '@/api/login'
import { getNoticeUserListByNumber } from '@/api/workflow'
import { getUserInfo } from '@/common/app'
import { parseTime } from '@/common/utils.js'
import bimModulGroup from '@/component/bimModulGroup/bimModulGroup'
import bimEventCollect from '@/component/bimEventCollect/bimEventCollect'
import bimSwipeText from '@/component/bimSwipeText/bimSwipeText'
import compWeather from '@/pages/home/compWeather'
import { quitApp } from '@/utils/tools'
export default {
    name: 'MainHome',
    components: {
        [PullRefresh.name]: PullRefresh,
        bimEventCollect,
        bimModulGroup,
        bimSwipeText,
        compWeather
    },
    data() {
        return {
            userName: '',
            userId: '',
            mainOrgName: '',
            isLeading: false,
            positionName: '',
            active: 0,
            msgCount: {},
            isLoading: false,
            bimModuleGroupData: {
                isTitle: false, // 是否显示标题
                title: '首页模块组',
                column: 3,
                rowumn: 2,
                isLine: false, // 带线分割的模块组
                bimMGDItems: [
                    [
                        {
                            iconUrl: require('@/assets/images/qiyezhishiku.png'),
                            iconUrlGray: require('@/assets/images/qiyezhishiku-gray.png'),
                            isTip: false,
                            title: '企业知识库',
                            url: ''
                        },
                        {
                            iconUrl: require('@/assets/images/gerenrichang.png'),
                            iconUrlGray: require('@/assets/images/gerenrichang-gray.png'),
                            isTip: false,
                            title: '个人日常',
                            url: ''
                        },
                        {
                            iconUrl: require('@/assets/images/tongxunlu.png'),
                            iconUrlGray: require('@/assets/images/tongxunlu-gray.png'),
                            isTip: false,
                            title: '通讯录',
                            url: 'contact-book.contactBook'
                        }
                    ]
                ]
            },
            bimSwipeTextData: [],
            isSwipeTextLoad: false
        }
    },
    created() {
        quitApp()
        const userInfo = getUserInfo()
        if (userInfo) {
            userInfo.name && (this.userName = userInfo.name)
            userInfo.mainOrgName && (this.mainOrgName = userInfo.mainOrgName)
            userInfo.id && (this.userId = userInfo.id)
            userInfo.positionName && (this.isLeading = !(userInfo.positionName === '员工'))
            userInfo.positionName && (this.positionName = userInfo.positionName)
        }
        this.getMsgCount()
        this.getSwipeText()
        setInterval(() => {
            this.getMsgCount()
        }, 30000)
        window.addEventListener('customEvent', _ => {
            this.getMsgCount()
        })
    },
    methods: {
        async onRefresh() {
            try {
                await Promise.all([this.getMsgCount(), this.getSwipeText()])
                plus.nativeUI.toast('刷新成功')// eslint-disable-line
                this.isLoading = false
            } catch (e) {
                plus.nativeUI.toast(e && e.message)// eslint-disable-line
            }
        },
        // 获取待办,消息,领导在线等消息数量
        async getMsgCount() {
            try {
                this.msgCount = await getUserModuleCount()
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)// eslint-disable-line
            } finally { }// eslint-disable-line
        },
        async getSwipeText() {
            try {
                const params = {
                    userId: this.userId,
                    startDate: '2018-01-01',
                    endDate: '2018-12-31',
                    number: 3
                }
                plus.nativeUI.showWaiting()// eslint-disable-line
                const res = await getNoticeUserListByNumber(params)
                if (res && res.length > 0) {
                    this.bimSwipeTextData = []
                    res.forEach((val) => {
                        this.bimSwipeTextData.push({
                            noticeId: val.businessId,
                            title: val.title,
                            content: val.content || '',
                            publisher: val.notifierOrgName,
                            date: parseTime(val.createDate, '{y}-{m}-{d} {h}:{i}:{s}')
                        })
                    })
                    setTimeout(() => {
                        this.isSwipeTextLoad = true
                    }, 300)
                } else {
                    this.isSwipeTextLoad = false
                }
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)// eslint-disable-line
            } finally { plus.nativeUI.closeWaiting() }// eslint-disable-line
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/c.css';
@import '../../assets/css/defalut-theme/color.scss';
//Home css
.height100{
    height: 100%;
}
.homeRecommendBlock{
    display: block;
    background-image: url('../../assets/images/home-recommbg.jpg');
    background-size: 100%;
    background-repeat: no-repeat;
    height:180px;
    &__name{
        position: relative;
        font-size:12px;
        color: $textc2;
        // line-height: 18px;
        &__name{
            font-size:14px;
            line-height:20px;
        }
        &__duty{
            line-height: 12px;
            font-size: 0.8em;
        }
    }
    &__weater{
        position: absolute;
        top: 20px;
        right: 20px;
    }
}
.homeModuleBlock{
    background: $bg2;
}
.bim-event-collect-position{
    width:100%;
    bottom:10px;
}
</style>