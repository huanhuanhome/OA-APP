/*
 * @Author: LG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-11-02 09:39:03
 */
/**
|--------------------------------------------------
| 通知公告模块详情
|--------------------------------------------------
*/
<template>
    <div class="notice">
        <bimHeader title="通知公告详情" left-arrow override :overrideBack="overrideBack"/>

            <div class="notice--block p20" style="padding-top:66px;">
                <h2>{{ noticeInfo.title }}</h2>
                <div class="notice--block__editer clearfix">
                    <span>{{ noticeInfo.createOrgName }}</span>
                    <span>发布人：{{ noticeInfo.createName }}</span>
                    <span>{{ noticeInfo.createDt | dateTimeFarmat }}</span>
                </div>
                <div class="van-hairline--bottom"></div>
                <div class="mt10 notice--block__content" v-html="noticeInfo.content"></div>
            </div>

            <template>
                <div class="collapse-block" style="padding-top:0;">
                    <van-collapse v-model="activeNames">
                        <van-collapse-item title="附件信息" name="1">
                            <bimMedia :files="noticeInfo.fileList"></bimMedia>
                        </van-collapse-item>

                        <van-collapse-item title="基础信息" name="2">
                            <ul class="g-list-2">
                                <li><span class="label">发起人：</span>{{ noticeInfo.createName }}</li>
                                <li><span class="label">部门：</span>{{ noticeInfo.createOrgName }}</li>
                                <li><span class="label">发起时间：</span>{{ noticeInfo.createDt | dateTimeFarmatHIS }}</li>
                                <li><span class="label">类型：</span>{{ noticeInfo.noticeTypeChinese }}</li>
                                <li><span class="label">重要程度：</span>{{ noticeInfo.importanceChinese }}</li>
                                <li><span class="label">是否转发：</span>{{ noticeInfo.hasTranspond ? '是' : '否' }}</li>
                                <li v-if="noticeInfo.hasTranspond"><span class="label">消息来源：</span>{{ noticeInfo.messageSource }}</li>
                                <li><span class="label">通知范围：</span>
                                    {{ notifyScopeObj[noticeInfo.notifyScope] }} <!-- moduleValueMappings -->
                                    <!-- ({{ (noticeInfo.hasOwnProperty('valueList') && noticeInfo.valueList.length > 0) ? noticeInfo.valueList.toString(',') : '暂无' }}) -->
                                    ({{ notifyScope || '暂无' }})
                                </li>
                            </ul>
                        </van-collapse-item>

                        <van-collapse-item title="审批详情" name="3">
                            <template v-if="noticeInfo.hasOwnProperty('hisOpinions') && noticeInfo.hisOpinions.length>0">
                                <ul class="g-list-2" v-for="(hisItem, index) in noticeInfo.hisOpinions" :key="index">
                                    <li><span class="label">所属部门：</span>{{ hisItem.createOrgName }}</li>
                                    <li><span class="label">审批人：</span>{{ hisItem.createName }}</li>
                                    <li><span class="label">审批意见：</span>{{ hisItem.opinion || '暂无' }}</li>
                                    <li><span class="label">审批时间：</span>{{ hisItem.createDt | dateTimeFarmatHIS }}</li>
                                    <li><span class="label">审批状态：</span>{{ hisItem.agree ? '已通过' : '已驳回' }}</li>
                                </ul>
                            </template>
                            <template v-else>
                                <ul class="g-list-2--nolabel">
                                    <li>暂无审批信息</li>
                                </ul>
                            </template>
                        </van-collapse-item>
                        <van-collapse-item title="已阅人员" name="4">
                            <h3 slot="title">已阅人员（{{ noticeInfo.noticeNumber }}/{{ noticeInfo.noticeAllReadNumber }}人）</h3>
                            <template v-if="noticeInfo.hasOwnProperty('readUserNameList') && noticeInfo.readUserNameList.length > 0">
                                <ul class="g-list-3 clearfix">
                                    <li v-for="(noticeUser, index) in noticeInfo.readUserNameList" :key="index">{{ noticeUser }}</li>
                                </ul>
                            </template>
                            <template v-else>
                                <ul class="g-list-2--nolabel">
                                    <li>暂无已阅人员</li>
                                </ul>
                            </template>
                        </van-collapse-item>
                    </van-collapse>
                </div>
            </template>
    </div>
</template>
<script>
import { getNoticeInfo, getHisDetail } from '@/api/workflow'
import { parseTime } from '@/common/utils.js'
import { fire } from '@/utils/envent.js'
import bimHeader from '@/component/bimHeader/bimHeader'
import { getMappingCfg } from '@/common/app'
import { Collapse, CollapseItem } from 'vant'
import bimMedia from '@/component/bimMedia/bimMedia.vue'
/* global plus */
export default {
    components: {
        bimHeader,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        bimMedia
    },
    data() {
        return {
            mySelf: plus.webview.currentWebview(),
            noticeId: '',
            hisTaskId: '',
            noticeInfo: {},
            notifyScopeObj: {
                NoticeSumOrg: '公司',
                NoticeOrg: '部门',
                NoticeUser: '个人'
            },
            activeNames: ['1', '2', '3', '4'],
            hasRead: true
        }
    },
    computed: {
        notifyScope() {
            return (this.noticeInfo.moduleValueMappings || []).map(v => v.backup).join(',')
        }
    },
    created() {
        if (this.mySelf.detailObj) { // 已完成进入
            this.hisTaskId = this.mySelf.detailObj.id
            this.doneInit()
        } else { //  模块列表进入
            this.noticeId = this.mySelf.noticeId
            if (this.mySelf.hasOwnProperty('hasRead')) {
                this.hasRead = this.mySelf.hasRead
            }
            this.modulInit()
        }
    },
    filters: {
        dateTimeFarmat(value) {
            return parseTime(value, '{y}-{m}-{d}')
        },
        dateTimeFarmatHIS(value) {
            return parseTime(value, '{y}-{m}-{d} {h}:{i}:{s}')
        }
    },
    methods: {
        doneInit() {
            plus.nativeUI.showWaiting()
            getHisDetail(this.hisTaskId)
                .then(res => {
                    if (res) {
                        res.importanceChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Importance'][res.importance].value
                        res.noticeTypeChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Type'][res.noticeType].value
                        res.noticeNumber = res.hasOwnProperty('readUserNameList') && res.readUserNameList.length > 0 ? res.readUserNameList.length : 0
                        this.noticeInfo = res
                    } else {
                        plus.nativeUI.toast('数据错误')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        modulInit() {
            const params = {
                noticeId: this.noticeId
            }
            plus.nativeUI.showWaiting()
            getNoticeInfo(params)
                .then(res => {
                    if (res) {
                        res.importanceChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Importance'][res.importance].value
                        res.noticeTypeChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Type'][res.noticeType].value
                        res.noticeNumber = (res.hasOwnProperty('readUserNameList') && res.readUserNameList.length > 0) ? res.readUserNameList.length : 0
                        this.noticeInfo = res
                    } else {
                        plus.nativeUI.toast('数据错误')
                    }
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        overrideBack() {
            if (this.hasRead) {
                plus.webview.close(this.mySelf, 'auto')
            } else {
                const openerWebview = this.mySelf.opener()
                fire(openerWebview, 'customEvent')
                plus.webview.close(this.mySelf, 'auto')
            }
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '@/assets/css/defalut-theme/color.scss';
.notice{
  width:100%;
  height:100%;
  &--block {
      padding-top: 46px;
      background: $bg2;
      font-size: 12px;
      line-height:24px;
      h2{
          font-size:14px;
          line-height:24px;
          color: $textc5;
          text-align: center;
          font-weight: 800;
          padding:0;
          margin:0;
      }
      &__editer{
          span{
              float: left;
              text-align: center;
              font-size:0.8em;
              width:33.3%;
          }
      }
      &__content{
        //   text-indent: 25px;
        img{max-width:100%;height:auto;margin:5px 0;}
      }
  }
}
</style>