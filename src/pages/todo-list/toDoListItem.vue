<template>
    <div class="list__item">
        <div class="list__item_mark">
            <div class="item__round">
                <span class="round__text">{{title}}</span>
            </div>
        </div>
        <div class="list__item_detail">
            <div class="detail__top">
                <div class="detail__name" 
                    :style="{color: itemPropTop1 && itemPropTop1.color}">
                    {{itemPropTop1 && itemPropTop1.text}}
                </div>
                <div class="detail__state" 
                    :style="{color: itemPropTop2 && itemPropTop2.color}">
                    {{itemPropTop2 && itemPropTop2.text}}
                </div>
            </div>
            <div class="detail__bottom">
                <div class="detail__company" 
                    :style="{color: itemPropBot1 && itemPropBot1.color}">
                    {{itemPropBot1 && itemPropBot1.text}}
                </div>
                <div class="detail__date" 
                    :style="{color: itemPropBot2 && itemPropBot2.color}">
                    {{itemPropBot2 && itemPropBot2.text}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TodolistItem',
    props: {
        title: {},
        itemPropTop1: {},
        itemPropTop2: {},
        itemPropBot1: {},
        itemPropBot2: {}
    }
}
</script>

<style lang="scss">
.list__container{
    padding: 0 15px 0 15px;
    background: $bg2;
    .list__item{
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
            // display: flex;
            line-height: 25px;
            padding-left: 10px;
            padding-top: 12px;
            padding-bottom: 12px;
            font-size: 14px;
            .detail__top{
                display: flex;
                .detail__name{
                    width: calc(100% - 70px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .detail__state{
                    width: 70px;
                    text-align: right;
                    // color: #ff7200;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .detail__bottom{
                display: flex;
                
                .detail__company{
                    width: 50%;
                    color: #9b9a9a;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .detail__date{
                    width: 50%;
                    text-align: right;
                    color: #9b9a9a;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>