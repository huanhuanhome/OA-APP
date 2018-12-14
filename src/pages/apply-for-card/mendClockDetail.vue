/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-09 17:49:09
 */
/**
|--------------------------------------------------
| 任务流,补卡详情展示页
|--------------------------------------------------
*/
<template>
    <div class="approveCard">
        <bimHeader title="补卡详情" left-arrow/>
        <div class="collapse-block">
            <van-collapse v-model="activeNames">
                <van-collapse-item title="基础信息" name="1">
                    <ul class="g-list-2">
                        <li><span class="label">姓名：</span>{{ data.createName }}</li>
                        <li><span class="label">部门：</span>{{ data.createOrgName }}</li>
                    </ul>
                </van-collapse-item>
                <van-collapse-item title="补卡信息" name="2">
                    <ul class="g-list-2 g-list-2--span90" v-for="(item, index) in details"  :key="item.id">
                        <li><span class="label">序号：</span>{{ index+1 }}</li>
                        <li><span class="label">日期：</span>{{ item.signDate | dateTimeFormat }}</li>
                        <li v-if="item.hasOwnProperty('signInDate')"><span class="label">签到时间：</span>{{ item.signInDate | dateTimeFormat }}</li>
                        <li v-else><span class="label">签到时间(补)：</span>缺卡</li>
                        <li v-if="item.hasOwnProperty('signOutDate')"><span class="label">签退时间：</span>{{ item.signOutDate | dateTimeFormat }}</li>
                        <li v-else><span class="label">签退时间(补)：</span>缺卡</li>
                        <li><span class="label">补卡事由：</span>{{ reasonMapCfg[item.reasonKey] }} ({{ item.desc }})</li>
                    </ul>
                </van-collapse-item>
                <template v-if="data.hasOwnProperty('hisOpinions')">
                    <van-collapse-item title="审批流程" name="3">
                        <ul class="g-list-2 g-list-2--span90" v-for="item in data.hisOpinions" :key="item.id">
                            <li><span class="label">所属部门：</span>{{ item.createOrgName }}</li>
                            <li><span class="label">审批人：</span>{{ item.createName }}</li>
                            <li><span class="label">审批意见：</span>{{ item.opinion }}</li>
                            <li><span class="label">审批时间：</span>{{ item.createDt | timeFormat }}</li>
                            <li><span class="label">审批状态：</span>{{ item.agree ? '已通过' : '已驳回' }}</li>
                        </ul>
                    </van-collapse-item>
                </template>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script>
import { Collapse, CollapseItem } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
import { getHisDetail } from '@/api/workflow'
import { dateTimeFormatCustom, handleMapCfgToObj } from '@/common/utils'
import { WORK_FLOW_STATE } from '@/common/globalConstCfg'
/* global plus */
export default {
    components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        bimHeader
    },
    created() {
        this.init()
    },
    filters: {
        dateTimeFormat: dateTimeFormatCustom('YYYY-MM-DD'),
        timeFormat: dateTimeFormatCustom('YYYY-MM-DD HH:mm'),
        hourMinFormat: dateTimeFormatCustom('HH:mm')
    },
    data() {
        return {
            activeNames: ['1', '2', '3', '4'],
            data: {},
            details: [], // 列表数组
            hisOpinions: {},
            reasonMapCfg: handleMapCfgToObj('WorkFlow.Personnel.MendClock.Reasons')
        }
    },
    methods: {
        init() {
            const self = plus.webview.currentWebview()
            const id = self.detailObj.id
            // 初始化
            plus.nativeUI.showWaiting()
            getHisDetail(id)
                .then(res => {
                    // 我发起,已完成
                    this.data = res
                    const details = res.details || []
                    details.forEach((item, index) => { item.order = index + 1 })
                    this.details = details
                    // 发布,待审核
                    if (res.status !== WORK_FLOW_STATE.PUBLISH_VAL) {
                        this.hisOpinions = res.hisOpinions[0] || {}
                    }
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => { plus.nativeUI.closeWaiting() })
        },
        // 左侧返回
        onClickLeft() {
            this.$router.push({ name: 'ToDoList', params: { isTodolist: false }})
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.approveCard{
    width: 100%;
    height: 100%;
}
</style>