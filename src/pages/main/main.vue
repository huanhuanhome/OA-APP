<template>
    <div>
        <van-tabbar v-model="active">
            <!-- 首页 -->
            <van-tabbar-item @click="showWindow(subpages[0])">
                <span slot-scope="props" :style="{color: props.active ? activeColor : ''}">首页</span>
                <img slot="icon" slot-scope="props" :src="props.active ? homeIcon.active : homeIcon.normal">
            </van-tabbar-item>
            <!-- 应用 -->
            <van-tabbar-item @click="showWindow(subpages[1])">
                <span slot-scope="props" :style="{color: props.active ? activeColor : ''}"> 应用</span>
                <img slot="icon" slot-scope="props" :src="props.active ? applicationIcon.active : applicationIcon.normal">
            </van-tabbar-item>
            <!-- 党工团 -->
            <van-tabbar-item @click="showWindow(subpages[2])">
                <span slot-scope="props" :style="{color: props.active ? activeColor : ''}">党工团</span>
                <img slot="icon" slot-scope="props" :src="props.active ? leagueIcon.active : leagueIcon.normal">
            </van-tabbar-item>
            <!-- 我 -->
            <van-tabbar-item @click="showWindow(subpages[3])">
                <span slot-scope="props" :style="{color: props.active ? activeColor : ''}">我</span>
                <img slot="icon" slot-scope="props" :src="props.active ? myIcon.active : myIcon.normal">
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
/* global plus */
import { Tabbar, TabbarItem } from 'vant'
import { fire } from '@/utils/envent.js'
export default {
    name: 'Main',
    components: {
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem
    },
    data() {
        return {
            backButtonPress: 0,
            self: plus.webview.currentWebview(),
            subpages: ['./home.html', './application.html', './league.html', './my.html'],
            subpage_style: {
                top: '0px',
                bottom: '50px',
                overflow: 'hidden'
            },
            activeTab: '',
            aniShow: {},
            active: 0,
            activeColor: '#2776bf',
            homeIcon: {
                normal: require('../../assets/images/home.png'),
                active: require('../../assets/images/home-active.png')
            },
            leagueIcon: {
                normal: require('../../assets/images/league.png'),
                active: require('../../assets/images/league-active.png')
            },
            applicationIcon: {
                normal: require('../../assets/images/application.png'),
                active: require('../../assets/images/application-active.png')
            },
            myIcon: {
                normal: require('../../assets/images/my.png'),
                active: require('../../assets/images/my-active.png')
            }
        }
    },

    created() {
        plus.nativeUI.showWaiting()
        this.activeTab = this.subpages[0]
        for (let i = 0; i < this.subpages.length; i++) {
            const temp = {}
            const sub = plus.webview.create(this.subpages[i], this.subpages[i], this.subpage_style)
            if (i > 0) {
                sub.hide()
            } else {
                temp[this.subpages[i]] = 'true'
                Object.assign(this.aniShow, temp)
                sub.addEventListener('loaded', _ => plus.nativeUI.closeWaiting(), false)
            }
            this.self.append(sub)
        }
    },
    mounted() {
        // 动态改变webview的侧滑返回功能：
        const wv = plus.webview.currentWebview()
        // 关闭侧滑返回功能
        wv.setStyle({ 'popGesture': 'none' })
    },
    methods: {
        showWindow(item) {
            if (this.activeTab === item) {
                return
            }
            // 若为iOS平台或非首次显示，则直接显示
            if (plus.os.name !== 'Android' || this.aniShow[item]) {
                plus.webview.show(item)
            } else {
                // 否则，使用fade-in动画，且保存变量
                var temp = {}
                temp[item] = 'true'
                Object.assign(this.aniShow, temp)
                plus.webview.show(item, 'fade-in', 300)
            }
            // 隐藏当前;
            plus.webview.hide(this.activeTab)
            // 更改当前活跃的选项卡
            this.activeTab = item
            if (item === './league.html') {
                const indexWebview = plus.webview.getWebviewById(item)
                fire(indexWebview, 'customEvent')
            }
        }
    }
}
</script>

<style lang="scss">
.van-hairline--bottom::after{
    border-color: #ccc;
}
</style>