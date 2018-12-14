/*
 * @Author: BAICHONG 
 * @Date: 2018-09-17 10:00:24 
 * @Last Modified by: suntingting
 * @Last Modified time: 2018-09-25 15:22:12
 */
/**
|--------------------------------------------------
| 
| 外出 审批
| 
| 
|--------------------------------------------------
*/
<template>
    <div class="approve">
        <bimHeader title="外出审批" left-arrow/>

        <div class="collapse-block">
            <van-collapse v-model="activeNames">
                <van-collapse-item title="基础信息" name="1">
                    <ul class="g-list-2">
                        <li><span class="label">发起人：</span>{{ detailObj.createName }}</li>
                        <li><span class="label">部门：</span>{{ detailObj.createOrgName }}</li>
                        <li><span class="label">发起时间：</span>{{ detailObj.createDt | dateTimeFarmatHIS }}</li>
                        <li><span class="label">类型：</span>{{ detailObj.type }}</li>
                        <li><span class="label">开始时间</span>{{ detailObj.outingStartDate | dateTimeFarmatHIS }}</li>
                        <li><span class="label">结束时间：</span>{{ detailObj.outingEndDate | dateTimeFarmatHIS }}</li>
                        <li style="padding-left: 85px;"><span class="label" style="width:90px">累计有效时长：</span>{{detailObj.cumulativeLength}} 小时</li>
                        <li><span class="label">外出事由：</span>{{detailObj.outingCause}}</li>
                    </ul>
                </van-collapse-item>

                <van-collapse-item title="附件信息" name="2">
                    <bimMedia :files="detailObj.fileList"/>
                </van-collapse-item>

                <van-collapse-item title="审批" name="5">
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
                    <van-button type="primary" size="large" class="submit-button__submit mb10" @click="handleOuting(true)">
                        通过
                    </van-button>
                    <van-button type="default" size="large" class="submit-button__cancel" @click="handleOuting(false)">
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
import bimHeader from '@/component/bimHeader/bimHeader'
import { outingApprove } from '@/api/workflow'
import { parseTime } from '@/common/utils.js'
import { fire } from '@/utils/envent.js'
import bimMedia from '@/component/bimMedia/bimMedia.vue'
import { Collapse, CollapseItem, Button, Field, Actionsheet } from 'vant'
/* global plus */
export default {
    components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Button.name]: Button,
        [Field.name]: Field,
        [Actionsheet.name]: Actionsheet,
        bimHeader,
        bimMedia
    },
    created() {
        this.detailObj = this.ws.detailObj
        this.detailObj.type = '外出'
    },
    filters: {
        dateTimeFarmat(value) {
            return parseTime(value, '{y}-{m}-{d}')
        },
        dateTimeFarmatHIS(value) {
            return parseTime(value, '{y}-{m}-{d} {h}:{i}:{s}')
        }
    },
    data() {
        return {
            activeNames: ['1', '2', '5'],
            ws: plus.webview.currentWebview(),
            detailObj: {},
            opinionShow: false,
            opinionActions: [
                { name: '同意' },
                { name: '拟办' },
                { name: '收到' }
            ],
            opinionText: ''
        }
    },
    methods: {
        handleOuting(params) {
            this.detailObj.opinion = {}
            this.detailObj.opinion.opinion = this.opinionText
            this.detailObj.opinion.agree = params
            console.log(JSON.stringify(this.detailObj, null, 4))
            plus.nativeUI.showWaiting()
            outingApprove(this.detailObj)
                .then(res => {
                    plus.nativeUI.toast('审批成功')
                    fire(this.ws.opener(), 'customEvent')
                    this.ws.close && this.ws.close()
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(_ => { plus.nativeUI.closeWaiting() })
        },
        chooseOpinion() {
            this.opinionShow = true
        },
        onSelect(item) {
            this.opinionText = item.name
            this.opinionShow = false
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
    background: $bg10;
    border-color: $bg10;
}
</style>