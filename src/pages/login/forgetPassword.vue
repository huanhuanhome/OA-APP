<template>
    <div class="forget">
        <bimHeader 
            title="重置密码"
            left-arrow
            class="forget__header"
        />
        <div class="forget-ps">
            <van-cell-group>
                <van-field 
                    @focus="e => focus.call(this, e, 'mobile')" 
                    v-model="mobile" placeholder="请输入手机号" 
                    @click-icon="getVerificationCode"
                >
                    <div class="smsCode" slot="icon" :style="disable">
                        获取验证码<span v-if="smsCodedisable">({{smsCodeTime}}秒)</span>
                    </div>
                </van-field>
                <van-field 
                    @focus="e => focus.call(this, e, 'smsCode')"
                    v-model="smsCode" placeholder="请输入验证码"
                >
                </van-field>
                <van-field
                    v-model="newPs"
                    type="password"
                    placeholder="请输入密码"
                />
            </van-cell-group>
            <password-strength :password="newPs" @score="onScore"/>
            <div class="forget-ps__btn_content">
                <van-button 
                    @touchstart.native.stop="submit" 
                    class="forget-ps__btn"
                    :style="btnColor"
                    :disabled="submitDisabled">
                    提交
                </van-button>
            </div>
        </div>
        <template>
            <van-number-keyboard
                :show="showKeyboard"
                extra-key="."
                close-button-text="完成"
                @blur="showKeyboard = false"
                @input="onInput"
                @delete="onDelete"
            />
            
        </template>
    </div>
</template>


<script>
import { NumberKeyboard, Button, Field, Cell, CellGroup } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
import { retrieve } from '@/api/smscode'
import { getPublicKey } from '@/api/encryption'
import { forgetPS } from '@/api/login'
import { JSEncrypt } from 'jsencrypt'
import regex from '@/common/regex.js'
import PasswordStrength from '@/component/PasswordStrength'
export default {
    components: {
        [NumberKeyboard.name]: NumberKeyboard,
        [Button.name]: Button,
        [Field.name]: Field,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        bimHeader,
        PasswordStrength
    },
    data() {
        return {
            showKeyboard: false,
            mobile: '',
            smsCode: '',
            newPs: '',
            encryptionNewPs: '',
            type: '',
            smsCodedisable: false,
            smsCodeTime: 30,
            timer: null,
            submitDisabled: true,
            score: null
        }
    },
    computed: {
        btnColor() {
            let color = '#9FBBF3'
            const mobile = this.mobile
            const newPs = this.newPs
            const smsCode = this.smsCode
            if (!mobile || !newPs || !smsCode) {
                this.submitDisabled = true
                color = '#9FBBF3'
            } else {
                this.submitDisabled = false
                color = '#4E7EB0'
            }
            return { background: color }
        },
        disable() {
            let color
            this.smsCodedisable ? color = '#ccc' : color = '#1D489E'
            return { color }
        }
    },
    created() {
        // alert(plus.navigator.isImmersedStatusbar());
        // alert(plus.navigator.getUserAgent())
    },
    methods: {
        // input获取焦点阻止默认键盘,打开自定义键盘
        focus(e, type) {
            this.showKeyboard = true
            this.type = type
            e.target.blur()
        },
        // 数字键盘输入按钮
        onInput(value) {
            this[this.type] += value
        },
        // 数字键盘删除按钮
        onDelete(del) {
            this[this.type] = this[this.type].slice(0, -1)
        },
        // 后退
        onClickLeft() {
            // this.$router.push({ name: 'Login' })
            var ws = plus.webview.currentWebview()
            if (ws.webviewPreload == true) {
                plus.webview.hide(ws, 'auto')
            } else {
                plus.webview.close(ws, 'auto')
            }
        },
        // 验证码倒计时
        setsmsCodeTime() {
            this.timer = setTimeout(_ => {
                this.smsCodeTime--
                if (this.smsCodeTime <= 0) {
                    clearTimeout(this.timer)
                    this.smsCodeTime = 30
                    this.smsCodedisable = false
                    return
                }
                this.timer = this.setsmsCodeTime()
            }, 1e3)
        },
        // 获取验证码
        getVerificationCode() {
            if (this.smsCodedisable) {
                return
            }
            const mobile = this.mobile.trim()
            if (!mobile) {
                plus.nativeUI.toast('请输入电话') // eslint-disable-line
                return
            }
            plus.nativeUI.showWaiting() // eslint-disable-line
            retrieve(mobile)
                .then(res => {
                    plus.nativeUI.toast('已发送') // eslint-disable-line
                    this.smsCodedisable = true
                    this.setsmsCodeTime()
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => { plus.nativeUI.closeWaiting() }) // eslint-disable-line
        },
        // 提交
        async submit() {
            if (this.submitDisabled) return
            const mobile = this.mobile
            const newPs = this.newPs
            const smsCode = this.smsCode
            if (!mobile || !newPs || !smsCode) {
                return plus.nativeUI.toast('不能为空') // eslint-disable-line
            }
            if (!regex.mobile.test(mobile.trim())) {
                return plus.nativeUI.toast('请输入正确的手机号') // eslint-disable-line
            }
            if (!/^[0-9]{4,}$/.test(smsCode)) {
                return plus.nativeUI.toast('验证码为4位以上数字') // eslint-disable-line
            }
            if (newPs.length < 8) {
                return plus.nativeUI.toast('密码长度不能小于 8 位')
            }
            if (this.score < 2) {
                return plus.nativeUI.toast('当前密码强度过于简单，请输入字母、数字和符号的组合')
            }

            plus.nativeUI.showWaiting() // eslint-disable-line
            const publicKey = await getPublicKey()
            // 设置加密公钥
            const encrypt = new JSEncrypt()
            encrypt.setPublicKey(publicKey)
            // 密码加密
            this.encryptionNewPs = encrypt.encrypt(newPs)
            const params = {
                mobile: this.mobile,
                smsCode: this.smsCode,
                newPs: this.encryptionNewPs
            }
            forgetPS(params)
                .then(res => {
                    plus.nativeUI.toast('重置密码成功，请重新登录') // eslint-disable-line
                    this.onClickLeft()
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => { plus.nativeUI.closeWaiting() }) // eslint-disable-line
        },
        onScore(score) {
            this.score = score
        }
    }
}
</script>

<style  lang="scss" scoped>
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.forget{
    /deep/ .van-hairline--bottom::after{
        border-bottom: 0px solid;
    }
}
.forget-ps{
    background: $bg2;
    padding: 100px 15px 10px 15px;
    width: calc(100% - 30px);
    .smsCode{
    }
    &__btn_content{
        width: 100%;
        display: flex;
        justify-content: center;
        .forget-ps__btn{
            margin-top: 25px;
            width: 90%;
            color: white;
            border: none;
        }
    }
    input{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;}
    ::-moz-placeholder {color:#ccc;font-size:14px;}
    ::-webkit-input-placeholder{color:#ccc;font-size:14px;}
    :-ms-input-placeholder{color:#ccc;font-size:14px;}
}
</style>