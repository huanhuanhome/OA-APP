/*
 * @Author: BAICHONG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-11 11:49:56
 *  + '\n' + 'ADR;WORK;POSTAL:' + this.cardInfo.address + ';100101'
 * 'N:' + this.cardInfo.firstName + '\n' +
 */
 /**
 |--------------------------------------------------
 | 我
 |--------------------------------------------------
 */
<template>
    <div class="my">

        <div class="visitCard pr m10">
            <div class="p20">
                <p class="visitCard__name">{{ cardInfo.name }}</p>
                <p class="visitCard__duty">{{ cardInfo.mainOrgName }}</p>
                <p class="visitCard__duty" v-if="isLeading">{{ cardInfo.mainDutyName }}</p>
            </div>
            <div class="visitCard__companyName pl20 pr10">
                <p class="zh">中路高科交通检测检验认证有限公司</p>
                <p class="en">China-Road Transprotation Verification & Inspection Hi-Tech Co., Ltd.</p>
            </div>
            <div class="visitCard__companyAdd pr pl40 pr10 pt10 pb20">
                <p>地址：{{ cardInfo.address }}</p>
                <p>电话：{{ cardInfo.tel }}</p>
                <p>手机：{{ cardInfo.mobile }}</p>
                <p>邮箱：{{ cardInfo.email }}</p>
                <p>微信：{{ cardInfo.weiXin }}</p>
                <p>QQ：{{ cardInfo.tenQQ }}</p>
                <span class="visitCard__qr pa" @click="showPersonCard()">
                    <i class="iconfont icon-qr_code_light"/>
                </span>
            </div>
        </div>

        <!-- <div class="bim-notice-bar-block pr">
            <bimNoticeBar :noticeObj='noticeDataObj'/>
            <span class="i-edit pa">
                <van-icon name="edit" />
            </span>
        </div> -->

        <div>
            <bimCellGroup1 :bimCellGroup1Array="bimCellGroup1Data1"/>
        </div>

        <div class="mt10">
            <bimCellGroup1 :bimCellGroup1Array="bimCellGroup1Data2"/>
        </div>

        <div class="mt10">
            <bimCellGroup1 :bimCellGroup1Array="bimCellGroup1Data3"/>
        </div>

    </div>
</template>

<script>
import { Icon, ImagePreview } from 'vant'
import { getUserInfo } from '@/common/app.js'
import QRCode from 'qrcode'
import bimNoticeBar from '@/component/bimNoticeBar/bimNoticeBar'
import bimCellGroup1 from '@/component/bimCellGroup1/bimCellGroup1'
import { quitApp } from '@/utils/tools'
export default {
    name: 'MainMy',
    components: {
        [Icon.name]: Icon,
        [ImagePreview.name]: ImagePreview,
        bimNoticeBar,
        bimCellGroup1
    },
    data() {
        return {
            isLeading: false,
            qrPath: '',
            cardInfo: {
                firstName: '',
                secondName: '',
                name: '',
                userTitle: '', //  职称
                mainOrgName: '', // 所属组织部门
                mainDutyName: '', //  职务
                mobile: '',
                address: '',
                email: ''
            },
            noticeDataObj: {
                mode: '',
                msg: '早起的鸟儿有虫吃,早起的鸟儿有虫吃,早起的鸟儿有虫吃,早起的鸟儿有虫吃',
                fontColor: '#0c2e59',
                fontBgColor: '#fff'
            },
            bimCellGroup1Data1: [
                {
                    title: '个人统计',
                    iconUrl: require('../../assets/images/my/gerentongji.png'),
                    value: '',
                    link: ''
                },
                {
                    title: '待办统计',
                    iconUrl: require('../../assets/images/my/daibantongji.png'),
                    value: '',
                    link: ''
                },
                {
                    title: '消息统计',
                    iconUrl: require('../../assets/images/my/xiaoxitongji.png'),
                    value: '',
                    link: ''
                }
            ],
            bimCellGroup1Data2: [
                {
                    title: '企业知识库',
                    iconUrl: require('../../assets/images/my/qiyezhishiku.png'),
                    value: '',
                    link: ''
                },
                {
                    title: '党工团学习与活动',
                    iconUrl: require('../../assets/images/my/danggongtuanxuexi.png'),
                    value: '',
                    link: ''
                }
            ],
            bimCellGroup1Data3: [
                {
                    title: '设置',
                    iconUrl: require('../../assets/images/my/shezhi.png'),
                    value: '',
                    url: 'setting'
                }
            ]
        }
    },
    created() {
        quitApp()
        const userInfo = getUserInfo()
        this.isLeading = !(userInfo.positionName === '员工')
        this.cardInfo.name = userInfo.name
        this.cardInfo.firstName = this.firstName(this.cardInfo.name)
        this.cardInfo.secondName = this.secondName(this.cardInfo.name)
        this.cardInfo.mainOrgName = userInfo.mainOrgName || '暂无'
        this.cardInfo.mainDutyName = userInfo.positionName || '暂无'
        this.cardInfo.mobile += '+86 ' + userInfo.mobile || '暂无'
        this.cardInfo.tel = '暂无'
        this.cardInfo.email = userInfo.email || '暂无'
        this.cardInfo.address = (userInfo.signInfoEntity && userInfo.signInfoEntity.address) ? userInfo.signInfoEntity.address : '暂无'
        this.cardInfo.weiXin = '暂无'
        this.cardInfo.tenQQ = '暂无'
    },
    mounted() {
        const userCart = 'BEGIN:VCARD\n' + 'FN:' + this.cardInfo.secondName + '\n' + 'N:' + this.cardInfo.firstName + '\n' + 'TEL:' + this.cardInfo.mobile + '\n' + 'EMAIL:' + this.cardInfo.email + '\n' + 'ORG:中路高科交通检测检验认证有限公司' + '\n' + 'ROLE:' + this.cardInfo.mainOrgName + '\n' + 'TITLE:' + this.cardInfo.mainDutyName + '\n' + 'END:VCARD'
        QRCode.toDataURL(userCart)
            .then(url => {
                this.qrPath = url
            })
            .catch(err => {
                console.error(err)
            })
    },
    methods: {
        showPersonCard() { // 生成二维码名片
            ImagePreview([this.qrPath])
        },
        firstName(value) { // 获取姓氏
            return value.substr(0, 1)
        },
        secondName(value) {
            return value.substr(1)
        }
    }
}
</script>


<style lang="scss" scoped>
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
html,body{
    background:$bg1;
    height:100%;
}
.my{
    position: relative;
    background:$bg1;
    width:100%;
    height: 100%;
}
.bim-notice-bar-block{
    padding-right:25px;
    background: $bg2;
    .i-edit{
        width:26px;
        height:34px;
        display:block;
        top:2px;
        right:10px;
        text-align: center;
        line-height:34px;
    }
}
.visitCard{
    display: block;
    border-radius: 10px;
    overflow:hidden;
    background-image: url('../../assets/images/home-recommbg.jpg');
    background-size: 100%;
    background-repeat: no-repeat;
    color: $textc2;
    font-size:12px;
    &__name{
        font-size:14px;
        line-height:20px;
    }
    &__duty{
        line-height: 12px;
        font-size: 0.8em;
    }
    &__companyName{
        p.zh{
            line-height: 16px;
            font-size: 12px;
        }
        p.en{
            line-height: 12px;
            font-size: 0.8em;
        }
    }
    &__companyAdd{
        p{
            line-height: 12px;
            font-size: 0.6em;
        }
    }
    &__qr{
        display: block;
        width:42px;
        height:42px;
        font-size: 30px;
        line-height: 42px;
        top: 20px;
        right:10px;
        text-align:center;
        i{
            display:inline-block;
            width:42px;
            height:42px;
            font-size:30px;
            line-height:42px;
            color: #fff;
        }
    }
}
</style>