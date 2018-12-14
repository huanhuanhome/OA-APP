/*
 * @Author: LG
 * @Last Modified by: LG
 * @Last Modified time: 2018-09-11 10:57:43
 */
/**
|--------------------------------------------------
| 描述:功能(模块)公共组件，包含消息提醒功能(红点)
| 使用说明: 
| 父级引用形式：import bimModule from '@/component/bimModule/bimModule'
| props接收bimModuleGroupObj参数，数据类型Object
| 数据格式(例：父级bimModulGroup.vue item): 
|  item: {
|        iconUrl: require('@/assets/images/图标'),
|        isTip: 是否提示,
|        title: '模块名称'
|  }
|--------------------------------------------------
*/
<template>
    <div class="bim-module">
        <template v-if="bimModuleObj.url === ''">
            <div class="bim-module__icon-gray">
                <img :src='bimModuleObj.iconUrlGray'/>
            </div>
            <p class="bim-module__title-gray">{{ bimModuleObj.title }}</p>
        </template>
        <template v-else>
            <div class="bim-module__icon">
                <img :src='bimModuleObj.iconUrl'/>
                <div v-if="bimModuleObj.isTip" class="bim-module__msg"></div>
            </div>
            <p class="bim-module__title">{{ bimModuleObj.title }}</p>
        </template>
    </div>
</template>
<script>
export default{
    props: {
        bimModuleObj: {
            type: Object,
            default: _ => ({})
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/defalut-theme/color.scss';
.bim-module{
    color:#fff;
    width: 100%;
    padding: 10px 0;
    &__title,&__title-gray{
        font-size:12px;
        color: $textc4;
        text-align: center;
        padding-top:5px;
        line-height:14px;
    }
    &__title-gray {
        font-size:12px;
        opacity: 0.8;
        color: $textc6;
    }
    &__icon,&__icon-gray{
        width: 32px;
        margin: 0 auto;
        position: relative;
        img{width:100%;}
    }
    &__icon-gray{
        img{opacity: 0.8;}
    }
    &__msg{
        width:8px;
        height:8px;
        border-radius:8px;
        background: $bg3;
        position: absolute;
        right:0px;
        top:0px;
    }
}
.bim-module:active{
    background: #eee;
}
</style>