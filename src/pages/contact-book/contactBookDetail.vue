/*
 * @Author: LG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-25 11:29:08
 */
/**
|--------------------------------------------------
| 通讯录功能/模块 人员详情
|--------------------------------------------------
*/
<template>
    <div class="contact-book-detail pr">

        <bimHeader title="个人信息" left-arrow/>
        <div class="contact-book-detail-container">  
            <div class="person-detail-bgblock p10">
                <div class="person-detail-block pr p20">
                    <p class="person-detail-block__org">{{ userInfo.orgName }}</p>
                    <p class="person-detail-block__name pa">{{ userInfo.name }}</p>
                    <!-- <p class="person-detail-block__duty pa">工长</p> -->
                    <div class="person-detail-block__person pa">
                        <img :src="userInfo.avatarUri" class="photo" v-if="isAvatarUri"/>
                        <i class="txt" v-else>{{ userInfo.name | firstName }}</i>
                    </div>
                </div>
            </div>

            <div class="org-message-block">
                <h2 class="ml20 mr20">企业信息</h2>
                <ul class="org-message-list">
                    <li>
                        <p class="t1">姓名</p>
                        <p class="t2">{{ userInfo.name }}</p>
                    </li>
                    <li @click="callPhone(userInfo.mobile)">
                        <p class="t1">电话</p>
                        <p class="t2">{{ userInfo.mobile }}</p>
                        <i class="icon-mobile"><img src="../../assets/images/contact-book-mobile.png"/></i>
                    </li>
                    <li>
                        <p class="t1">部门</p>
                        <p class="t2">{{ userInfo.orgName }}</p>
                    </li>
                    <li>
                        <p class="t1">职务</p>
                        <p class="t2">{{ userInfo.postName }}</p>
                    </li>
                </ul>
            </div>

            <div class="org-message-block">
                <h2 class="ml20 mr20">个人信息</h2>
                <ul class="org-message-list">
                    <li @click="sendEmail(userInfo.email)">
                        <p class="t1">电子邮件</p>
                        <p class="t2">{{ userInfo.email }}</p>
                        <i class="icon-email"><img src="../../assets/images/contact-book-email.png"/></i>
                    </li>
                    <li>
                        <p class="t1">微信</p>
                        <p class="t2">暂无</p>
                    </li>
                    <li>
                        <p class="t1">QQ</p>
                        <p class="t2">暂无</p>
                    </li>
                </ul>
            </div> 
        </div>
    </div>
</template>
<script>
/* global plus */
import { getUserInfoByUserId } from '@/api/user'
import { Toast } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
export default {
    components: {
        [Toast.name]: Toast,
        bimHeader
    },
    data() {
        return {
            mySelf: plus.webview.currentWebview(),
            personDetailInObj: {},
            isAvatarUri: false,
            userInfo: {
                name: '',
                mobile: '',
                orgName: '',
                email: '',
                avatarUri: '',
                dutyName: ''
            }
        }
    },
    created() {
        this.personDetailInObj = this.mySelf.personDetail
        this.init()
    },
    methods: {
        init() {
            plus.nativeUI.showWaiting()
            getUserInfoByUserId(this.personDetailInObj)
                .then(res => {
                    if (res) {
                        res = res || {}
                        const userInfo = res.userVo || {}
                        const mainUserOrgPositionViewVo = res.mainUserOrgPositionViewVo || {}
                        this.userInfo = {
                            name: userInfo.name || '暂无',
                            mobile: userInfo.mobile || '暂无',
                            orgName: mainUserOrgPositionViewVo.orgName || '暂无',
                            email: userInfo.email || '暂无',
                            postName: mainUserOrgPositionViewVo.fullPositionName || '暂无'
                        }
                        if (userInfo && userInfo.avatarUri) {
                            this.isAvatarUri = true
                            this.userInfo.avatarUri = `${process.env.API_ENDPOINT.slice(0, -5)}` + userInfo.avatarUri
                        }
                    } else {
                        plus.naticeUI.toast('暂无数据')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => { plus.nativeUI.closeWaiting() })
        },
        callPhone(phone) {
            var btnArray = [
                { title: '拨打电话' },
                { title: '复制手机号码' }
            ]
            plus.nativeUI.actionSheet(
                {
                    cancel: '取消',
                    buttons: btnArray
                }, function(e) {
                    switch (e.index) {
                        case 1:
                            plus.device.dial(phone, false)
                            break
                        case 2:
                            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { // 判断iPhone|iPad|iPod|iOS
                                var UIPasteboard = plus.ios.importClass('UIPasteboard')
                                var generalPasteboard = UIPasteboard.generalPasteboard()
                                generalPasteboard.setValueforPasteboardType(phone, 'public.utf8-plain-text')
                            } else if (/(Android)/i.test(navigator.userAgent)) { // 判断Android
                                var Context = plus.android.importClass('android.content.Context')
                                var main = plus.android.runtimeMainActivity()
                                var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
                                plus.android.invoke(clip, 'setText', phone)
                            }
                            Toast('电话号码已复制')
                            break
                        default:
                            return
                    }
                })
        },
        sendEmail: function(email) {
            var $this = this
            var btnArray = [{
                title: '发送邮件'
            }, {
                title: '复制邮件地址'
            }]
            plus.nativeUI.actionSheet({
                cancel: '取消',
                buttons: btnArray
            }, function(e) {
                switch (e.index) {
                    case 1:
                        $this.sendMail(email)
                        break
                    case 2:
                        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { // 判断iPhone|iPad|iPod|iOS
                            var UIPasteboard = plus.ios.importClass('UIPasteboard')
                            var generalPasteboard = UIPasteboard.generalPasteboard()
                            generalPasteboard.setValueforPasteboardType(email, 'public.utf8-plain-text')
                        } else if (/(Android)/i.test(navigator.userAgent)) { // 判断Android
                            var Context = plus.android.importClass('android.content.Context')
                            var main = plus.android.runtimeMainActivity()
                            var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
                            plus.android.invoke(clip, 'setText', email)
                        }
                        Toast('邮件地址已复制')
                        break
                    default:
                        return
                }
            })
        },
        sendMail(mail) {
            var email = plus.messaging.createMessage(plus.messaging.TYPE_EMAIL)
            email.to = [mail]
            email.subject = mail + '的邮件'
            plus.messaging.sendMessage(email)
        },
        emitBack() {
            this.$emit('childEmitBack', '')
        }
    },
    filters: {
        firstName(value) {
            return value.substr(0, 1)
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.contact-book-detail{
    width:100%;
    height:100%;
    background: $bg1;
    z-index: 100;
    -webkit-user-select: none;
    &-container{
        -webkit-overflow-scrolling: touch;
        position: absolute;
        width:100%;
        top:45px;
        bottom:0px;
        overflow: scroll;
    }
    &-container::-webkit-scrollbar{display:none}
}
.person-detail-bgblock{
    background: $bg2;
}
.person-detail-block{
    height:120px;
    background: $bg2;
    border-radius: 5px;
    box-shadow: 0 0 6px $shadowc1;
    &__org{
        font-size:16px;
        font-family: "SimHei";
        font-weight: 800;
        color: $textc7;
    }
    &__name{
        font-size:24px;
        font-family: "SimHei";
        color: $textc5;
        font-weight: 800;
        bottom:40px;
    }
    &__duty{
        font-size:12px;
        font-family: "SimHei";
        color: $textc6;
        bottom:22px;
    }
    &__person{
    width: 52px;
    height: 52px;
    display: block;
    top: 15px;
    right:20px;
    text-align: center;
    background: $bg5;
    color: #fff;
    font-size:16px;
    font-family: "SimHei";
    border-radius: 52px;
    line-height: 52px;
    overflow: hidden;
    z-index: 4;
    .txt{
        font-style: normal;
    }
    .photo{
        position: absolute;
        top:50%;
        margin-top: -50%;
        width:100%;
        left: 50%;
        margin-left: -50%;
        z-index: 3;
    }
    }
}
.org-message-block{
    background: $bg1;
    h2{
        font-size:16px;
        font-family: "SimHei";
        font-weight: 800;
        color: $textc5;
        line-height:42px;
    }
}
.org-message-list{
    background: $bg2;
    position:relative;
    &:after,&:before {
    content: " ";
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform:scaleY(.5);
}
&:after {
    border-top:1px solid $linec1;
    top: -1px;
}
&:before {
    bottom: -1px;
    border-bottom:1px solid $linec1;
}
li{
    position:relative;
    padding:10px 0;
    &:before{
        content: " ";
        display:block;
        border-bottom:1px solid $linec1;
        height: 1px;
        position: absolute;
        left: 20px;
        right:0;
        bottom:-1px;
        -webkit-transform: scaleY(.5);
        transform:scaleY(.5);
    }
    p.t1{
        font-size:12px;
        color: #a5a5a7;
        line-height:20px;
        margin-left:20px;
    }
    p.t2{
        font-family: "SimHei";
        font-weight: 800;
        font-size:14px;
        color: #1a1f23;
        line-height:20px;
        margin-left:20px;
    }
    i.icon-mobile,i.icon-email{
        width: 60px;
        height: 60px;
        display: block;
        position: absolute;
        right: 0px;
        top: 0px;
        text-align: center;
        img {
            width: 18px;
            vertical-align: top;
            position: relative;
            top: 21px;
        }
    }
}
}
.line-1{
position:relative;
}
.line-1:after {
content: " ";
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 1px;
background-color:$linec1;
-webkit-transform: scaleY(.5);
transform:scaleY(.5);
}
.van-nav-bar__text{
    line-height: 42px;
    vertical-align: bottom;
}
.van-icon-arrow.van-nav-bar__arrow{
    line-height: 44px;
}
.van-search{padding:0;}
.van-icon van-icon-search{}
.van-cell van-field{}
</style>
