/*
 * @Author: BAICHONG 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-11-01 10:19:33
 */
/**
|--------------------------------------------------
| 考勤-打卡
|--------------------------------------------------
*/
<template>
    <div class="pa content--tb2">
        <bimHeader
            title="考勤-打卡"
            left-arrow
            @click-right="onClickRight"
        >
            <div class="signIn--header" v-action="'signInRecord'"><!--  v-if="!isLeader"领导无法进入日历统计页面 -->
                <img class="signIn-img" src="../../assets/images/punch-card-record.png">
            </div>
        </bimHeader>
        <div class="container pa content--tb" :style="{bottom: isLeader?'0' : '50px'}">
            <!-- 内容 -->
            <div class="container__content">

                <!-- 打卡人员姓名和打卡时间 -->
                <div class="pl20 pr20 pb10">
                    <p class="push-user--txt">
                        <span>{{ userObj.name }}</span>
                        <i class="push-user--txt__first-name">{{ userObj.name | firstName }}</i>
                        <i class="push-user--txt__datetime">{{ todayFormat }}</i>
                        <span>{{ userObj.mainOrgName }}</span>
                    </p>
                </div>
                <div class="van-hairline--bottom mb20"></div>

                <div class="container__content_msg">
                    <!-- 签到 start -->
                    <div class="container__content_signIn">
                        <div class="sign">
                            <div class="signIn_time_setting">上班时间: {{hitCardOption&&hitCardOption.signStartTime}}</div>
                            <div class="sign_location">
                                <div class="location">
                                    <img class="location_img" src="../../assets/images/location.png" alt="">
                                </div>
                                <div class="location_text">地点: {{hitCardOption&&hitCardOption.location}}</div>
                            </div>
                        </div>
                        <div class="signIn_time">
                            <div class="signIn_time_msg"  v-if="signTime">
                                签到时间: {{ signTime | dateTimeFormat }}<!-- signData && signData. -->
                                <span class="late_time" v-if="!holiday&&(!isLeader && isLate)">迟到</span>
                            </div>
                            <!-- 迟到时间暂时不显示 -->
                        </div>
                    </div>
                    <!-- 签到 end -->

                    <!-- 签退 start -->
                    <div class="container__content_signOut">
                        <div class="sign">
                            <div class="signOut_time_setting">下班时间: {{hitCardOption&&hitCardOption.signEndTime}}</div>
                            <div class="sign_location">
                                <div class="location">
                                    <img class="location_img" src="../../assets/images/location.png" alt="">
                                </div>
                                <div class="location_text">地点: {{hitCardOption&&hitCardOption.location}}</div>
                            </div>
                        </div>
                        <div class="signOut_time">
                            <div class="signOut_time_msg"  v-if="signBackTime">
                                签{{isLeader? '到':'退'}}时间:
                                {{signBackTime | dateTimeFormat}}
                                <span class="leave_early" v-if="!isLeader&&leaveEarly">早退</span>
                            </div>
                            <!-- 早退时间暂时不显示 -->
                        </div>
                    </div>
                    <!-- 签退 end -->
                </div>
                <div class="sign_btn">
                    <!-- 签到按钮 start -->
                    <div v-if="!isSign" class="container__content_signIn">
                        <div class="sign_btn_outside" :class="(isInGPS && !holiday) ? 'outsideActiveSignIn': 'outsideDisable'">
                            <div 
                                class="sign_btn_inside" 
                                :class="(isInGPS && !holiday) ? 'signInActive': 'signOutDisable'"
                                @click="punchSign"
                            >
                                <div class="sign_btn_inside_text">签到打卡<br>{{dateTime}}</div>
                            </div>
                            
                        </div>
                    </div>
                    <!-- 签到按钮 end -->

                    <!-- 签退按钮 start -->
                    <div v-if="isSign" class="container__content_signOut">
                        <div class="sign_btn_outside" :class="isInGPS ? 'outsideActive': 'outsideDisable'">
                            <div 
                                class="sign_btn_inside" 
                                :class="isInGPS ? 'signOutActive': 'signOutDisable'" 
                                @click="punchSign"
                            >
                                <div class="sign_btn_inside_text">
                                    {{isLeader?'已签到':'签退打卡'}}<br>{{dateTime}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 签退按钮 end -->

                    <!-- GPS提示信息  start -->
                    <div class="reminderMsg">
                        <div class="reminderMsg_content">
                            <img v-if="isInGPS" class="reminderMsg_content_img" src="../../assets/images/location-neary-by.png" alt="">
                            <img v-else class="reminderMsg_content_img" src="../../assets/images/location.png" alt="">
                        </div>
                        <div class="reminderMsg_text">
                            {{isInGPS ? '已进入GPS考勤范围' : '未进入GPS考勤范围'}}
                        </div>
                    </div>
                    <div class="GPS_msg" v-if="!isInGPS">
                        请点击左下方打卡刷新位置信息
                    </div>
                    <!-- GPS提示信息  end -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* global plus */
/* global BMap */
(function() {
    window.BMap_loadScriptTime = (new Date()).getTime()
    const baidu = document.createElement('script')
    baidu.src = 'http://api.map.baidu.com/getscript?v=2.0&ak=wjSQGnZXMYSyqeMjOB6arbgsaOiQlv2m&services=&t=20180823194355'
    document.body.appendChild(baidu)
})()
import { NavBar } from 'vant'
import { getSignInfoByUserId, judgeHasHolidayByDateAndOrgId } from '@/api/attendanceStandardSetting'
import { getRealSignDayListByUserIdAndDate } from '@/api/attendanceCount'
import { signCard } from '@/api/sign'
import { LOCALSTORAGE_KEYS } from '@/common/globalConstCfg'
import { getUserInfo } from '@/common/app'
import { parseTime, typeOf } from '@/common/utils'
import { getTimeString, dateTimeFormatCustom } from '@/common/utils'
import bimHeader from '@/component/bimHeader/bimHeader'
import { openWebview } from '@/utils/webview'
import { action } from '@/directive/index.js'

export default {
    components: {
        [NavBar.name]: NavBar,
        bimHeader
    },
    directives: {
        action
    },
    filters: {
        dateTimeFormat: dateTimeFormatCustom('HH:mm'),
        firstName(value) {
            return value.substr(0, 1)
        }
    },
    data() {
        return {
            watchId: null, // 监听id
            option: { // 获取位置参数
                maximumAge: 10e3,
                provider: 'baidu'
            },
            hitCardOption: null, // 打卡配置 createUserId:1,hasAvailable:true,id:4379,latitude:38.88,location:"大连海事大学",longitude:121.54,radius:3,remarks:"测试",signEndDate:6,signEndTime:"17:00:00",signStartDate:1,signStartTime:"08:00:00"
            dateTime: getTimeString(), // 获取时间
            distance: null, // 距离主职公司距离
            signData: null, // 当前打卡状态
            holiday: false, // 是否是放假
            lateTime: '', // 迟到时间
            isLeader: getUserInfo()[LOCALSTORAGE_KEYS.IS_LEADER], // 是不是领导
            userObj: {
                name: '', // 名字
                mainOrgName: '' //  组织部门名字
            },
            orgPosition: null, // 所在公司定位点对象
            // 百度地图初始化实例
            baiduMap: null,
            // 百度地图转换实例
            convertor: null,
            checkBaiduMapTimer: null,
            userId: null,
            signInAfternoon: false // 领导下午打没打卡
        }
    },
    computed: {
        // 判断是否签到
        isSign() {
            if (this.isLeader) { // 领导
                if (new Date().getHours() < 12) { // 上午
                    return this.signData && this.signData.dateList && this.signData.dateList.length > 0
                } else {
                    return this.signData && this.signData.dateList && this.signData.dateList.some(item => item > (+new Date().setHours(12, 0, 0)))
                }
            } else {
                return this.signData && this.signData.signTime
            }
        },
        // 根据距离判断是不是范围内
        isInGPS() {
            if (this.distance && this.hitCardOption) {
                return this.distance <= this.hitCardOption.radius * 1000 // 返回千米需要 * 1000
            }
        },
        // 签到配置时间戳(秒)
        signStartTime() {
            if (this.hitCardOption) {
                const signStartTime = this.hitCardOption.signStartTime.split(':')
                return +new Date().setHours(signStartTime[0], signStartTime[1], 0, 0) / 1000 + ((Number(this.hitCardOption.signStartElasticityTime) || 0) * 60)
            }
        },
        // 签退配置时间戳(秒)
        signEndTime() {
            if (this.hitCardOption) {
                const signEndTime = this.hitCardOption.signEndTime.split(':')
                return +new Date().setHours(signEndTime[0], signEndTime[1], 0, 0) / 1000 - ((Number(this.hitCardOption.signEndElasticityTime) || 0) * 60)
            }
        },
        // 是否迟到
        isLate: {
            get() {
                if (!this.isSign && this.signStartTime) {
                    return new Date().getTime() / 1000 > this.signStartTime
                } else {
                    return this.signData.signTime / 1000 > this.signStartTime
                }
            },
            set(val) {
                const hour = ~~((new Date().getTime() / 1000 - this.signStartTime) / 60 / 60)
                const minus = ~~((new Date().getTime() / 1000 - this.signStartTime) / 60 % 60)
                this.lateTime = `${hour}小时${minus}分钟`
            }
        },
        // 早退时间
        leaveEarly() {
            if (this.signData && this.signData.signBackTime) {
                return this.signData.signBackTime / 1000 < this.signEndTime
            }
            return false
        },
        // 签到时间
        signTime() {
            if (this.isLeader) {
                let arr = this.signData && this.signData.dateList
                if (typeOf(arr) === 'array') {
                    arr = arr.filter(item => (item < (+new Date().setHours(12, 0, 0))))
                    arr = arr.length > 0 && arr[0]
                    return arr
                } else {
                    return ''
                }
            } else {
                return this.signData && this.signData.signTime
            }
        },
        // 签退时间
        signBackTime() {
            if (this.isLeader) {
                let arr = this.signData && this.signData.dateList
                if (typeOf(arr) === 'array') {
                    arr = arr.filter(item => item > (+new Date().setHours(12, 0, 0)))
                    arr = arr.length > 0 && arr[0]
                    return arr
                } else {
                    return ''
                }
            } else {
                return this.signData && this.signData.signBackTime
            }
        },
        todayFormat() {
            return parseTime(new Date(), '{y}.{m}.{d}')
        }
    },
    created() {
        const userInfo = getUserInfo()
        this.userObj.name = userInfo.name || '暂无'
        this.userObj.mainOrgName = userInfo.mainOrgName || '暂无'
        this.userId = userInfo.id
        this.signInfoEntity = userInfo.signInfoEntity
        this.checkBaiduMap()
        this.getIsHoliday()
    },
    methods: {
        checkBaiduMap() {
            this.checkBaiduMapTimer = setTimeout(_ => {
                window.BMap ? (this.init()) : (this.checkBaiduMapTimer = this.checkBaiduMap())
            }, 100)
        },
        // 初始化
        init() {
            this.baiduMap = new BMap.Map()
            this.convertor = new BMap.Convertor()
            this.getHitCardOption()
            this.getSignDetail()
        },
        // 点击刷新
        refurbish() {
            if (this.hitCardOption) {
                plus.nativeUI.showWaiting()
                plus.geolocation.getCurrentPosition(this.successCB, this.errorCB, this.option)
                setTimeout(_ => {
                    plus.nativeUI.closeWaiting()
                }, 1e3)
            } else {
                plus.nativeUI.toast('位置信息未设置')
            }
        },
        // 获取今天是不是放假
        async getIsHoliday() {
            try {
                plus.nativeUI.showWaiting()
                const res = await judgeHasHolidayByDateAndOrgId()
                plus.nativeUI.showWaiting()
                this.holiday = res
            } catch (e) {
                console.warn(e)
            }
        },
        // 获取打卡配置信息
        getHitCardOption() {
            plus.nativeUI.showWaiting()
            getSignInfoByUserId(getUserInfo().id)
                .then(hitCardOption => {
                    this.hitCardOption = hitCardOption
                    // 是否配置打卡信息
                    if (hitCardOption) {
                        if (!this.watchId) this.watchPosition()
                        this.orgPosition = new BMap.Point(hitCardOption.longitude, hitCardOption.latitude)
                        // this.getSignInfoBetweenTime()
                        // 添加应用切换到后台监听
                        if (this.watchId) {
                            document.addEventListener('pause', _ => {
                                this.closePositionWacth()
                            }, false)
                            document.addEventListener('resume', _ => {
                                this.watchPosition()
                            }, false)
                        }
                    } else {
                        plus.nativeUI.toast('位置信息未设置')
                    }
                })
                .catch(e => {
                    console.warn(e && e.message)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(_ => { plus.nativeUI.closeWaiting() })
        },
        // 导航条右侧按钮
        onClickRight() {
            openWebview({ url: 'signInRecord.html', id: 'signInRecord' })
        },
        // 打卡
        punchSign() {
            if (this.holiday) { return plus.nativeUI.toast('节假日无法打卡') }
            // 未在GPS范围内
            if (!this.isInGPS) { return plus.nativeUI.toast('未在范围内') }
            // 普通员工打卡时间校验,上班打卡不在工作时间内无效,下班时间在工作时间之前无效
            if (!this.isLeader) { // 不是领导
                if (this.isSign) { // 签退小于上班时间
                    if ((+new Date() / 1000) < this.signStartTime) { // signStartTime signEndTime
                        return plus.nativeUI.toast('无效签退')
                    }
                } else { // 签到大于下班时间
                    if ((+new Date() / 1000) > this.signEndTime) {
                        return plus.nativeUI.toast('无效签到')
                    }
                }
            } else {
                if (this.isSign) {
                    return plus.nativeUI.toast('已签到')
                }
            }
            const submit = {
                'signDate': new Date(),
                'signInfoId': this.hitCardOption.id,
                'planDate': this.isSign ? this.hitCardOption.signEndTime : this.hitCardOption.signStartTime,
                'signUserId': getUserInfo().id
            }
            plus.nativeUI.showWaiting()
            signCard(submit)
                .then(res => {
                    plus.nativeUI.toast('打卡成功')
                    this.getSignDetail()
                })
                .catch(e => {
                    console.warn(e && e.message)
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(_ => { plus.nativeUI.closeWaiting() })
        },
        // 打卡获取详情
        getSignDetail() {
            plus.nativeUI.showWaiting()
            getRealSignDayListByUserIdAndDate()
                .then(res => {
                    this.signData = res
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(_ => { plus.nativeUI.closeWaiting() })
        },
        // =========================plus start=======================
        // 开始监听位置
        watchPosition() {
            this.watchId = plus.geolocation.watchPosition(this.successCB, this.errorCB, this.option)
        },
        // 监听位置成功回调
        successCB(position) {
            // 位置信息,建议保留
            console.log(position)
            this.dateTime = getTimeString()
            // 刷新迟到时间
            if (!this.isSign && this.isLate) this.isLate = ''
            let userPoint = null
            // GPS坐标 | 原生坐标 | 大地坐标系
            if (position.coordsType === 'wgs84') {
                userPoint = new BMap.Point(position.coords.longitude, position.coords.latitude)
                this.convertor.translate([userPoint], 1, 5, this.translateCallback)
            // 谷歌坐标 | 国测局坐标
            } else if (position.coordsType === 'gcj02') {
                userPoint = new BMap.Point(position.coords.longitude, position.coords.latitude)
                this.convertor.translate([userPoint], 3, 5, this.translateCallback)
            // 百度坐标
            } else if (position.coordsType === 'bd09ll') {
                userPoint = new BMap.Point(position.coords.longitude, position.coords.latitude)
                // 计算距离
                this.distance = this.baiduMap.getDistance(this.orgPosition, userPoint)
                console.log(this.distance)
            }
        },
        // 坐标转换完之后的回调函数
        translateCallback(data) {
            // 计算距离
            if (data.status === 0) this.distance = this.baiduMap.getDistance(this.orgPosition, data.points[0])
            console.log(this.distance) // 查看定位准确度
        },
        // 监听位置失败回调
        errorCB(err) {
            console.warn(err)
            plus.nativeUI.toast('监听位置失败')
        },
        // 取消监听位置
        closePositionWacth() {
            plus.geolocation.clearWatch(this.watchId)
            this.watchId = null
        }
        // =========================plus end=======================
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.signIn--header {
    position: absolute;
    height: 46px;
    width: 50px;
    top: -46px;
    display: flex;
    right: -30px;
    align-items: center;
}
.signIn-img{
    width: 20px;
    display: block;
}
.container {
    &__content {
        background: white;
        padding-top: 20px;

        &_msg {
            position: relative;
            font-size: 14px;
            // 线
            &::before{
                content: '';
                width: 0.5px;
                height: 105px;
                background: #4D8ECA;
                position: absolute;
                left: 29px;
                top: 28px;
            }
            .container__content_signIn,
            .container__content_signOut {
                position: relative;
                // 圆点
                &::before {
                    content: '';
                    width: 10px;
                    height: 10px;
                    background: #2776BF;
                    border-radius: 50%;
                    position: absolute;
                    top: 18px;
                    left: 24px;
                }
                .signIn_time, 
                .signOut_time,
                .sign{
                    padding-left: 50px;
                }
                // 签到时间
                .signIn_time{
                    height: 21px;
                    display: flex;
                    white-space: nowrap;
                    
                    &_msg{
                        width: 100%;
                        .late_time{
                            background: $bg7;
                            color: $textc2;
                            margin-left: 10px;
                            height: 20px;
                            line-height: 22px;
                            text-align: center;
                            width: 40px;
                            border-radius: 10px;
                            display: inline-block;
                        }
                    }
                }
                // 签退时间
                .signOut_time{
                    height: 21px;
                    display: flex;
                    white-space: nowrap;

                    &_msg{
                        width: 100%;
                        .leave_early{
                            background: $bg8;
                            color: $textc2;
                            margin-left: 10px;
                            height: 20px;
                            line-height: 22px;
                            text-align: center;
                            width: 40px;
                            border-radius: 10px;
                            display: inline-block;
                        }
                    }

                }

                .sign {
                    
                    .signIn_time_setting, .signOut_time_setting {
                        color: #282828;
                        line-height: 28px;
                    }

                    &_location {
                        color: #B1B0B0;
                        display: flex;
                        align-items: center;
                        line-height: 28px;
                        
                        .location{
                            width: 14px;
                            height: 14px;
                            .location_img {
                                width: 14px;
                                height: 14px;
                                display: block;
                            }
                        }

                        .location_text {
                            padding-left: 5px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        
                    }
                }

                .signIn_time, .signOut_time{ // 签到和迟到
                    line-height: 20px;
                    color: #2776BF;
                }
                .late_time, .leave_early {
                    color: #FF6A6A;
                }
            }
            .container__content_signIn {
            }
            .container__content_signOut{
                margin-top: 30px;
            }
        }
        .sign_btn {
            margin-top: 30px;
            padding-bottom: 12px;

            .container__content_signIn,
            .container__content_signOut{
                
                .sign_btn_outside {
                    position: relative;
                    overflow: hidden;
                    width: 150px;
                    height: 150px;
                    // background: #BED6EC;
                    border-radius: 50%;
                    margin: {
                        left: auto;
                        right: auto;
                        // top: 0px;
                        // bottom: 0px;
                    }

                    .sign_btn_inside {
                        width: 130px;
                        height: 130px;
                        
                        border-radius: 50%;
                        margin: {
                            left: auto;
                            right: auto;
                            top: 10px;
                        }
                        &_text {
                            color: white;
                            font-size: 20px;
                            text-align: center;
                            padding: {
                                top: 35px;
                                bottom: 35px;
                            }
                            line-height: 30px;
                            font-weight: 700;
                        }
                    }
                }
            }

            .reminderMsg{
                display: flex;
                align-items: center;
                justify-content: center;
                padding-top: 20px;
                padding-bottom: 8px;

                &_content {
                    width: 14px;
                    height: 14px;

                    &_img {
                        width: 14px;
                        height: 14px;
                        display: block;
                    }
                }

                &_text{
                    line-height: 14px;
                }
            }

            .GPS_msg{
                font-size: 10px;
                color: #3A7FC3;
                text-align: center;
            }
        }
    }
    
}
// 签到GPS范围内颜色
.signInActive{
    background: #2776BF;
}
// 签到GPS范围外颜色
.signInDisable{
    background: #ccc;
}
// 签退内圈GPS范围颜色
.signOutActive {
    background: #3EB7AA;
}
// 签退内圈GPS外颜色
.signOutDisable {
    background: #B6B6B6;
}
// 打卡外圈颜色GPS范围内
.outsideActive{
    background: #E6E6E6;
}
// 打卡外圈颜色GPS范围外
.outsideDisable{
    background: #E6E6E6;
}
// 签到 外圈颜色 GPS 范围内
.outsideActiveSignIn{
    background: #BED6EC;
}
.push-user--txt{
    position: relative;
    span{
        font-size:14px;
        line-height: 16px;
        display: block;
        color: $textc10;
        margin-left: 42px;
    }
    span:first-child{
        padding-top: 4px;
    }
    span:last-child{
        font-size:12px;
        color: $textc11;
    }
    &__first-name{
        position: absolute;
        width: 36px;
        height: 36px;
        display: inline-block;
        top: 0px;
        text-align: center;
        background: $bg5;
        color: #fff;
        font-size:14px;
        font-family: "SimHei";
        border-radius: 36px;
        line-height: 36px;
        font-style: normal;
    }
    &__datetime{
        font-style: normal;
        font-size:14px;
        line-height: 20px;
        position: absolute;
        display: inline-block;
        right: 0;
        color: $textc12;
        top: 8px;
    }
}
</style>