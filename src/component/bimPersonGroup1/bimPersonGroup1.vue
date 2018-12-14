/*
 * @Author: LG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-25 11:12:51
 */
/**
|--------------------------------------------------
|  描述:人员公共列表公共组件一。
|  使用说明: 
|  vantCell单元格组件的二次封装,父级引用形式：import bimPersonGroup1 from '@/component/bimPersonGroup1/bimPersonGroup1'
|  props接收bimPersonGroup1Array参数，数据类型Array
|  数据格式(例：父级通讯录部门列表pages/contact-book/_contactBook.vue bimPersonGroup1Data1): 
|  bimPersonGroup1Data1: [
|     {
|        name: '姓名',
|        iconUrl: require('@/assets/images/姓氏'),
|        value: '右侧内容',
|      }
|  ]
|--------------------------------------------------
*/
<template>
    <div class="bim-person-group1">
        <van-cell-group>
        <van-cell 
            v-for="(item, index) in bimPersonGroup1Array" 
            :value="item.value" 
            :key="index" 
            @click="openWindow(item)">

            <template slot="title">
                <i class="bim-person-group1__fn-bg mr10 pr">{{ item && item.user && item.user.name | firstName }}</i>
                <span class="bim-person-group1__title">{{ item && item.user && item.user.name }}</span>
                <i class="bim-person-group1__mobile" @click.stop="dialing(item)"><img src="../../assets/images/contact-book-mobile.png"/></i>
            </template>

        </van-cell>
        </van-cell-group>
    </div>
</template>
<script>
/* global plus */
import { openWebview } from '@/utils/webview'
import { Cell, CellGroup, Icon } from 'vant'
export default {
    components: {
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Icon.name]: Icon
    },
    props: {
        bimPersonGroup1Array: {
            type: Array,
            default: _ => []
        }
    },
    filters: {
        firstName(value) {
            return value && value.substr(0, 1)
        }
    },
    methods: {
        emitParentPage(data) {
            const personObj = {
                orgId: data.nodeId,
                id: data.id
            }
            this.$emit('bimCellGroup2Obj', personObj)
        },
        dialing(value) {
            plus.device.dial(value.user.mobile, false)
        },
        openWindow(item) {
            const personObj = {
                orgId: item.orgId,
                userId: item.userId,
                positionCode: item.positionCode
            }
            openWebview({
                url: './contact-book.contactBookDetail.html',
                id: 'contact-book.contactBookDetail'
            }, {},
            {
                personDetail: personObj
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/c.css';
@import '../../assets/css/defalut-theme/color.scss';
.bim-person-group1{
    &__fn-bg{
        width: 36px;
        height: 36px;
        display: inline-block;
        top: 0px;
        text-align: center;
        background: $bg5;
        color: #fff;
        font-size:14px;
        font-family: "SimHei";
        border-radius: 36px;
        line-height: 36px;
        font-style: normal;
    }
    &__title {
        font-family: "SimHei";
        font-size:16px;
        line-height: 36px;
    }
    &__mobile {
        width: 57px;
        height: 57px;
        display: block;
        position: absolute;
        right: 0px;
        top: 0px;
        text-align: center;
        img {
            width: 18px;
            vertical-align: top;
            position: relative;
            top: 19px;
        }
    }
}
</style>