/*
 * @Author: gl 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-11-02 10:40:17
 */
/**
|--------------------------------------------------
| 待办处理通告 ({{ noticeInfo.valueList.toString(',') }}){{ noticeInfo.hasOwnProperty('content')?  : '暂无' 
|--------------------------------------------------
*/
<template>
  <div class="approve notice">
      <bimHeader title="通知公告审批" left-arrow/>

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

      <div class="collapse-block" style="padding-top: 0px;">
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
                      <!-- <li><span class="label">标题：</span>{{ noticeInfo.title }}</li>
                      <li><span class="label">内容：</span>{{ noticeInfo.content | filterHtml }}</li> -->
                      <li><span class="label">是否转发：</span>{{ noticeInfo.hasTranspond ? '是' : '否' }}</li>
                      <li><span class="label">通知范围：</span>
                        {{ notifyScopeObj[noticeInfo.notifyScope] }} 
                        <!-- ({{ (noticeInfo.hasOwnProperty('valueList') && noticeInfo.valueList.length > 0) ? noticeInfo.valueList.toString(',') : '暂无' }}) -->
                        ({{ notifyScope || '暂无' }})
                    </li>
                  </ul>
              </van-collapse-item>
              
              <van-collapse-item title="历史审批记录" name="3">
                  <template v-if="noticeInfo.hasOwnProperty('hisOpinions') && noticeInfo.hisOpinions.length>0">
                        <ul class="g-list-2" v-for="hisItem in noticeInfo.hisOpinions">
                            <li><span class="label">所属部门：</span>{{ hisItem.createOrgName }}</li>
                            <li><span class="label">审批人：</span>{{ hisItem.createName }}</li>
                            <li><span class="label">审批意见：</span>{{ hisItem.opinion }}</li>
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
              <van-collapse-item title="审批" name="5">
                  <div class="i-textarea-block">
                      <van-field
                        v-model="opinionText"
                        type="textarea"
                        placeholder="请输入审批意见"
                        rows="1"
                        autosize
                      />
                      <span class="i-textarea-block__tools" @click="chooseOpinion()">
                          <i class="iconfont icon-community"></i>
                          快捷意见
                      </span>
                  </div>
              </van-collapse-item>
            </van-collapse>

            <div class="collapse-block__operation">
                <div class="submit-button plr15 pt20 pb20">
                  <van-button type="primary" size="large" class="submit-button__submit mb10" @click="handleNotice(true)">
                      通过
                  </van-button>
                  <van-button type="default" size="large" class="submit-button__cancel" @click="handleNotice(false)">
                      驳回
                  </van-button>
              </div>
            </div>
      </div>
      <van-actionsheet
          v-model="opinionShow"
          :actions="opinionActions"
          @select="onSelect"
      />
  </div>
</template>
<script>
import { approveDepartmentHead, approveExecutiveOffice } from '@/api/workflow'
import { parseTime } from '@/common/utils.js'
import { fire } from '@/utils/envent.js'
import bimHeader from '@/component/bimHeader/bimHeader'
import bimMedia from '@/component/bimMedia/bimMedia.vue'
import { getMappingCfg } from '@/common/app'
import { Collapse, CollapseItem, Button, Field, Actionsheet } from 'vant'
/* global plus */
export default {
    components: {
        bimHeader,
        bimMedia,
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [Button.name]: Button,
        [Field.name]: Field,
        [Actionsheet.name]: Actionsheet
    },
    data() {
        return {
            activeNames: ['1', '5'],
            mySelf: plus.webview.currentWebview(),
            noticeInfo: {},
            opinionText: '',
            notifyScopeObj: {
                NoticeSumOrg: '公司',
                NoticeOrg: '部门',
                NoticeUser: '个人'
            },
            opinionShow: false,
            opinionActions: [
                { name: '同意' },
                { name: '拟办' },
                { name: '收到' }
            ]
        }
    },
    computed: {
        notifyScope() {
            return (this.noticeInfo.moduleValueMappings || []).map(v => v.backup).join(',')
        }
    },
    filters: {
        dateTimeFarmat(value) {
            return parseTime(value, '{y}-{m}-{d}')
        },
        dateTimeFarmatHIS(value) {
            return parseTime(value, '{y}-{m}-{d} {h}:{i}:{s}')
        },
        filterHtml(val) {
            return val.replace(/<[^>]*>/g, '') //  去除文字的<...></...>标签
        }
    },
    created() {
        this.noticeInfo = this.mySelf.detailObj
        this.noticeInfo.noticeTypeChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Type'][this.noticeInfo.noticeType].value
        this.noticeInfo.importanceChinese = getMappingCfg()['WorkFlow.Personnel.Announcement.Importance'][this.noticeInfo.importance].value
    },
    methods: {
        handleNotice(data) { //  审批
            this.noticeInfo.opinion = {}
            this.noticeInfo.opinion.opinion = this.opinionText
            this.noticeInfo.opinion.agree = data
            const noticeInfoEntity = this.noticeInfo
            if (this.noticeInfo.nodeName === 'ApproveExecutiveOffice') {
                approveExecutiveOffice(noticeInfoEntity) //  第二级
                    .then(res => {
                        if (res) {
                            const openerWebview = this.mySelf.opener()
                            plus.nativeUI.toast('数据处理成功')
                            fire(openerWebview, 'customEvent')
                            this.overrideBack()
                        } else {
                            plus.nativeUI.toast('数据处理失败，请稍后重试')
                        }
                    })
                    .catch(e => {
                      plus.nativeUI.toast(e && e.message) // eslint-disable-line
                    })
                    .finally(() => {
                      plus.nativeUI.closeWaiting() // eslint-disable-line
                    })
            } else {
                approveDepartmentHead(noticeInfoEntity) //  第一级
                    .then(res => {
                        if (res) {
                            const openerWebview = this.mySelf.opener()
                            plus.nativeUI.toast('数据处理成功')
                            fire(openerWebview, 'customEvent')
                            this.overrideBack()
                        } else {
                            plus.nativeUI.toast('数据处理失败，请稍后重试')
                        }
                    })
                    .catch(e => {
                      plus.nativeUI.toast(e && e.message) // eslint-disable-line
                    })
                    .finally(() => {
                      plus.nativeUI.closeWaiting() // eslint-disable-line
                    })
            }
        },
        chooseOpinion() {
            this.opinionShow = true
        },
        onSelect(item) {
            this.opinionText = item.name
            this.opinionShow = false
        },
        overrideBack() {
            plus.webview.close(this.mySelf, 'auto')
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
.approve{
    width: 100%;
    height: 100%;
}
.notice{
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
      }
  }
}
.collapse-block{
    padding-top: 0px;
}
.submit-button__submit{
    background: $bg10;
    border-color: $bg10;
}
</style>