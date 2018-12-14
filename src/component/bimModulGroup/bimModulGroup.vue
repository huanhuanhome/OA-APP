/*
 * @Author: lg
 * @Last Modified by: suntingting
 * @Last Modified time: 2018-09-13 20:28:18
 */
/**
|--------------------------------------------------
| 描述:模块组公共组件，引用模块公共组件组合使用
| 使用说明: 
| vantRow vantCol布局组件的二次封装,父级引用形式：import bimModulGroup from '@/component/bimModulGroup/bimModulGroup'
| props接收bimModuleGroupObj参数，数据类型Object
| 数据格式(例：父级_home.vue bimModuleGroupData): 
| bimModuleGroupData: {
|   isTitle: '是否显示标题',
|   title: '标题',
|   column: '模块组列',
    rowumn: '模块组行'',
    isLine: '模块组是否使用带线的分割样式',
    bimMGDItems: [
        [
            {
                iconUrl: require('@/assets/images/图标'),
                isTip: 模块是否提示,
                title: '模块标题'
                url: '页面地址'
            },
        ]
    ]
|  }
|--------------------------------------------------
*/
<template>
    <div :class="['bim-modul-group', {'bim-modul-group--line': bimModuleGroupObj.isLine}]">
        <div v-if="bimModuleGroupObj.isTitle" class="bim-modul-group__title">
            <p>
                {{bimModuleGroupObj.title}}
            </p>
        </div>
        <van-row type="flex" justify="space-around" class="bim-modul-group--line__row" v-for="(items, index) in bimModuleGroupObj.bimMGDItems" :key="index">
            <van-col 
                :span="colSpan"
                v-for="(item, index) in items"
                :key="index"
                class="bim-modul-group--line__col"
                style="width:100%;"
            >
                <div @click="openWindow(item)">
                    <bim-module :bimModuleObj="item"/>
                </div>
            </van-col>
        </van-row>

    </div>
</template>

<script>
import { openWebview } from '@/utils/webview'
import { Row, Col, Toast } from 'vant'
import bimModule from '@/component/bimModule/bimModule'
import { permissionFunc } from '@/common/permission.js'
/* global plus */
export default {
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Toast.name]: Toast,
        bimModule
    },
    props: {
        bimModuleGroupObj: {
            type: Object,
            default: _ => ({})
        }
    },
    data() {
        return {
            col: 'value'
        }
    },
    computed: {
        colSpan() {
            switch (this.bimModuleGroupObj.column) {
                case 2:
                    return 12
                case 3:
                    return 8
                case 4:
                    return 6
                case 5:
                    return 5
            }
        }
    },
    methods: {
        openWindow(item) {
            if (item.url) {
                const result = permissionFunc(item.url, true)
                if (result) {
                    openWebview({
                        url: item.url + '.html',
                        id: item.url
                    })
                }
            } else {
                plus.nativeUI.toast('模块暂未开放')
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.bim-modul-group{
    width: 100%;
    &__title{
        padding: 10px;
        // margin-bottom: 10px;
        border-bottom:1px solid #f0f0f0;
        font-size: 12px;
        color: $textc5;
    }
    .bim-modul-group--line__col{
        padding:0;
    }
}
.bim-modul-group--line{
    .bim-modul-group--line__row{
        padding:0;
        margin:0;
        border-bottom:solid #f0f0f0 1px;
    }
    .bim-modul-group--line__col{
        border-right:solid #f0f0f0 1px;
    }
    .bim-modul-group--line__col:last-child{
        border-right: none;
    }
}
</style>