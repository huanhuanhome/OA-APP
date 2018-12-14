/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-08-13 17:21:32
 */
/**
|--------------------------------------------------
| 描述:loading组件
| 引入: import bimLoading from '@/component/bimLoading/bimLoading'
| 参数: 没有参数
| 说明: 全局注册,挂载Vue.prototype下
|       this.ShowLoading() 打卡全局loading
|       this.CloseLoading() 关闭全局loading
|--------------------------------------------------
*/
<template>
    <div class="bim-loading" v-show="loading">
        <van-loading class="bim-loading__load" type="spinner" color="white"/>
    </div>
</template>

<script>
import { Loading } from 'vant'
export default {
    components: {
        [Loading.name]: Loading
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        showLoading() {
            this.loading = true
        },
        closeLoading() {
            this.loading = false
        }
    }
}
</script>
<style lang="scss">
.bim-loading {
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background-color:rgba(0,0,0, 0.3);
    &__load {
        position: absolute;
        top: 50%;
        left:50%;
        margin-left: -35px;
        display: inline-block;
        padding: 15px 20px 15px 20px;
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0.6);
    }
}
</style>

