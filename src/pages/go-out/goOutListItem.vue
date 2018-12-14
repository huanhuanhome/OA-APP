<template>
    <div class="list__item">
        <div class="list__item_mark">
            <div class="item__round">
                <span class="round__text">外</span>
            </div>
        </div>
        <div class="list__item_detail clearfix">
            <div class="detail__top">
                <div class="detail__name fcolor--go fl">
                    外出日期
                </div>
                <div class="detail__state fl">
                    {{item.outingStartDate | format}}
                </div>
                <div class="detail__time fr fcolor">
                    {{item.cumulativeLength}}小时
                </div>
            </div>
            <div class="detail__bottom clearfix">
                <div class="detail__company fcolor--go fl">
                    外出事由
                </div>
                <div class="detail__date fl">
                    {{item.outingCause}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { dateTimeFormatCustom } from '@/common/utils'
export default {
    name: 'TodolistItem',
    props: {
        item:{},
    },
    filters: {
        format: dateTimeFormatCustom('YYYY-MM-DD')
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.fcolor--go{
    color: black;
}
.fcolor{
    color: #276ab0;
}
.list__item{
    background: white;
    display: flex;
    height: 70px;
    border-bottom: 1px solid #ebebeb;
    padding: 10px 0 10px 0;
    &_mark{
        margin-top: 10px;
        .item__round{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid #276ab0;
            .round__text{
                line-height: 53px;
                text-align: center;
                display: block;
                font-size: 26px;
                color: #276ab0;
            }
        }
    }
    &_detail{
        width: calc(100% - 50px);
        line-height: 25px;
        padding-left: 10px;
        padding-top: 12px;
        padding-bottom: 12px;
        font-size: 14px;
        .detail__top{
            height: 25px;
            .detail__name{
                width: 70px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .detail__state{
                width: calc(100% - 110px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .detail__time{
                width: 40px;
            }
        }

        .detail__bottom{
            
            .detail__company{
                width: 70px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .detail__date{
                width: calc(100% - 70px);
                color: #9b9a9a;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>