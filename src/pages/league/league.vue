/*
 * @Author: BAICHONG
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-07 10:58:25
 */
 /**
 |--------------------------------------------------
 | 党工团 页面-封面类型
 |--------------------------------------------------
 */
<template>
    <div class="league-book">

        <bimHeaderMyInfo :bimHeaderMyInfoObj="bimHeaderMyInfoData"/>

        <!-- <template v-if="isSwipeTextLoad">
            <bimSwipeText :bimSwipeTextArray="bimSwipeTextData"></bimSwipeText>
        </template> -->

        <div class="homeModuleBlock">
            <bimModulGroup :bimModuleGroupObj="bimModuleGroupData"></bimModulGroup>
        </div>

    </div>

</template>

<script>
import { getNoticeUserListByNumber } from '@/api/workflow'
import { getUserInfo } from '@/common/app.js'
import { parseTime } from '@/common/utils.js'
import bimHeaderMyInfo from '@/component/bimHeaderMyInfo/bimHeaderMyInfo'
import bimSwipeText from '@/component/bimSwipeText/bimSwipeText'
import bimModulGroup from '@/component/bimModulGroup/bimModulGroup'
import { quitApp } from '@/utils/tools'
export default {
    name: 'MainLeague',
    components: {
        bimHeaderMyInfo,
        bimSwipeText,
        bimModulGroup
    },
    data() {
        return {
            userId: '',
            isSwipeTextLoad: false,
            bimModuleGroupData: {
                /*
                *是否显示标题
                *标题
                *列
                *行
                *带线分割的模块组
                */
                bimMGDItems: [
                    [
                        {
                            iconUrl: require('@/assets/images/dangfei.png'),
                            iconUrlGray: require('@/assets/images/dangfei-gray.png'),
                            isTip: false,
                            title: '党费',
                            url: 'partyCost'
                            // link: { name: 'PartyCost' }
                        },
                        {
                            iconUrl: require('@/assets/images/fawen.png'),
                            iconUrlGray: require('@/assets/images/fawen-gray.png'),
                            isTip: false,
                            title: '发文',
                            url: ''
                        },
                        {
                            iconUrl: require('@/assets/images/gonghuihuodong.png'),
                            iconUrlGray: require('@/assets/images/gonghuihuodong-gray.png'),
                            isTip: false,
                            title: '工会活动',
                            url: ''
                        },
                        {
                            iconUrl: require('@/assets/images/gonghuifuli.png'),
                            iconUrlGray: require('@/assets/images/gonghuifuli-gray.png'),
                            isTip: false,
                            title: '工会福利',
                            url: ''
                        },
                        {
                            iconUrl: require('@/assets/images/huiyuanka.png'),
                            iconUrlGray: require('@/assets/images/huiyuanka-gray.png'),
                            isTip: false,
                            title: '会员卡',
                            url: ''
                        }
                    ]
                ]
            },
            bimSwipeTextData: [],
            bimHeaderMyInfoData: {
                name: '',
                date: ''
            },
            isLoadData: false
        }
    },
    created() {
        quitApp()
        const userInfo = getUserInfo()
        if (userInfo && userInfo.id !== '') {
            this.userId = userInfo.id
        }
        this.getSwipeText()
        // if (userInfo.partyInfoEntity) {
        //     this.bimModuleGroupData.bimMGDItems[0].forEach((item) => {
        //         if (item.title === '党费') {
        //             if (userInfo.partyInfoEntity.politicsStatus === 'official') {
        //                 item.url = 'party-cost.partyMemberPage'
        //             } else {
        //                 item.url = 'party-cost.secretaryPage'
        //             }
        //             if (userInfo.partyInfoEntity.politicsStatus === 'official' && getUserInfo().partyInfoEntity.dutyCode === 'ZhiBuShuJi') {
        //                 item.url = 'party-cost.secretaryPage'
        //             }
        //         }
        //     })
        // } else { // 如果没有党权限
        //     this.bimModuleGroupData.bimMGDItems[0].forEach((item) => {
        //         if (item.title === '党费') {
        //             item.url = ''
        //         }
        //     })
        // }
    },
    mounted() {
        var userInfo = getUserInfo()
        if (userInfo && userInfo.name !== '') {
            this.bimHeaderMyInfoData.name = userInfo.name
        }
    },
    methods: {
        getSwipeText() {
            const params = {
                userId: this.userId,
                startDate: '2018-01-01',
                endDate: '2018-12-31',
                number: 3
            }
            plus.nativeUI.showWaiting() // eslint-disable-line
            getNoticeUserListByNumber(params)
                .then(res => {
                    if (res && res.length > 0) {
                        res.forEach((val) => {
                            this.bimSwipeTextData.push({
                                noticeId: val.businessId,
                                noticeNumber: val.noticeNumber,
                                title: val.title,
                                content: val.content || '',
                                publisher: val.title,
                                date: parseTime(val.createDate, '{y}-{m}-{d} {h}:{i}:{s}')
                            })
                        })
                        setTimeout(() => {
                            this.isSwipeTextLoad = true
                        }, 300)
                    } else {
                        this.isSwipeTextLoad = false
                    }
                })
                .catch(e => {
                    console.warn(e)
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => { plus.nativeUI.closeWaiting() }) // eslint-disable-line
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/defalut-theme/color.scss';
.homeModuleBlock{
    background: $bg2;
}
</style>