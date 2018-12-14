/*
 * @Author: BAICHONG
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-28 16:33:06
 */
/**
|--------------------------------------------------
| 登录页面
|--------------------------------------------------
*/
<template>
    <div class="login"
    :class="[{'Router--login':transition,'android--login':androidTop }]">
        <div class="logo">
            <img src="../../assets/images/bg.png" alt="log">
		</div>
		<div class="login-content">
            <van-cell-group class="input_group">
                <van-field 
                    class="input_name"
                    left-icon="contact"
                    clearable
                    type="number"
                    v-model="mobile"
                    placeholder="请输入用户名"
                    @focus="focus"
                    @blur="onBlur"
                />
                <van-field  
                    class="input_password"
                    type="password"
                    left-icon='password-not-view'
                    clearable 
                    v-model="password" 
                    placeholder="密码"
                    @focus="focus"
                    @blur="onBlur"
                />
            </van-cell-group>
            <div class="sub_btn">
                <van-button class="login_btn" @click="loginHandle">登录</van-button>
            </div>
        </div>
		<div class="link_area">
			<span class="forgetPassword" @click="handleForgetPassword">忘记密码</span>
		</div>
		<div class="footer" v-show="textShow">
            中路高科交通检测检验认证有限公司<br>
            北京公科桥梁技术有限公司<br>
            联合出品<span style="padding-left:10px;">{{version}}</span>
        </div>
    </div>
</template>

<script>
import { Button, Field, CellGroup, Toast, Icon, Popup } from 'vant'
import { getPublicKey } from '@/api/encryption'
import { login } from '@/api/login'
import { JSEncrypt } from 'jsencrypt'
import { userInit, getUserInfo } from '@/common/app'
import { LOCALSTORAGE_KEYS } from '@/common/globalConstCfg'
import { openWebview } from '@/utils/webview'
import { quitApp } from '@/utils/tools'
/* global plus */
export default {
    name: 'login',
    components: {
        [Button.name]: Button,
        [Field.name]: Field,
        [CellGroup.name]: CellGroup,
        [Icon.name]: Icon,
        [Popup.name]: Popup
    },
    data() {
        return {
            mobile: '',
            password: '',
            transition: false,
            textShow: true,
            androidTop: false,
            version: ''
        }
    },
    created() {
        // 获取版本信息
        plus.runtime.getProperty(plus.runtime.appid, inf => (this.version = 'V' + inf.version))
        // 安卓点击退出应用
        quitApp()
        // 动态改变webview的侧滑返回功能：
        const wv = plus.webview.currentWebview()
        // 关闭侧滑返回功能
        wv.setStyle({ 'popGesture': 'none' })
        // 保存上次登录账号密码
        const userInfo = getUserInfo()
        if (userInfo) {
            const mobile = userInfo.mobile
            const password = userInfo[LOCALSTORAGE_KEYS.PASSWORD]
            if (mobile && password) {
                this.mobile = mobile
                this.password = password
            }
        }
        // window.addEventListener('resize', this.setState)
        window.addEventListener('customEvent', _ => {
            this.mobile = ''
            this.password = ''
        })
    },
    beforeDestroy() {
        this.transition = false
        // window.removeEventListener('resize', this.setState)
    },
    methods: {
        setState() {
            if (document.body.scrollHeight === document.documentElement.clientHeight) {
                if (document.activeElement.tagName === 'INPUT') {
                    document.activeElement.blur()
                }
            }
        },
        focus(e) {
            this.transition = true
            if (plus.os.name === 'Android') {
                this.transition = true
                this.textShow = false
                this.androidTop = true
            }
        },
        onBlur() {
            if (plus.os.name === 'Android') {
                this.textShow = true
                this.androidTop = false
            }
        },
        // 处理登录
        async loginHandle() {
            try {
                if (!this.validate()) return
                plus.nativeUI.showWaiting()
                // 获取公钥
                const publicKey = await getPublicKey()
                // 设置加密公钥
                const encrypt = new JSEncrypt()
                encrypt.setPublicKey(publicKey)
                let mobile = this.mobile
                if (mobile) {
                    mobile = this.mobile.trim()
                }
                // 密码加密
                const password = encrypt.encrypt(this.password)
                await login({ mobile, password })
                await userInit({ password: this.password })
                plus.nativeUI.toast('登录成功')
                openWebview({
                    url: './main.html',
                    id: 'main',
                    style: {
                        top: 0,
                        bottom: 50
                    }
                })
                // 保存用户信息
            } catch (e) {
                console.warn('error  : ', e)
                plus.nativeUI.toast(e && e.message)
            } finally {
                plus.nativeUI.closeWaiting()
            }
        },
        // 忘记密码
        handleForgetPassword() {
            openWebview({
                url: './forgetPassword.html',
                id: 'forgetPassword'
            })
        },
        // 校验账号密码
        validate() {
            if (!(this.mobile && this.mobile.trim())) {
                Toast.fail('请输入账号')
                return false
            } else if (!(this.password && this.password.trim())) {
                Toast.fail('请输入密码')
                return false
            }
            return true
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.login{
    width: 100%;
    height: 100%;
    .logo{
        height: 300px;
        &>img{
            width: 100%;
            
        }
    }
    .login-content{
        margin-top: 10%;

        .input_group{
            width: 90%;
            margin: {
                left: auto;
                right: auto;
            }
        }
        .sub_btn{
            margin-top: 30px;
            .login_btn{
                display: block;
                width: 90%;
                background: #0d2e59;
                color: white;
                font-size: 14px;
                margin: {
                    left: auto;
                    right: auto;
                }
            }
        }
    }
    .link_area{
        padding-top: 15px;
        text-align: center;
        .forgetPassword{
            color: #31496e;
            font-size: 12px;
        }
    }
    .footer{
        color: #000;
        position: absolute;
        bottom: 10px;
        left: 0px;
        width: 100%;
        padding: 0px;
        margin: 0px;
        text-align: center;
        color: #ccc;
        font-size: 10px;
        line-height: 14px;
    }
}
.router--login{
    transition: all 600ms ease;
}
.android--login{
    position: absolute;
    width: 100%;
    top: -185px;
}
</style>