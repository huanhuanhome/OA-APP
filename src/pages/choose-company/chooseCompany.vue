/*
 * @Author: LG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-30 16:49:16
 */
/**
|--------------------------------------------------
| 选择公司
|--------------------------------------------------
*/
<template>
    <div class="contact-book">

        <bimHeader title="选择公司" left-arrow @click-right="confirmBtn">
            <div class="btn-confirm" solt="right" style="top:6px;">
              <button>确认</button>
            </div>
        </bimHeader>

        <div class="org-group" style="padding-top:45px;" v-if="isDepartment">
          <van-cell-group>
            <van-cell v-for="(item, index) in companyArray" :key="index">
              <template slot="title">
                <div class="org-group__check-block">
                    <label for="checkbox1"></label>
                    <input name="checkbox1" type="checkbox" v-model="item.isChecked" @change="chooseCompany(item, index)"/>
                    <i class="iconfont icon-roundcheck" v-if="item.isChecked"></i>
                    <i class="iconfont icon-round" v-else></i>
                </div>
                <i class="org-group__icon"><img :src="item.iconUrl"/></i>
                <span class="org-group__title">{{ item.title }}</span>
              </template>
            </van-cell>
          </van-cell-group>
        </div>
    </div>
</template>
<script>
import { getOrgTreeByParameter } from '@/api/oaOrgTree'
import { fire } from '@/utils/envent.js'
import { Cell, CellGroup, Button, Icon } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
/* global plus */
export default {
    components: {
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Button.name]: Button,
        [Icon.name]: Icon,
        bimHeader
    },
    data() {
        return {
            mySelf: plus.webview.currentWebview(),
            isDepartment: false, // 是否有部门
            companyArray: [], // 公司组织列表
            chooseCompanys: [] // 选择的公司
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            if (this.mySelf.companyObj && this.mySelf.companyObj.length > 0) {
                this.chooseCompanys = this.mySelf.companyObj
            }
            plus.nativeUI.showWaiting()   // eslint-disable-line
            getOrgTreeByParameter()
                .then(res => {
                    this.handleCompanyObj(res, false) // false第一次 true第二次
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting() // eslint-disable-line
                })
        },
        handleCompanyObj(co, isChild) {
            // 处理部门  false第一次 true第二次
            const coData = isChild ? co.children : co
            if (coData) {
                this.isDepartment = true
                this.companyArray = []
                coData.forEach((departmentObj) => {
                    this.companyArray.push({
                        isChecked: false,
                        title: departmentObj['name'],
                        companyId: departmentObj['id'],
                        iconUrl: require('@/assets/images/application-active.png')
                    })
                })
                if (this.chooseCompanys && this.chooseCompanys.length > 0) {
                    this.companyArray.forEach((v) => {
                        for (let h = 0; h < this.chooseCompanys.length; h++) {
                            if (this.chooseCompanys[h].companyId == v.companyId) { // eslint-disable-line
                                v.isChecked = true
                            }
                        }
                    })
                }
            } else {
                this.isDepartment = false
            }
        },
        chooseCompany(item, index) {
            const ischeck = this.companyArray[index].isChecked
            this.$set(this.companyArray, index, this.companyArray[index])
            if (ischeck) { // true  增加选中人员到数组
                this.chooseCompanys.push({
                    companyId: item.companyId,
                    companyName: item.title,
                    backup: item.title
                })
            } else { // false  删除选中人员到数组
                const chooseCompanyIndex = this.chooseCompanys.findIndex((val) => {
                    return val.companyId === item.companyId
                })
                this.chooseCompanys.splice(chooseCompanyIndex, 1)
            }
        },
        confirmBtn() {
            const openerWebview = this.mySelf.opener()
            fire(openerWebview, 'departmentEvent', { chooseCompanys: this.chooseCompanys })
            plus.webview.close(this.mySelf, 'auto')
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '../../assets/css/defalut-theme/color.scss';
.contact-book{
    width:100%;
    height:100%;
    background: $bg1;
}
.btn-confirm{
  button{
    border:none;
    padding:0 8px;
    margin:0;
    background: $bg10;
    height:24px;
    font-size:12px;
    color: #fff;
    line-height:24px;
    border-radius: 3px;
  }
}
.org-group{
  &__icon{
    width: 18px;
    height: 18px;
    display: inline-block;
    top: 2px;
    left: 5px;
    text-align: center;
    position:relative;
    img{
      width: 100%;
      vertical-align: top;
    }
  }
  &__title{
      font-family: "SimHei";
      font-size: 14px;
      margin-left: 15px;
      margin-right:44px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  &__check-block{
      width:36px;
      height:36px;
      position: absolute;
      right:4px;
      top:4px;
      vertical-align: top;
      text-align: center;
      label,input{
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
        opacity:0;
      }
      label{z-index:6;}
      input{z-index:5;}
      i{
        color: $bg5;
        font-size:24px;
        line-height: 24px;
        position:relative;
        top:6px;
        vertical-align: top;
        z-index:3;
      }
  }
}
/deep/ .van-nav-bar__text{
    line-height: 42px;
    vertical-align: bottom;
}
/deep/ .van-icon-arrow.van-nav-bar__arrow{
    line-height: 44px;
}
.contact-book .van-search{padding:0;}
/deep/ .van-icon.van-icon-search{
        left: 0px;
    }
/deep/ .van-field__control{line-height:24px;font-size:12px;}
</style>