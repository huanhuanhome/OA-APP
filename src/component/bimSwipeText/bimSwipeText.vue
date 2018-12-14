/*
 * @Author: lg
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-09-27 16:42:03
 */
/**
|--------------------------------------------------
|  描述:文字轮播Swipe公用组件，带滚动区域头部标题
|  使用说明: @click="openWindow({url:'noticeDetail', extras:{noticeId:item.noticeId}})"
|  vantSwipe轮播组件的二次封装,父级引用形式：import bimSwipeText from '@/component/bimSwipeText/bimSwipeText'
|  props接收bimSwipeTextArray参数，数据类型Array
|  数据格式(例：父级_home.vue bimSwipeTextData): 
|  bimSwipeTextData: [
|     {
|        title: '标题',
|        content: '内容区域，使用v-html指令，可以有HTML标签',
|        publisher: '发布人',
|        date: '发布时间' 
|      }
|  ]
|--------------------------------------------------
*/
<template>
    <div class="bimSwipeText">
        <div class="bimSwipeText__titleBlock pr">
            <span class="pa"><img src="@/assets/images/tongzhi1.png"></span>
            <h2>{{ bimSwipeTitle }}</h2>
            <a href="javascript:void(0);" class="pa" @click="openWindow({url:'notice', extras:{}})">更多</a>
        </div>
        <van-swipe :autoplay="3000" @change="onChange" class="bimSwipeText__newsBlock" :touchable="false">
            <van-swipe-item v-for="(item,index) in bimSwipeTextArray" :key="index">
                <h3  @click="openWindow({url:'noticeDetail', extras:{ noticeId: item.noticeId }})">{{ item.title }}</h3>
                <div class="bimSwipeText__newsContent"  @click="openWindow({url:'noticeDetail', extras:{ noticeId: item.noticeId }})">{{ item.content | filterHtml }}</div>
                <div class="bimSwipeText__newsPublisher"  @click="openWindow({url:'noticeDetail', extras:{ noticeId: item.noticeId }})">
                    <p>{{ item.publisher }}</p>
                    <p>{{ item.date }}</p>
                </div>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>
<script>
import { openWebview } from '@/utils/webview'
import { Swipe, SwipeItem } from 'vant'
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    props: {
        bimSwipeTextArray: {
            type: Array,
            default: _ => []
        }
    },
    data() {
        return {
            bimSwipeTitle: ''
        }
    },
    created() {
        this.bimSwipeTitle = this.bimSwipeTextArray[0].title
    },
    filters: {
        filterHtml(val) {
            return val.replace(/<[^>]*>/g, '') //  去除文字的<...></...>标签
        }
    },
    methods: {
        openWindow(item) {
            if (Object.keys(item.extras).length > 0) {
                const objKeyArray = Object.keys(item.extras)
                openWebview({
                    url: item.url + '.html',
                    id: item.url
                }, {},
                {
                    noticeId: item.extras[objKeyArray[0]]
                })
            } else {
                openWebview({
                    url: item.url + '.html',
                    id: item.url
                })
            }
        },
        onChange(index) {
            this.bimSwipeTitle = this.bimSwipeTextArray[index].title
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.bimSwipeText{
    background: $bg2;
    font-size:12px;
    width: 100%;
    &__titleBlock{
        background: $bg4;
        font-size:12px;
        line-height:40px;
        height: 40px;
        overflow: hidden;
        width: 100%;
        span{
            width: 18px;
            height: 18px;
            display: block;
            top: 10px;
            left: 10px;
            img{
                width: 100%;
                vertical-align:top;
            }
        }
        h2{
            color:#0c2f58;
            display: block;
            margin:0 50px 0 35px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        a{
            color:#0072fe;
            padding:0 5px;
            display: inline-block;
            top:0;
            right:10px;
        }
    }
    &__newsBlock{
        background: $bg2;
        margin: 0 15px;
        padding: 20px 0 40px 0;
        color: $textc6;
        overflow: hidden;
        display: block;
        h3{
            font-weight: 600;
            text-align: center;
            margin-bottom:20px;
        }
    }
    &__newsContent{
        line-height: 22px;
        font-size:12px;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        height:66px;
        p{
            font-size:12px;
        }
    }
    &__newsPublisher{
        margin-top:20px;
        p{
            font-size:12px;
            width:100%;
            text-align:center;
        }
    }
}
/deep/ .van-swipe__indicators .van-swipe__indicator--active{
    background: #0d2e59;
}
</style>