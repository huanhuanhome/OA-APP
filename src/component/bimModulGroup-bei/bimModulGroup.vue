/*
 * @Author: BAICHONG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-08-07 10:33:52
 */
/**
|--------------------------------------------------
| 主页 图标+描述 组件
|--------------------------------------------------
*/
<template>
    <div>
        <div class="bim-modul-group__title" v-if="title">
            <span class="title_span">
                {{title}}
            </span>
        </div>
        <van-row type="flex" :gutter="colGutter" justify="space-around">
            <van-col 
                :span="colSpan"
                v-for="(item,index) in column"
                :key="index"
            >
                <div class="bim-modul-group" @click="$emit('routerChange', 'PunchSign')">
                    <div class="bim-modul-group__img">
                        <img src="../../assets/images/icon.png" alt="">
                    </div>
                    <p class="bim-modul-group__desc">{{item.title}}</p>
                </div>
            </van-col>
        </van-row>

    </div>
</template>

<script>
import { Row, Col } from 'vant'
export default {
    components: {
        [Row.name]: Row,
        [Col.name]: Col
    },
    props: {
        column: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: '考勤管理'
        },
        moduleName: {
            type: String,
            default: ''
        }
    },
    computed: {
        colSpan() {
            return this.column.length >= 3 ? 6 : this.column >= 5 ? 5 : 8
        },
        colGutter() {
            return this.column.length >= 3 ? 5 : 15
        }
    },
    data() {
        return {
            col: 'value'
        }
    }
}
</script>

<style lang="scss">
.bim-modul-group__title{
    padding: 0px 0px 10px 0px;
    &_span{
        color: $primary;
        font-weight: 700;
        font-size: 15px;
    }
}
.bim-modul-group{
    width: 100%;
    height: 70px;
    background-color: white;
    &__img{
        width:100%;
        text-align: center;
        padding-top: 20%;
    }
    &__desc{
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        text-align: center;
        font-size: 14px;
        color: $primary;
    }
}
</style>