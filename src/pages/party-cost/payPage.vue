/*
 * @Author: LG
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-28 11:57:01
 */
/**
|--------------------------------------------------
| 党工团支付页面-弹窗
|--------------------------------------------------
*/
<template>
  <div class="pay-page">

    <div class="payable pr">
		<p class="payable__txt1">本期应缴纳党费</p>
		<p class="payable__txt2">￥{{ payPageData.money }}</p>
		<i class="iconfont icon-close icon-config" @click="closePayPage"></i>
    </div>

    <div class="van-hairline--bottom">
		<p class="pay-date clearfix">
			<span class="l">缴费日期</span>
			<span class="r">{{ payPageData.date | formatDt }}</span>
		</p>
    </div>

    <div class="pay-mode pb40">
		<p class="pay-mode__txt1">请选择支付方式</p>
		<ul 
			v-if="paymentList.length"
			class="pay-mode__icon"
			:style="{ justifyContent: paymentList.length === 1 ? 'center' : 'space-between' }">
			<li 
				v-for="item in paymentList"
				:key="item.type"
				@click="onPay(item)">
				<div class="pay-mode__icon--medium">
					<img :src="item.icon" :alt="item.description" />
				</div>
			</li>
		</ul>
		<p 
			v-else 
			class="pay-mode__txt1" 
			style="text-align: center;">
			暂无支付方式，请安装支付宝或微信
		</p>
    </div>

  </div>
</template>

<script>
import { parseTime } from '@/common/utils.js'
import { Icon } from 'vant'
export default {
    components: {
        [Icon.name]: Icon
    },
    props: {
        payPageData: {
            type: Object,
            default: _ => ({})
        }
    },
    filters: {
        formatDt(value) {
            return parseTime(value, '{y}-{m}-{d}')
        }
    },
    data() {
        return {
            appInfo: {
                wechat: {
                    pname: 'com.tencent.mm',
                    action: 'weixin://',
                    URLScheme: 'weixin://'
                },
                alipay: {
                    pname: 'com.eg.android.AlipayGphone',
                    action: 'alipays://',
                    URLScheme: 'alipay://'
                }
            },
            channels: [],
            paymentList: []
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            if (this.payPageData.message) {
                plus.nativeUI.toast(this.payPageData.message)
            }

            // 判断是否安装了支付软件
            if (this.checkApp(this.appInfo.alipay)) {
                this.paymentList.push({
                    icon: require('@/assets/images/pay-zhifubao.png'),
                    type: 'alipay',
                    description: '支付宝'
                })
            }

            if (this.checkApp(this.appInfo.wechat)) {
                this.paymentList.push({
                    icon: require('@/assets/images/pay-weixin.png'),
                    type: 'wxpay',
                    description: '微信'
                })
            }

            // 获取支付通道
            plus.payment.getChannels(channels => {
                if (channels && channels.length) {
                    this.channels = channels
                } else {
                    plus.nativeUI.alert('未获取到支付通道，请下载微信或者支付宝后再进行支付')
                }
            }, e => {
                plus.nativeUI.toast('获取支付渠道信权限失败')
                console.log('获取支付渠道信权限失败:' + e.message)
            })
        },
        onPay(item) {
            const pc = this.channels.find(v => v.id === item.type)
            const paySrc = {
                package: 'Sign=WXPay',
                appid: 'wx0411fa6a39d61297',
                sign: '59201CF6589202CB2CDAB26752472112',
                partnerid: '148xxx722',
                prepayid: 'wx2017xxxxxx2fc85d2cc3c0205143628',
                noncestr: 'k2xxxxx3X2D1O4YCz7Hn4s',
                timestamp: '1503312709'
            }
            const data = pc.id === 'wxpay' ? JSON.stringify(paySrc) : 'alipay'
            if (pc) {
                plus.payment.request(
                    pc,
                    data,
                    function(res) {

                    }, function(error) {
                        plus.nativeUI.alert(error.message)
                        console.error(error)
                    }
                )
            } else {
                plus.nativeUI.toast(`未获取到${item.description}支付通道，请安装后再支付`)
            }
        },
        // 检测手机是否安装了目标应用
        checkApp(appInfo) {
            const params = plus.os.name === 'Android'
                ? { pname: appInfo.pname, action: appInfo.action }
                : { action: appInfo.URLScheme }
            return plus.runtime.isApplicationExist(params)
        },
        closePayPage() {
            this.$emit('closePay')
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
@import '../../assets/font/iconfont.css';
.payable{
	&__txt1{
		padding-top:50px;
		padding-bottom:10px;
		text-align: center;
		font-size: 14px;
		color: $textc6;
		line-height: 24px;
	}
	&__txt2{
		padding-bottom:50px;
		text-align: center;
		font-size: 36px;
		color: $textc9;
		font-weight: 400;
		line-height: 42px;
	}
	&__icon{
		position: absolute;
		font-size:24px;
		top:20px;
		right:20px;
		color: #787878;
	}
}
.pay-date{
	padding: 0 30px;
	font-size: 12px;
	span{
		display:block;
		width:50%;
		float: left;
		line-height:24px;
		padding-bottom:5px;
	}
	.l{
		text-align: left;
		color: $textc6;
	}
	.r{
		text-align: right;
		color: $textc9;
	}
}
.pay-mode{
	padding: 0 30px;
	color: $textc6;
	&__txt1{
		font-size: 12px;
		line-height:24px;
		padding-top:5px;
	}

	&__icon {
		display: flex;
		flex-flow: row nowrap;
		width: 50%;
		margin: 0 auto;
		padding: 30px 0;
		justify-content: space-between;
	}

	&__icon--medium {
		width: 64px;
		img {
			width: 100%;
		}
	}
}

.icon-config {
	position: absolute;
	top: 6px;
	right: 6px;
	font-size: 20px;
}
</style>