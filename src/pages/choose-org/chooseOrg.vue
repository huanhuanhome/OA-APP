/*
 * @Author: LG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-31 10:20:17
 */
/**
|--------------------------------------------------
| 选择部门
|--------------------------------------------------
*/
<template>
    <div class="contact-book pr">

        <bimHeader title="选择部门" left-arrow override :overrideBack="overrideBack" @click-right="confirmBtn">
            <div class="btn-confirm" solt="right" style="top:6px;">
              <button>确认</button>
            </div>
        </bimHeader>

        <!--面包屑导航-->
        <div class="g-line-bottom" style="padding-top:45px;">
        <div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
            <div class="mui-scroll">
                <a class="mui-control-item other" v-for="(crumb,index) in crumbs" :key="index" :class="{now:(index+1==crumbs.length) ? true : false}" @tap="changeCrumb(crumb.companyObj, index)">{{crumb.companyName}}</a>
            </div>
        </div>
        </div>

        <div class="scroll-block" style="top:87px;">

            <div class="org-group1" v-if="isDepartment">
                <van-cell-group>
                    <van-cell v-for="(item, index) in orgArray" :key="index" :is-link="item.isChildren">
                        <template slot="title">
                            <div class="org-group1__check-block" v-if="item.isShowCheckbox">
                                <label for="checkbox1"></label>
                                <input name="checkbox1" type="checkbox" v-model="item.isChecked" @change.stop="chooseOrg(item, index)">
                                <i class="iconfont icon-roundcheck" v-if="item.isChecked"></i>
                                <i class="iconfont icon-round" v-else></i>
                            </div>
                            <i class="org-group1__icon"><img :src="item.iconUrl"/></i>
                            <span class="org-group1__title" @tap.stop="handleOrgData(item)">
                                {{ item.title }}<span v-if="item.isPerson">({{ item['personNum'] }})</span>
                            </span>
                        </template>
                    </van-cell>
                </van-cell-group>
            </div>

        </div>

    </div>
</template>
<script>
import { getOrgTreeByParameter } from '@/api/oaOrgTree'
import { fire } from '@/utils/envent.js'
import { Cell, CellGroup, Button, Icon } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
/* global plus */
/* global mui */
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
            orgArray: [], // 公司组织列表
            crumbs: [], // 面包屑
            chooseOrgs: [] // 选择的部门
        }
    },
    created() {
        this.init()
    },
    computed: {
        aDouble() {
            return this.crumbs.length
        },
        aPlus: {
            get() {
                return this.crumbs
            },
            set(v) {
                this.crumbs.splice((v + 1), (this.crumbs.length - 1 - v))
            }
        }
    },
    methods: {
        init() {
            if (this.mySelf.orgObj && this.mySelf.orgObj.length > 0) {
                this.chooseOrgs = this.mySelf.orgObj
            }
            plus.nativeUI.showWaiting()   // eslint-disable-line
            getOrgTreeByParameter()
                .then(res => {
                    this.crumbs = []
                    this.crumbs.push({
                        companyName: '快捷导航',
                        companyObj: res
                    })
                    this.handleOrgObj(res, false) // false第一次 true第二次
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message) // eslint-disable-line
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting() // eslint-disable-line
                })
        },
        handleOrgObj(co, isChild) {
            // 处理部门  false第一次 true第二次 childrenList
            const coData = isChild ? co.children : co
            console.log('coData', coData)
            if (coData) {
                this.isDepartment = true
                this.orgArray = []
                coData.forEach(departmentObj => {
                    this.orgArray.push({
                        title: departmentObj['name'],
                        isChildren: !!departmentObj['childrenList'],
                        children: departmentObj['childrenList'],
                        nodeId: departmentObj['id'],
                        isChecked: false,
                        isShowCheckbox: isChild,
                        iconUrl: require('@/assets/images/application-active.png')
                    })
                })
                if (this.chooseOrgs && this.chooseOrgs.length > 0) {
                    this.orgArray.forEach(v => {
                        for (let h = 0; h < this.chooseOrgs.length; h++) {
                            if (this.chooseOrgs[h].orgId == v.nodeId) {
                                v.isChecked = true
                            }
                        }
                    })
                }
            } else {
                this.isDepartment = false
            }
        },
        handleOrgData(orgDate) { // 点击部门列表处理方法
            if (orgDate.isChildren) {
                // 处理面包屑数据
                this.crumbs.push({
                    companyName: orgDate.title,
                    companyObj: orgDate
                })
                this.handleOrgObj(orgDate, true) // false第一次 true第二次
                this.crumbScroll()
            } else {
                return
            }
        },
        chooseOrg(item, index) {
            const ischeck = this.orgArray[index].isChecked
            let backUp = ''
            this.crumbs.forEach((val, index) => {
                if (index === 0) {
                    return
                }
                backUp += val.companyName + ' → '
            })
            backUp += item.title
            this.$set(this.orgArray, index, this.orgArray[index])
            if (ischeck) { // true  增加选中人员到数组
                this.chooseOrgs.push({
                    orgId: item.nodeId,
                    orgName: item.title,
                    backup: backUp
                })
            } else { // false  删除选中人员到数组
                const chooseOrgIndex = this.chooseOrgs.findIndex((val) => {
                    return val.orgId === item.nodeId
                })
                this.chooseOrgs.splice(chooseOrgIndex, 1)
            }
        },
        changeCrumb(companyObj, index) {		// 点击面包屑操作
            this.aPlus = index
            this.hintAll = false
            this.showBanner = true
            if (index === 0) {
                this.handleOrgObj(companyObj, false)
            } else {
                this.handleOrgObj(companyObj, true)
            }
            this.crumbScroll()
        },
        confirmBtn() {
            const openerWebview = this.mySelf.opener()
            fire(openerWebview, 'orgEvent', { chooseOrgs: this.chooseOrgs })
            plus.webview.close(this.mySelf, 'auto')
        },
        overrideBack() {
            if (this.aDouble === 1) {
                var ws = plus.webview.currentWebview()
                if (ws.webviewPreload == true) {
                    plus.webview.hide(ws, 'auto')
                } else {
                    plus.webview.close(ws, 'auto')
                }
            } else {
                this.aPlus = this.crumbs.length - 2
                if (this.crumbs.length > 1) {
                    this.handleOrgObj(this.crumbs[this.aDouble - 1].companyObj, true)
                } else {
                    this.handleOrgObj(this.crumbs[this.aDouble - 1].companyObj, false)
                }
            }
        },
        crumbScroll() {
            this.$nextTick(function() {
                var mScrollWidth = document.querySelector('.mui-scroll').offsetWidth
                var xMovie = window.screen.width - mScrollWidth
                var scroll = mui('.mui-scroll-wrapper').scroll()
                if (xMovie > 0) {
                    scroll.reLayout()
                    mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 500)
                } else {
                    scroll.reLayout()
                    mui('.mui-scroll-wrapper').scroll().scrollTo(xMovie, 0, 500)
                }
            })
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
    overflow:hidden;
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
.org-group1{
  &__icon{
    width: 18px;
    height: 18px;
    display: inline-block;
    top: 2px;
    left: 5px;
    text-align: center;
    position:relative;
    float:left;
    img{
      width: 100%;
      vertical-align: top;
    }
  }
  &__title{
      font-family: "SimHei";
      font-size: 14px;
      margin-left: 35px;
      margin-right:30px;
      display:block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }
  &__check-block{
      width:36px;
      height:36px;
      position: absolute;
      right:24px;
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
        z-index:3
      }
  }
}
.mui-scroll-wrapper .mui-scroll .mui-control-item {
	color: #7ac8ff;
	vertical-align: middle;
	padding-left: 10px;
	padding-right: 20px;
	position: relative;
  display:inline-block;
  font-size:12px;
  line-height:42px;
  transform:none;
}
.mui-scroll-wrapper .mui-scroll .mui-control-item:after {
				content: ">";
				color: #ccc;
				padding-left: 0px;
				padding-right: 0px;
				position: absolute;
				right: 0px;
			}
			.mui-scroll-wrapper .mui-scroll .mui-control-item.now {
				color: #a2a2a2 !important;
			}
			.mui-scroll-wrapper .mui-scroll .mui-control-item.now:after {
				content: "";
			}
			.mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
				color: #7ac8ff;
				border-bottom: none;
			}
			.mui-indexed-list-search.mui-input-row.mui-search {
				background-color: white;
				margin: 0 10px;
			}
			.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control.mui-segmented-control-inverted {
				position:relative;
				height: 42px;
                background-color: white;
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