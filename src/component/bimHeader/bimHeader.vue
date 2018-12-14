/*
 * @Author: BAICHONG 
 * @Last Modified by: LG
 * @Last Modified time: 2018-09-10 19:47:03
 */
/**
|--------------------------------------------------
| 描述: 通用标头组件
| 引入: import bimHeader from '@/component/bimHeader/bimHeader'
| 参数: 
| 说明: 
| 
| 
|--------------------------------------------------
*/
<template>
    <div class="bim-header pf">
        <van-nav-bar v-bind="$attrs" v-on="$listeners" @click-left="onClickLeft">
            <div slot="right" v-if="$slots.default">
                <slot></slot>
            </div>
        </van-nav-bar>
    </div>
</template>

<script>
import { NavBar } from 'vant'

export default {
    inheritAttrs: false,
    components: {
        [NavBar.name]: NavBar
    },
    props:{
        override: {
            type: Boolean,
            default: false
        },
        overrideBack: {
            type: Function,
            default: _ => {}
        }
    },
    methods: {
        // 回退事件
        onClickLeft() {
            !this.override ? this.back() : (this.overrideBack())
        },
        // 默认回退
        back() {
            var ws = plus.webview.currentWebview();
            if (ws.webviewPreload == true) {
                plus.webview.hide(ws, 'auto');
            } else {
                plus.webview.close(ws, 'auto');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.bim-header {
    height:46px;
    width:100%;
    z-index:100;
}
/deep/ .van-nav-bar__left{width:46px;height:46px;text-align:left;}
</style>
