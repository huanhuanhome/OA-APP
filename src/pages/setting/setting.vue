/*
 * @Author: gl
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-15 13:47:48
 */
/**
|--------------------------------------------------
| 设置列表
|--------------------------------------------------
*/
<template>
    <div class="setting pr">
        <bimHeader
            title="设置"
            left-arrow
        />
        <div class="collapse-block">
            <van-cell-group class="mt10">
                <van-cell>
                    <ul class="g-list-2">
                        <li @click="switchEnv"><span class="label">版本信息</span>{{state}}</li>
                        <li @click="navToGod" v-if="isDebug"><span class="label">God Mod</span></li>
                    </ul>
                </van-cell>

                <van-cell @click="logOut()">
                    <template slot="title">
                        <h3 class="heading-title3">退出登录</h3>
                    </template>
                </van-cell>
            </van-cell-group>
        </div>
    </div>
</template>
<script>
import { Cell, CellGroup, Dialog } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
import { clearUserData, isDebugVersion, disableDebugVersion, enableDebugVersion } from '@/common/app'
import { fire } from '@/utils/envent.js'
import { openWebview } from '@/utils/webview'
/* global plus */
export default {
    components: {
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Dialog.name]: Dialog,
        bimHeader
    },
    data() {
        return {
            mySelf: plus.webview.currentWebview(),
            counter: 0, // 计数
            state: '', // 状态
            appVer: '', // 版本
            isDebug: isDebugVersion()
        }
    },
    created() {
        this.initAppVer()
    },
    methods: {
        // init
        initAppVer() {
            plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
                this.appVer = wgtinfo.version
                isDebugVersion() ? (this.state = this.appVer + '(测试)') : (this.state = this.appVer)
            })
        },
        // 切换环境
        switchEnv() {
            this.counter++
            setTimeout(_ => (this.counter = 0), 3000)
            if (this.counter > 1 && this.counter === 9) {
                if (isDebugVersion()) {
                    plus.nativeUI.confirm('是否要切换到正常模式', e => {
                        if (e.index === 1) {
                            disableDebugVersion()
                            this.state = this.appVer
                            this.isDebug = false
                        }
                        this.counter = 0
                    }, '切换模式', ['否', '是'])
                } else {
                    plus.nativeUI.confirm('是否要切换到测试模式', e => {
                        if (e.index === 1) {
                            enableDebugVersion()
                            this.state = this.appVer + '(测试)'
                            this.isDebug = true
                        }
                        this.counter = 0
                    }, '切换模式', ['否', '是'])
                }
            }
        },
        // 跳转切换环境页面
        navToGod() {
            openWebview({ url: 'god.html', id: 'god' })
        },
        logOut() {
            Dialog.confirm({
                title: '退出登录',
                message: '您是否确定退出当前登录，重新登录?'
            }).then(() => {
                const wvs = plus.webview.all()
                plus.nativeUI.showWaiting()
                clearUserData()
                wvs.forEach((item) => {
                    if (item.id !== 'login' && item.id !== 'setting') {
                        plus.webview.close(item)
                    }
                })
                plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
                    const entry = fs.root
                    entry.removeRecursively(function() {
                        console.log('Remove Succeed:' + entry.fullPath)
                    }, function(event) {
                        console.log('Remove Cache/Code:' + entry.fullPath + ':' + event.code)
                    })
                }, function(event) {
                    console.log('Remove Cache:' + event.message)
                })
                const loginWebview = plus.webview.getWebviewById('login')
                fire(loginWebview, 'customEvent')
                setTimeout(() => {
                    plus.nativeUI.closeWaiting()
                    plus.webview.close(this.mySelf, 'auto')
                }, 1000)
            })
                .catch(() => {
                    console.log('no')
                })
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
.setting{
    width: 100%;
    height: 100%;
    .g-list-2 > li:active{background: #ccc;}
}
.heading-title3{text-align: center;}

</style>