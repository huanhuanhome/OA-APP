/*
 * @Author: lg
 * @Last Modified by: LG
 * @Last Modified time: 2018-09-09 10:37:15
 */
/**
|--------------------------------------------------
| 首页天气组件
| 父级引用形式：import compWeather from '@/pages/home/compWeather'
|--------------------------------------------------
*/
<template>
    <div class="comp-weather" v-if="isShow">
        <p class="comp-weather__t1">{{ cityWeaterObj.city }}</p>
        <p class="comp-weather__t2">{{ cityWeaterObj.weather }}</p>
        <p class="comp-weather__t2">{{ cityWeaterObj.temperature }}℃</p>
        <p class="comp-weather__t2">{{ cityWeaterObj.winddirection }}风{{ cityWeaterObj.windpower }}级</p>
        <p class="comp-weather__t2">湿度:{{ cityWeaterObj.humidity }}%</p>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data() {
        return {
            weaterApi: 'https://restapi.amap.com/v3/weather/weatherInfo',
            weaterkey: 'bcaaa4ef0cea0f98b13f4dadf4dd1f2f',
            weaterCity: '',
            weaterExtensions: 'base',
            option: {},
            cityWeaterObj: {},
            isShow: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            plus.geolocation.getCurrentPosition(this.getCity, this.errorCB, this.option)   // eslint-disable-line
        },
        getCity(position) {
            this.weaterCity = position.address.city || '北京'
            const params = {
                key: this.weaterkey,
                city: this.weaterCity,
                extensions: this.weaterExtensions
            }
            axios.get(this.weaterApi, { params })
                .then(res => {
                    if (res.data && res.data.status > 0) {
                        this.isShow = true
                        const rd = res.data
                        if (rd.lives && rd.lives.length > 0) {
                            this.cityWeaterObj = rd.lives[0]
                        } else {
                            this.isShow = false
                            plus.nativeUI.toast('暂时无法获取天气信息') // eslint-disable-line
                        }
                    } else {
                        this.isShow = false
                        plus.nativeUI.toast('天气数据请求失败') // eslint-disable-line
                    }
                })
                .catch(e => {
                    this.isShow = false
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {}) // eslint-disable-line
        },
        errorCB() {
            plus.nativeUI.toast('无法获取当前位置') // eslint-disable-line
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/defalut-theme/color.scss';
.comp-weather{
    color: $bg2;
    line-height: 12px;
    width:80px;
    p{
        text-align: right;
    }
    &__t1{
        font-size:14px;
        font-weight: 800;
        line-height: 16px;
        margin-bottom: 5px;
    }
    &__t2{
        font-size: 0.6em;
        text-align: right;
    }
}
</style>