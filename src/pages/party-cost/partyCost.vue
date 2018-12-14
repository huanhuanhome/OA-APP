/*
 * @Author: LG
 * @Last Modified by: zhanglianhao
 * @Last Modified time: 2018-11-12 15:43:28
 */
/**
|--------------------------------------------------
| 党工团模块-党员缴费路由入口
|--------------------------------------------------
*/
<template>
    <div class="party-cost pa">
        <template v-if="!isSecretary">
            <partyMemberPage/>
        </template>
        <template v-else>
            <secretaryPage :secret-org-id="secretOrgId"/>
        </template>
    </div>
</template>
<script>
import bimHeader from '@/component/bimHeader/bimHeader'
import partyMemberPage from '@/pages/party-cost/partyMemberPage.vue'
import secretaryPage from '@/pages/party-cost/secretaryPage.vue'
import { isBranchSecretary, getUserPartyOrgId } from '@/api/oaUser'
import { getUserInfo } from '@/common/app'
export default {
    components: {
        bimHeader,
        partyMemberPage,
        secretaryPage
    },
    data() {
        return {
            pageTitle: '缴费记录',
            isSecretary: false,
            rightIcon: require('@/assets/images/df-tongji-active.png'),
            secretOrgId: 0
        }
    },
    created() {
        this.init()
    },
    methods: {
        getTitle(title) {
            this.pageTitle = title
        },
        async init() {
            try {
                const userId = getUserInfo().id
                // 当前登录用户是否是党支部书记
                this.isSecretary = await isBranchSecretary(userId)
                if (this.isSecretary) {
                    this.secretOrgId = await getUserPartyOrgId(userId)
                }
            } catch (error) {
                console.warn(error)
                plus.nativeUI.toast(error && error.message) // eslint-disable-line
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.party-cost{
    width:100%;
    top:0;
    bottom:0;
}
.txt-cost-yes,.txt-cost-no{
    font-size:14px;
    line-height:20px;
}
.txt-cost-yes{color: $textc4;}
.txt-cost-no{color: $primary;}
</style>