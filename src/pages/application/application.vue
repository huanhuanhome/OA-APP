/*
 * @Author: BAICHONG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-08 17:51:57
 */
/**
|--------------------------------------------------
| 应用 页面
|--------------------------------------------------
*/
<template>
    <div class="application">
        <div class="application__top">
            <bimHeaderMyInfo></bimHeaderMyInfo>
        </div>
        <div class="application__container">
            <div class="homeModuleBlock">
                <bimModulGroup :bimModuleGroupObj="bimModuleGroupData"></bimModulGroup>
            </div>
            <div class="homeModuleBlock mt10">
                <bimModulGroup :bimModuleGroupObj="bimModuleGroupData1"></bimModulGroup>
            </div>
        </div>
    </div>
</template>

<script>
import { Tabbar, TabbarItem, Row, Col } from 'vant'
import bimModulGroup from '@/component/bimModulGroup/bimModulGroup'
import bimHeaderMyInfo from '@/component/bimHeaderMyInfo/bimHeaderMyInfo'
import { quitApp } from '@/utils/tools'
export default {
    name: 'MainApply',
    components: {
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem,
        bimModulGroup,
        [Row.name]: Row,
        [Col.name]: Col,
        bimHeaderMyInfo
    },
    created() {
        quitApp()
    },
    data() {
        return {
            active: 0,
            bimModuleGroupData: {
                isTitle: true, // 是否显示标题
                title: '考勤管理',
                column: 5, // 列
                rowumn: 2, // 行
                isLine: false, // 带线分割的模块组
                bimMGDItems: [
                    [
                        {
                            iconUrl: require('@/assets/images/sign-card-icon.png'),
                            iconUrlGray: require('@/assets/images/sign-card-icon-gray.png'),
                            isTip: false,
                            title: '打卡',
                            url: 'punchSignModul'
                        },
                        {
                            iconUrl: require('@/assets/images/outing.png'),
                            iconUrlGray: require('@/assets/images/outing.png'),
                            isTip: false,
                            title: '外出',
                            url: 'applyOuting'
                        },
                        {
                            iconUrl: require('@/assets/images/ask-leave.png'),
                            iconUrlGray: require('@/assets/images/ask-leave-gray.png'),
                            isTip: false,
                            title: '请/销假',
                            url: 'applyLeave'
                        },
                        {
                            iconUrl: require('@/assets/images/evection-icon.png'),
                            iconUrlGray: require('@/assets/images/evection-icon-gray.png'),
                            isTip: false,
                            title: '出差',
                            url: 'applyBusinessTravel',
                            showWebviewById: true
                        },
                        {
                            iconUrl: require('@/assets/images/apply-card-icon.png'),
                            iconUrlGray: require('@/assets/images/apply-card-icon-gray.png'),
                            isTip: false,
                            title: '补卡',
                            url: 'applyMendClock'
                        }
                    ]
                ]
            },
            bimModuleGroupData1: {
                isTitle: true, // 是否显示标题
                title: '其他',
                column: 5, // 列
                rowumn: 1, // 行
                isLine: false, // 带线分割的模块组
                bimMGDItems: [
                    [
                        {
                            iconUrl: require('@/assets/images/tongzhigonggao.png'),
                            iconUrlGray: require('@/assets/images/tongzhigonggao.png'),
                            isTip: false,
                            title: '通知公告',
                            url: 'applyNotice'
                        },
                        { },
                        { },
                        { },
                        { }
                    ]
                ]
            }
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss">
@import '@/assets/css/defalut-theme/color.scss';
.homeModuleBlock{
    background: $bg2;
}

</style>