/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-25 18:00:46
 */
/**
|--------------------------------------------------
| 描述: 通用表头组件
| 使用说明: 父级引用形式：import bimCellGroup1 from '@/component/bimCellGroup1/bimCellGroup1' 
| 引入: import bimHeaderMyInfo from '@/component/bimHeaderMyInfo/bimHeaderMyInfo'
| props接收bimHeaderMyInfoObj参数，数据类型Object
| 数据格式(例：父级pages/contact-book/_contactBook.vue bimHeaderMyInfoData): 
| bimHeaderMyInfoData: [
|    {
|       name: '姓名',
|       date: '日期',
|     }
| ]
|--------------------------------------------------
*/
<template>
    <div class="bim-header-info-1">
        <van-row>
            <van-col span="12">
                <slot name="left"></slot>
                <div v-if="!$slots.left" class="bim-header-info-1__name">{{ bimHeaderMyInfoObjName }}</div>
            </van-col>
            <van-col span="12">
                <slot name="right"></slot>
                <div v-if="!$slots.right" class="bim-header-info-1__date">{{ bimHeaderMyInfoObjDate }}</div>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import { Row, Col } from 'vant'
import { getUserInfo } from '@/common/app'
import { parseTime } from '@/common/utils'
export default {
    components: {
        [Row.name]: Row,
        [Col.name]: Col
    },
    props: {
        bimHeaderMyInfoObj: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        bimHeaderMyInfoObjName() {
            return this.bimHeaderMyInfoObj && this.bimHeaderMyInfoObj.name
                ? this.bimHeaderMyInfoObj.name
                : getUserInfo().name
        },
        bimHeaderMyInfoObjDate() {
            return this.bimHeaderMyInfoObj && this.bimHeaderMyInfoObj.date
                ? this.bimHeaderMyInfoObj.date
                : parseTime(new Date(), '{y}.{m}.{d}')
        }
    }
}
</script>
<style lang="scss">
.bim-header-info-1{
    background: url('../../assets/images/tab-bg.png') center/cover;
    // height: 50px;
    // line-height: 50px;
    font-size:14px;
    padding:20px;
    &__name{
        font-size:14px;
        color: white;
        line-height: 20px;
    }
    &__date{
        width: 100%;
        text-align: right;
        color: white;
    }
}
</style>
