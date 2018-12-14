<template>
    <div class="list__item"
        @click="handle"
    >
        <div class="list__item_mark">
            <div class="item__round">
                <span class="round__text">{{stateText}}</span>
            </div>
        </div>
        <div class="list__item_detail">
            <div class="detail__top">
                <div class="detail__name">{{topLeft}}</div>
                <div class="detail__state">{{topRight}}</div>
            </div>
            <div class="detail__bottom">
                <div class="detail__company">{{bottLeft}}</div>
                <div class="detail__date">{{bottRight}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        stateText: {
            type: String,
            default: '未'
        },
        topLeft: {
            type: String
        },
        topRight: {
            type: String
        },
        bottLeft: {
            type: String
        },
        bottRight: {
            type: String
        }
    },
    data() {
        return {
            entities: {
                'id': 3312,
                'nodeName': 'PublishMendClock',
                'description': '发起补签',
                'processId': 207,
                'state': 'Completed',
                'taskName': 'PublishMendClock',
                'createDate': 1535103341000,
                'endDate': 1535103341000,
                'owner': '测试员2',
                'assignee': '2',
                'assigneeName': '测试员2',
                'type': 'Normal',
                'duedate': null,
                'historyProcessInstanceId': 3309,
                'processInstanceId': 3308,
                'rootProcessInstanceId': 3308,
                'taskId': 3311,
                'opinion': null,
                'url': null,
                'businessId': '62',
                'subject': 'MendClock',
                'buttonName': null,
                'processName': '补签到流程',
                'processDesc': '补签到流程',
                'publishOrgName': 'OA测试',
                'processTypeName': null,
                'proPublishTime': 1535103341000,
                'proEndTime': null,
                'bizStatus': 'PUBLISH'
            }
        }
    },
    methods: {
        handle(item, index) {
        }
    }
}
</script>

<style lang="scss">
    .list__item{
        display: flex;
        height: 70px;
        border-bottom: 1px solid #ebebeb;
        background: white;
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
</style>