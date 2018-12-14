/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-30 17:15:15
 */
/**
|--------------------------------------------------
| 描述: 申请补卡页
|
|--------------------------------------------------
*/
<template>
    <div class="apply-card pr">
        <bimHeader 
            title="补卡申请" 
            left-arrow
        >
        </bimHeader>

        <div class="pa content--top" v-if="!error && !isLeader">

            <!-- 全选-->
            <div class="checkboxs-all plr15 ptb10">
                <van-checkbox v-model="checkedAll" @change="selectAllCheck">全选</van-checkbox>
            </div>
            <div class="van-hairline--bottom"></div>
            <van-checkbox-group v-model="checkGroup" @change="checkGroupChange">
                <ul class="check-grounp">
                    <li v-for="(item, index) in details" :key="index">
                        <div class="b1 clearfix">
                            <span class="l">序号：{{ item.order }}</span>
                            <span class="r">日期：{{ item.signDate | dateTimeFormat }}</span>
                        </div>
                        <div class="b1 clearfix">
                            <span v-if="item.signInDate" class="l">签到时间：<b>{{item.signInDate | dateFormat}}</b></span>
                            <span v-else class="l">签到时间（补）：<b>缺卡</b></span>
                            <span v-if="item.signOutDate" class="r">签退时间（补）：<b>{{item.signOutDate | dateFormat}}</b></span>
                            <span v-else class="r">签退时间（补）：<b>缺卡</b></span>
                        </div>
                        <div class="b2">
                            <span @click="selectReason(item)">补卡事由：
                                <b>{{ item.reasonValue }}</b>
                                <i class="van-icon van-icon-arrow btn-select__icon" style="vertical-align: middle;"></i>
                            </span>
                            <div class="textarea">
                                <van-field
                                    v-model="item.desc"
                                    type="textarea"
                                    placeholder="20字以内描述"
                                    rows="1"
                                    autosize
                                    style="padding-left:0;"
                                />
                            </div>
                        </div>
                        <div class="checkbox">
                            <van-checkbox :key="index" :name="index"/>
                        </div>
                    </li>
                </ul>
            </van-checkbox-group>

            <div class="apply-card--sp" v-if="Object.keys(data).length>0&&data.approveInfo">
                <h2 class="plr15">审批流程</h2>

                <ul class="g-list-2 pl20 pr15">
                    <li class="required"  v-if="data.leaderPublish" @click="selectApprovePer"><!-- 领导发布 -->
                        <span class="label">分管领导：</span>
                        <van-field 
                            placeholder="请选择"
                            class="content-color"
                            disabled
                            v-model ="approveInfo.name"
                        />
                        <i class="iconfont icon-right"></i>
                    </li>
                    <li class="required indent20" v-else>
                        <span class="label">部门负责人</span>
                        <span class="content-color">{{approveInfo.name || '暂无部门负责人' }}</span>
                    </li>
                </ul>
            </div>

            <div class="apply-card--submit plr15 ptb20" v-if="Object.keys(data).length>0&&data.approveInfo">
                <van-button type="default" size="large" class="apply-card--submit__submit mb10" @click="submit">
                    提交
                </van-button>
            </div>
        </div>
        
        <!-- 没有补卡信息 -->
        <div class="apply-card__error pa content--top" v-else>
            {{error || '没有需要补签的考勤记录'}}
        </div>
        
        <template>
            <!-- 类型选择 -->
            <van-popup v-model="reasonPop" position="bottom" :overlay="false">
                <van-picker 
                    show-toolbar
                    :columns="mappingCfg" 
                    value-key="value"
                    @confirm="selectReasonConfirm"
                    @cancel="reasonPop = false"
                />
            </van-popup>
            <!-- 领导@人选择选择 -->
            <van-popup v-model="approvePersonPop" position="bottom" :overlay="false">
                <van-picker 
                    show-toolbar
                    :columns="approveInfoList"
                    value-key="name"
                    @confirm="approvePersonConfirm"
                    @cancel="approvePersonPop = false"
                />
            </van-popup>
        </template>
    </div>
</template>

<script>
import bimHeader from '@/component/bimHeader/bimHeader'
import bimHeaderMyInfo from '@/component/bimHeaderMyInfo/bimHeaderMyInfo'
import { clockInit, publish } from '@/api/workflow'
import { dateTimeFormatCustom } from '@/common/utils'
import { Icon, Button, Checkbox, CheckboxGroup, Picker, Popup, Field } from 'vant'
import { getMappingCfg, getUserInfo } from '@/common/app'
import { LOCALSTORAGE_KEYS } from '@/common/globalConstCfg'
import { fire } from '@/utils/envent.js'
/* global plus */
export default {
    components: {
        [Icon.name]: Icon,
        [Button.name]: Button,
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup,
        [Picker.name]: Picker,
        [Popup.name]: Popup,
        [Field.name]: Field,
        bimHeader,
        bimHeaderMyInfo
    },
    data() {
        return {
            data: {},
            checkedArr: [], // 选择的申请补卡item,index数组
            checkedAll: false,
            checkGroup: [], // checkGroup
            checked: true,
            mappingCfg: Object.values(getMappingCfg()['WorkFlow.Personnel.MendClock.Reasons']), // 申请补卡原因类型
            reasonPop: false, // 补卡原因选择pop弹窗
            approvePersonPop: false,
            details: [],
            approveInfoList: [],
            approveInfo: {}, // 选择的审批人
            icon: {
                active: require('@/assets/images/checked.png'),
                normal: require('@/assets/images/check.png')
            },
            error: '',
            isLeader: getUserInfo()[LOCALSTORAGE_KEYS.IS_LEADER] // 是不是领导
        }
    },
    created() {
        const self = plus.webview.currentWebview()
        const data = self.detailObj
        if (data) { // 被驳回重新发起申请补卡
            this.republishInit(data)
        } else {
            this.init()
        }
    },
    filters: {
        dateTimeFormat: dateTimeFormatCustom('YYYY-MM-DD'),
        dateFormat: dateTimeFormatCustom('HH:mm')
    },
    methods: {
        init() {
            if (getUserInfo().hasLeading) {
                this.error = '领导班子成员无法发起补卡申请'
                return plus.nativeUI.toast('领导班子成员无法发起补卡申请')
            }
            plus.nativeUI.showWaiting()
            clockInit()
                .then(res => {
                    this.data = res || {}
                    this.approveInfoList = res.approveInfo || []
                    const data = res.approveInfo || []
                    this.approveInfo = data[0] || {}
                    // detailsList
                    this.details = this.data.details || []
                    const option = this.mappingCfg[0]
                    this.details.forEach((item, index) => {
                        item.order = index + 1
                        item.reasonValue = option.value
                        item.reasonKey = option.key
                    })
                    // 未设置审批人
                    if (Object.keys(data).length <= 0) {
                        const message = res.leaderPublish ? '未设置分管领导无法发起补卡申请' : '未设置部门负责人无法发起补卡申请'
                        plus.nativeUI.toast(message)
                    }
                })
                .catch(e => {
                    console.warn(e)
                    this.error = e.message
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        // checkGroup Change改变的时候触发
        checkGroupChange(arr) {
            if (arr.length === this.details.length) {
                this.checkedAll = true
            } else {
                this.checkedAll = false
            }
        },
        // 选择所有
        selectAllCheck(value) {
            if (value) {
                this.details.forEach((item, index) => {
                    this.checkGroup.indexOf(index) < 0 && this.checkGroup.push(index)
                })
            } else {
                if (this.checkGroup.length === this.details.length) {
                    this.checkGroup = []
                }
            }
        },
        // 重新发起init
        republishInit(param) {
            this.data = param || {}
            // detailsList
            this.details = this.data.details || []
            const option = this.mappingCfg[0]
            this.details.forEach((item, index) => {
                item.order = index + 1
                item.reasonValue = option.value
                item.reasonKey = option.key
            })
            this.approveInfoList = param.approveInfo
            const data = param.approveInfo || []
            this.approveInfo = data[0] || {}
        },
        // 选择申请补卡原因
        selectReason(item) {
            this.reasonPop = true
            this.selectReasonItem = item
        },
        // 补卡原因确认
        selectReasonConfirm(value, index) {
            this.reasonPop = false
            this.selectReasonItem.reasonKey = value.key
            this.selectReasonItem.reasonValue = value.value
        },
        //
        selectApprovePer() {
            this.approvePersonPop = true
        },
        approvePersonConfirm(value, index) {
            this.approvePersonPop = false
            this.approveInfo = value
        },
        // 提交补卡申请
        submit() {
            if (this.checkGroup.length <= 0) {
                return plus.nativeUI.toast('至少选择一条')
            }
            const submitData = []
            this.checkGroup.forEach(index => {
                if (this.details[index]) {
                    submitData.push(this.details[index])
                }
            })
            const submit = {}
            const arr = Object.keys(this.data)
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === 'details' || arr[i] === 'approveInfo') continue
                submit[arr[i]] = this.data[arr[i]]
            }
            submit.approveUid = this.approveInfo.id
            submit.approveOrgI = this.approveInfo.orgId
            submit.details = submitData
            plus.nativeUI.showWaiting()
            publish(submit)
                .then(res => {
                    if (res) {
                        const mySelf = plus.webview.currentWebview()
                        const openerWebview = mySelf.opener()
                        plus.nativeUI.toast('数据处理成功')
                        fire(openerWebview, 'customEvent')
                        mySelf.close()
                    } else {
                        plus.nativeUI.toast('数据处理失败')
                    }
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => { plus.nativeUI.closeWaiting() })
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
@import '../../assets/font/iconfont.css';
.apply-card--fontColor{
    color: #2776BF;
}
.apply-card__container{
    padding-bottom: 10px;
    font-size:12px;
}

// error 
.apply-card__error{
    width: 100%;
    font-size: 14px;
    line-height: 100px;
    text-align: center;
}
.checkboxs-all{
    background: $bg2;
}
/deep/ .van-checkbox{
    &__label {
        font-size:12px;
    }
}
/deep/ .van-checkbox__icon--checked{
    i{
        border-color: #0072fe;
        background-color: #0072fe;
    }
}
/deep/ .van-field{
    padding: 0px;
    line-height: 18px;
    color: #787878;
    font-size: 12px;
    margin-bottom:10px;
}
/deep/ .van-field__control::-webkit-input-placeholder{
    font-size:12px;
    line-height: 18px;
    color: #787878;
}

.check-grounp{
    background: $bg2;
    li{
        font-size: 12px;
        line-height: 28px;
        padding: 10px 5px 10px 46px;
        position: relative;
        &:before {
            content: " ";
            display:block;
            border-bottom:1px solid $linec1;
            height: 1px;
            position: absolute;
            left: 46px;
            right:0;
            bottom:-1px;
            -webkit-transform: scaleY(.5);
            transform:scaleY(.5);
        }
    }
    li:last-child::before {
        border-bottom: none;
    }
    .b1{
        padding: 0px;
        span{
            width:50%;
            b{
                color: #0072fe;
                display: inline-block;
                font-weight: normal;
            }
        }
        .l{
            float:left;
        }
        .r{
            float:right;
        }
    }
    .b2{
        span{
            display: block;
            position: relative;

            b{
                color: #0072fe;
                display: inline-block;
                font-weight: normal;
            }
        }
    }
    .checkbox{
        position: absolute;
        left:15px;
        top: 11px;
    }
}

.apply-card--sp{
    background: $bg2;
    h2{
        background: $bg4;
        font-size: 14px;
        line-height:32px;
    }
}
.apply-card--submit{
    &__submit{
        color:$textc2;
        background:#2776BF;
    }
}





.apply-card{
    width: 100%;
    height: 100%;
    &__layout {
        background: white;

        &-unit {
            padding: 15px 10px 10px 10px;
            border-bottom: 1px solid #EBEBEB;
            display: flex;
            line-height: 30px;
            .apply-card__checkBox{
                width: 20px;
            }
            .apply-card__content{
                width: calc(100% - 20px);

                .apply-card__item{
                    display: flex;

                    .apply-card__left, .apply-card__right {
                        width: 50%;
                        // background: skyblue;
                        .apply-card--font{
                            padding-left: 10px;
                            color: #2776BF; 
                        }
                    }

                    .apply-card__right {
                        
                    }

                    .apply-card--remarks{

                    }
                    .apply-card--content{
                        width: 120px;
                        height:20px;
                        border:1px solid #CACACA;
                        line-height:20px;
                        text-indent:10px;
                        margin-top: 5px;
                        margin-bottom: 5px;
                        margin-left: 10px;

                        &__icon {
                            position: absolute;
                            top: -2px;
                            right: 5px;
                        }
                    }
                }

                .apply-card--item-input{
                    padding-left: 74px;
                    input::-moz-placeholder {text-align: right;padding-right: 10px;}
                    ::-webkit-input-placeholder{text-align: right;padding-right: 10px;}
                    :-ms-input-placeholder{text-align: right;padding-right: 10px;}
                }
            }
        }

        &_approve{
            line-height: 60px;
            
            .approve--title{
                width: 100%;
                height: 30px;
                background: #EBEBEB;
                text-indent: 14px;
                line-height: 30px;
            }
            .approve--departResponsible{
                padding-left: 14px;
            }
            // 领导picker
            .approve--departLeader{
                padding-left: 14px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .approve__selectLeader{
                    border: 1px solid #ccc;
                    width: 70px;
                    height: 25px;
                    margin-left: 20px;
                    padding-left: 10px;
                    line-height: 25px;
                    .apply-card--content__icon{
                        position: absolute;
                        top: -2px;
                        right: 5px;
                    }
                }
            }
        }

        &__handler{
            display:flex;
            justify-content: center;
            background: white;
            // padding-top: 15px;
            padding-bottom: 15px;
            
            .app-card__submit{
                width: 100px;
                height:30px;
                background:#2776BF;
                color:white;
                line-height:30px;
            }
            .app-card__cancel{
                width: 100px;
                height:30px;
                line-height:30px;
                margin-left:50px;
            }
        }
    }
}
</style>