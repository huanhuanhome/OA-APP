/*
 * @Author: LG
 * @Last Modified by: LG
 * @Last Modified time: 2018-10-10 17:30:46
 */
/**
|--------------------------------------------------
| 销假审核模块
|--------------------------------------------------
*/
<template>
    <div class="approve-cancel-leave">
        <bimHeader title="销假审核" left-arrow/>

            <div class="collapse-block">
                <van-collapse v-model="activeNames">
                    <van-collapse-item title="基础信息" name="1">
                        <ul class="g-list-2">
                            <li><span class="label">姓名：</span>{{ cancelInfo.createName }}</li>
                            <li><span class="label">部门：</span>{{ cancelInfo.createOrgName }}</li>
                            <li><span class="label">职务：</span>{{ cancelInfo.positionName || '暂无' }}</li>
                            <li><span class="label">入职时间：</span>暂无</li>
                        </ul>
                    </van-collapse-item>
                    <van-collapse-item title="销假信息" name="2">
                        <ul class="g-list-2 g-list-2--span90">
                            <li><span class="label">请假申请单：</span>{{ cancelInfo.leaveInfo.title }}</li>
                            <li><span class="label">请假类别：</span>{{ cancelInfo.leaveTypeChinese }}</li>
                            <li><span class="label">请假开始时间：</span>{{ cancelInfo.leaveInfo.startDt | dateTimeFarmat }}</li>
                            <li><span class="label">请假结束时间：</span>{{ cancelInfo.leaveInfo.endDt | dateTimeFarmat }}</li>
                            <li><span class="label">销假开始时间：</span>{{ cancelInfo.cancelStartDt | dateTimeFarmat }}</li>
                            <li><span class="label">销假结束时间：</span>{{ cancelInfo.cancelEndDt | dateTimeFarmat }}</li>
                            <li><span class="label">销假说明：</span>{{ cancelInfo.cancelExplanation }}</li>
                        </ul>
                    </van-collapse-item>
                    <van-collapse-item title="审批详情" name="3">
                        <template v-if="cancelInfo.hasOwnProperty('hisOpinions') && cancelInfo.hisOpinions.length > 0">
                            <ul class="g-list-2" v-for="(hisFirstItem, index) in cancelInfo.hisOpinions" :key="index">
                                <li><span class="label">所属部门：</span>{{ hisFirstItem.createOrgName }}</li>
                                <li><span class="label">审批人：</span>{{ hisFirstItem.createName }}</li>
                                <li><span class="label">审批意见：</span>{{ hisFirstItem.opinion }}</li>
                                <li><span class="label">审批时间：</span>{{ hisFirstItem.createDt | dateTimeFarmatHIS }}</li>
                                <li><span class="label">审批状态：</span>{{ hisFirstItem.agree ? '已通过' : '已驳回' }}</li>
                            </ul>
                        </template>
                        <template v-else>
                            <ul class="g-list-2--nolabel">
                                <li>暂无部门领导审批信息</li>
                            </ul>
                        </template>
                    </van-collapse-item>
                    <van-collapse-item title="审批" name="4">
                        <div class="i-textarea-block">
                            <van-field
                              v-model="opinionText"
                              type="textarea"
                              placeholder="请输入审批意见"
                              rows="1"
                              autosize
                            />
                            <span class="i-textarea-block__tools" @click="chooseOpinion()">
                                <i class="iconfont icon-community"></i>
                                快捷意见
                            </span>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <div class="collapse-block__operation">
                    <div class="submit-button plr15 pt20 pb20">
                        <van-button type="primary" size="large" class="submit-button__submit mb10" @click="handleCancelLeave(true)">
                            通过
                        </van-button>
                        <van-button type="default" size="large" class="submit-button__cancel" @click="handleCancelLeave(false)">
                            驳回
                        </van-button>
                    </div>
                </div>
            </div>
        <van-actionsheet
            v-model="opinionShow"
            :actions="opinionActions"
            @select="onSelect"
        />
    </div>
</template>
<script>
import { cancelLeaveApprove } from '@/api/workflow'
import { parseTime } from '@/common/utils.js'
import { fire } from '@/utils/envent.js'
import { getUserInfo, getMappingCfg } from '@/common/app'
import bimHeader from '@/component/bimHeader/bimHeader'
import { Collapse, CollapseItem, Button, Field, Actionsheet } from 'vant'
/*global plus */
export default {
    components: {
        bimHeader,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Button.name]: Button,
        [Field.name]: Field,
        [Actionsheet.name]: Actionsheet
    },
    data() {
        return {
            activeNames: ['2', '4'],
            mySelf: plus.webview.currentWebview(),
            positionName: '',
            cancelInfo: {},
            opinionText: '',
            opinionShow: false,
            opinionActions: [
                { name: '同意' },
                { name: '拟办' },
                { name: '收到' }
            ]
        }
    },
    created() { // positionName
        this.positionName = getUserInfo().positionName || '暂无'
        this.cancelInfo = this.mySelf.detailObj
        this.cancelInfo.leaveTypeChinese = getMappingCfg()['WorkFlow.Personnel.Leave.Type'][this.cancelInfo.leaveInfo.leaveType].value
    },
    filters: {
        dateTimeFarmat(value) {
            return parseTime(value, '{y}-{m}-{d}')
        },
        dateTimeFarmatHIS(value) {
            return parseTime(value, '{y}-{m}-{d} {h}:{i}:{s}')
        }
    },
    methods: {
        handleCancelLeave(data) { //  审批
            this.cancelInfo.opinion = {}
            this.cancelInfo.opinion.opinion = this.opinionText
            this.cancelInfo.opinion.agree = data
            cancelLeaveApprove(this.cancelInfo)
                .then(res => {
                    if (res) {
                        const openerWebview = this.mySelf.opener()
                        plus.nativeUI.toast('数据处理成功')
                        fire(openerWebview, 'customEvent')
                        this.overrideBack()
                    } else {
                        plus.nativeUI.toast('数据处理失败，请稍后重试')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting() // eslint-disable-line
                })
        },
        chooseOpinion() {
            this.opinionShow = true
        },
        onSelect(item) {
            this.opinionText = item.name
            this.opinionShow = false
        },
        overrideBack() {
            plus.webview.close(this.mySelf, 'auto')
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
.approve-cancel-leave{
  width:100%;
  height:100%;
}
// .collapse-block{
//     padding-top: 45px;
// }
.submit-button__submit{
    background: $bg10;
    border-color: $bg10;
}
</style>