/*
 * @Author: LG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-19 19:28:13
 */
/**
|--------------------------------------------------
| 领导在线模块
|--------------------------------------------------
*/
<template>
    <div class="leader-online pr">

        <bimHeader title="领导在线" left-arrow/>
        <div class="leader-online-block">
            <van-cell-group>
                <van-cell v-for="(item, index) in leaderItems" :key="index">

                    <template slot="title"  v-if="item.hasLine">
                        <i class="leader-online__fn-bg1 mr10 pr">{{ item.userName | firstName }}</i>
                        <span class="leader-online__title1">{{ item.userName }}</span>
                        <i class="leader-online__online">在线</i>
                    </template>
                    
                    <template slot="title" v-else>
                        <i class="leader-online__fn-bg2 mr10 pr">{{ item.userName | firstName }}</i>
                        <span class="leader-online__title2">{{ item.userName }}</span>
                        <i class="leader-online__noline">外出</i>
                    </template>

                </van-cell>
            </van-cell-group>
        </div>
    </div>
</template>
<script>
import { getOrgLevelSpecialTypeUserList } from '@/api/attendanceCount'
import { Cell, CellGroup, Icon } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
export default {
    components: {
        bimHeader,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Icon.name]: Icon
    },
    data() {
        return {
            leaderItems: []
        }
    },
    created() {
        this.init()
    },
    filters: {
        firstName(value) {
            return value.substr(0, 1)
        }
    },
    methods: {
        init() {
            plus.nativeUI.showWaiting()   // eslint-disable-line
            getOrgLevelSpecialTypeUserList()
                .then(res => {
                    if (res && res.length > 0) {
                        this.leaderItems = []
                        res.forEach((value, index) => {
                            this.leaderItems.push(value)
                        })
                    } else {
                        plus.nativeUI.toast("暂无数据") // eslint-disable-line
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting() // eslint-disable-line
                })
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.leader-online{
    width:100%;
    height:100%;
    overflow: hidden;
    background: $bg1;
    &__fn-bg1,&__fn-bg2{
        width: 36px;
        height: 36px;
        display: inline-block;
        top: 0px;
        text-align: center;
        font-size:14px;
        font-family: "SimHei";
        border-radius: 36px;
        line-height: 36px;
        font-style: normal;
        color: #fff;
    }
    &__fn-bg1{
        background: $bg5;
    }
    &__fn-bg2{
        background: $bg9;
    }
    &__title1,&__title2 {
        font-family: "SimHei";
        font-size:16px;
        line-height: 36px;
        display:inline-block;
    }
    &__title2{
        color: $textc6;
    }
    &__online,&__noline{
        height: 18px;
        display: inline-block;
        padding:0 6px;
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -9px;
        text-align: center;
        font-size: 0.6em;
        line-height:20px;
        color: $textc2;
        font-style: normal;
        border-radius: 10px;
        vertical-align: top;
        overflow: hidden;
    }
    &__online{
        background: $bg5;
    }
    &__noline{
        background: $bg9;
    }
}
.leader-online-block{margin-top:46px;}
</style>