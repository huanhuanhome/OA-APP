/*
 * @Author: BAICHONG 
 * @Date: 2018-09-14 18:32:35 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-21 17:52:34
 */
/**
|--------------------------------------------------
| 列表进外出详情页
|--------------------------------------------------
*/
<template>
    <div class="gooutdetail-root">
        <bimHeader title="外出详情" left-arrow/>

        <div class="collapse-block">
            <van-collapse v-model="activeNames">
                <van-collapse-item title="基础信息" name="1">
                    <ul class="g-list-2">
                        <li><span class="label">发起人：</span>{{ outingInfo.createName }}</li>
                        <li><span class="label">部门：</span>{{ outingInfo.createOrgName }}</li>
                        <li><span class="label">发起时间：</span>{{ outingInfo.createDt | dateFormat }}</li>
                        <li><span class="label">类型：</span>{{ outingInfo.type }}</li>
                        <li><span class="label">开始时间</span>{{ outingInfo.outingStartDate | dateFormat }}</li>
                        <li><span class="label">结束时间：</span>{{ outingInfo.outingEndDate | dateFormat }}</li>
                        <li style="padding-left: 85px;"><span class="label" style="width:90px">累计有效时长：</span>{{outingInfo.cumulativeLength}} 小时</li>
                        <li><span class="label">外出事由：</span>{{outingInfo.outingCause || '暂无'}}</li>
                    </ul>
                </van-collapse-item>
                <van-collapse-item title="附件信息" name="2">
                    <bimMedia :files="outingInfo.fileList"/>
                </van-collapse-item>
                <van-collapse-item title="审批详情" name="3">
                    <template v-if="outingInfo.hasOwnProperty('hisOpinions') && outingInfo.hisOpinions.length>0">
                        <ul class="g-list-2" v-for="hisItem in outingInfo.hisOpinions">
                            <li><span class="label">所属部门：</span>{{ hisItem.createOrgName }}</li>
                            <li><span class="label">审批人：</span>{{ hisItem.createName }}</li>
                            <li><span class="label">审批意见：</span>{{ hisItem.opinion }}</li>
                            <li><span class="label">审批时间：</span>{{ hisItem.createDt | dateFormat }}</li>
                            <li><span class="label">审批状态：</span>{{ hisItem.agree ? '已通过' : '已驳回' }}</li>
                        </ul>
                    </template>
                    <template v-else>
                        <ul class="g-list-2--nolabel">
                            <li>暂无审批信息</li>
                        </ul>
                    </template>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script>
import bimHeader from '@/component/bimHeader/bimHeader'
import { outingGetNoticeInfo } from '@/api/workflow'
import { dateTimeFormatCustom } from '@/common/utils'
import { Collapse, CollapseItem } from 'vant'
import bimMedia from '@/component/bimMedia/bimMedia.vue'
/* global plus */
export default {
    components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        bimHeader,
        bimMedia
    },
    data() {
        return {
            outingInfo: {},
            activeNames: ['1', '2', '3']
        }
    },
    filters: {
        dateFormat: dateTimeFormatCustom('YYYY-MM-DD HH:mm')
    },
    created() {
        const self = plus.webview.currentWebview()
        this.getDetail(self.detailObj && self.detailObj.id)
    },
    methods: {
        async getDetail(id) {
            try {
                this.outingInfo = await outingGetNoticeInfo(id)
                this.outingInfo.type = '外出'
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            }
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
.approve{
    width: 100%;
    height: 100%;
}
.collapse-block{
    padding-top: 45px;
    &__operation{

    }
}
.submit-button__submit{
    background: $bg5;
    border-color: $bg5;
}
</style>
