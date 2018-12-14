/*
 * @Author: LG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-11-01 15:36:19
 */
/**
|--------------------------------------------------
| 选择人员功能confirmBtn
|--------------------------------------------------
*/
<template>
    <div class="contact-book pr">

        <bimHeader title="选择人员" left-arrow override :overrideBack="overrideBack" @click-right="confirmBtn">
            <div class="btn-confirm" solt="right" style="top:6px;">
              <button>确认</button>
            </div>
        </bimHeader>

        <!--面包屑导航-->
        <div class="g-line-bottom" style="padding-top:45px;">
            <div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
                <div class="mui-scroll">
                    <a class="mui-control-item other" v-for="(crumb,index) in crumbs" :class="{now:(index+1==crumbs.length) ? true : false}" @tap="changeCrumb(crumb.companyObj, index)">{{crumb.companyName}}</a>
                </div>
            </div>
        </div>

        <div class="scroll-block" style="top:87px;">
            <div class="p10" style="padding-bottom:0;">
                <van-search
                    placeholder="搜索通讯录人员"
                    class="search"
                    v-model="searchValue"
                    @search="onSearch"
                />
            </div>

            <div class="org-group mt10" v-if="isDepartment && !isSearchPerson">
                <van-cell-group>
                    <van-cell v-for="(item, index) in orgArray" :key="index" :is-link="item.isChildren" @click="handleOrgData(item)">
                        <template slot="title">
                            <i class="org-group__icon"><img :src="item.iconUrl"/></i>
                            <span class="org-group__title">{{ item.title }} <span v-if="item.isPerson">({{ item.childrenNum }})</span></span>
                        </template>
                    </van-cell>
                </van-cell-group>
            </div>

            <div class="person-group mt10" v-if="isPerson && !isSearchPerson">
            <van-cell-group>
                <van-cell
                    v-for="(item, index) in personArray"
                    :key="index"
                >
                <template slot="title">
                    <i class="person-group__fn-bg mr10 pr">{{ item.user && item.user.name | firstName }}</i>
                    <span class="person-group__title">{{ item.user && item.user.name }}</span>
                    <div class="person-group__check-block">
                        <label for="checkbox1"></label>
                        <input name="checkbox1" type="checkbox" v-model="item.isChecked" @change="choosePerson(item, index)">
                        <i class="iconfont icon-roundcheck" v-if="item.isChecked"></i>
                        <i class="iconfont icon-round" v-else></i>
                    </div>
                </template>
                </van-cell>
            </van-cell-group>
            </div>

            <div class="person-group mt10" v-if="isSearchPerson">
            <van-cell-group>
                <van-cell
                    v-for="(item, index) in searchPersons"
                    :key="index"
                >
                <template slot="title">
                    <i class="person-group__fn-bg mr10 pr">{{ item.user && item.user.name | firstName}}</i>
                    <span class="person-group__title">{{ item.user && item.user.name }}</span>
                    <div class="person-group__check-block">
                        <label for="checkbox1"></label>
                        <input name="checkbox1" type="checkbox" v-model="item.isChecked" @change="chooseSearchPerson(item, index)">
                        <i class="iconfont icon-roundcheck" v-if="item.isChecked"></i>
                        <i class="iconfont icon-round" v-else></i>
                    </div>
                </template>
                </van-cell>
            </van-cell-group>
            </div>
        </div>

    </div>
</template>
<script>
// import { getOrgTreeAllAndUserNotRole } from '@/api/orgTree'
import { getOrgTreeByParameter } from '@/api/oaOrgTree'
import { fire } from '@/utils/envent.js'
import { Search, Cell, CellGroup, Button, Icon, Checkbox, CheckboxGroup } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
import uniqBy from 'lodash/uniqBy'
/* global plus */
/* global mui */
export default {
    components: {
        [Search.name]: Search,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Button.name]: Button,
        [Icon.name]: Icon,
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup,
        bimHeader
    },
    data() {
        return {
            mySelf: plus.webview.currentWebview(),
            isDepartment: false, // 是否有部门
            isPerson: false, // 是否有人
            isSearchPerson: false, // 是否有搜索结果
            searchPersons: [], // 搜索的人员
            searchValue: '', // 搜索输入值
            hintAll: false, // 显示
            showBanner: false, // 显示
            orgArray: [], // 公司组织列表
            personArray: [], // 公司人员列表
            personSearchAllData: [], //  递归所有人员并把人员
            crumbs: [], // 面包屑
            choosePersons: [] // 选择的人员
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
    watch: {
        searchValue(val) {
            if (val === '') {
                this.isSearchPerson = false
            }
        }
    },
    filters: {
        firstName(value) {
            return value && value.substr(0, 1)
        }
    },
    methods: {
        init() {
            if (this.mySelf.personObj && this.mySelf.personObj.length > 0) {
                this.choosePersons = this.mySelf.personObj
            }
            plus.nativeUI.showWaiting()
            getOrgTreeByParameter()
                .then(res => {
                    this.crumbs = []
                    this.crumbs.push({
                        companyName: '快捷导航',
                        companyObj: res
                    })
                    this.personSearchAllData = []
                    this.personSearchAllData = this.jsonTree(res)
                    this.handleCompanyObj(res, false) // false第一次 true第二次
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        handleCompanyObj(co, isChild) {
            this.isPerson = (co.userList && co.userList.length > 0)
            // 处理人员
            if (this.isPerson) {
                this.personArray = []
                const nodeId = co.nodeId ? co.nodeId : '0'
                co.userList.forEach(personObj => {
                    personObj.nodeId = nodeId
                    personObj.isChecked = false
                    this.personArray.push(personObj)
                })
                if (this.choosePersons && this.choosePersons.length > 0) {
                    this.personArray.forEach((v) => {
                        for (let h = 0; h < this.choosePersons.length; h++) {
                            if (this.choosePersons[h].userId === v['userId']) {
                                v.isChecked = true
                            }
                        }
                    })
                }
            }

            // 处理部门  false第一次 true第二次
            const coData = isChild ? co.children : co
            if (coData) {
                this.isDepartment = true
                this.orgArray = []
                coData.forEach(departmentObj => {
                    departmentObj.isPerson = Number(departmentObj['personNum']) > 0
                    departmentObj.isChildren = !!departmentObj.children || departmentObj.isPerson
                    this.orgArray.push({
                        title: departmentObj['name'],
                        isChildren: departmentObj.isChildren,
                        childrenNum: Number(departmentObj['personNum']),
                        children: departmentObj['childrenList'],
                        isPerson: departmentObj.isPerson,
                        nodeId: departmentObj['id'],
                        userList: departmentObj.userList,
                        iconUrl: require('@/assets/images/application-active.png')
                    })
                })
            } else {
                this.isDepartment = false
            }
        },
        handleOrgData(orgDate) { // 点击部门列表处理方法
            // 处理面包屑数据
            this.crumbs.push({
                companyName: orgDate.title,
                companyObj: orgDate
            })
            this.handleCompanyObj(orgDate, true) // false第一次 true第二次
            this.crumbScroll()
        },
        choosePerson(item, index) {
            const ischeck = this.personArray[index].isChecked
            this.$set(this.personArray, index, this.personArray[index])
            if (ischeck) { // true  增加选中人员到数组
                this.choosePersons.push({
                    userId: item['userId'],
                    userName: item.user && item.user.name,
                    avatarUri: `${process.env.API_ENDPOINT.slice(0, -5)}` + (item.user.avatarUri)
                })
            } else { // false  删除选中人员到数组
                this.choosePersons = this.choosePersons.filter(val => val.userId !== item['userId'])
            }
        },
        chooseSearchPerson(item, index) {
            const ischeck = this.searchPersons[index].isChecked
            this.$set(this.searchPersons, index, this.searchPersons[index])
            if (ischeck) { // true  增加选中人员到数组
                this.choosePersons.push({
                    userId: item['userId'],
                    userName: item.user && item.user.name,
                    avatarUri: `${process.env.API_ENDPOINT.slice(0, -5)}` + (item.user.avatarUri)
                })
            } else { // false  删除选中人员到数组
                this.choosePersons = this.choosePersons.filter(val => val.userId !== item['userId'])
            }
        },
        changeCrumb(companyObj, index) {		// 点击面包屑操作
            this.aPlus = index
            this.hintAll = false
            this.showBanner = true
            if (index === 0) {
                this.handleCompanyObj(companyObj, false)
            } else {
                this.handleCompanyObj(companyObj, true)
            }
            this.crumbScroll()
        },
        confirmBtn() {
            const openerWebview = this.mySelf.opener()
            fire(openerWebview, 'personEvent', { choosePersons: uniqBy(this.choosePersons, 'userId') })
            plus.webview.close(this.mySelf, 'auto')
        },
        onSearch() {
            this.searchPersons = []
            this.searchValue = this.searchValue.toLowerCase()
            this.personSearchAllData.forEach(v => {
                if (v.user.name.indexOf(this.searchValue) !== -1 || v.user.pinyin.indexOf(this.searchValue) !== -1) {
                    this.searchPersons.push(v)
                }
            })
            this.isSearchPerson = this.searchPersons.length > 0
            if (this.isSearchPerson) {
                if (this.choosePersons && this.choosePersons.length > 0) {
                    this.searchPersons.forEach((v) => {
                        for (let h = 0; h < this.choosePersons.length; h++) {
                            if (this.choosePersons[h].userId === v['userId']) {
                                v.isChecked = true
                            }
                        }
                    })
                }
            }
        },
        overrideBack() {
            if (this.aDouble === 1) {
                var ws = plus.webview.currentWebview()
                if (ws.webviewPreload === true) {
                    plus.webview.hide(ws, 'auto')
                } else {
                    plus.webview.close(ws, 'auto')
                }
            } else {
                this.aPlus = this.crumbs.length - 2
                if (this.crumbs.length > 1) {
                    this.handleCompanyObj(this.crumbs[this.aDouble - 1].companyObj, true)
                } else {
                    this.handleCompanyObj(this.crumbs[this.aDouble - 1].companyObj, false)
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
        },
        jsonTree(obj) {
            const personList = []
            const fn = arr => {
                arr.length > 0 && arr.forEach(item => {
                    Array.prototype.push.apply(personList, item['userList'])
                    item['childrenList'] && fn(item['childrenList'])
                })
            }
            fn(obj)
            return personList
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
    overflow:hidden;
    .search {
        /deep/ .van-field__control{
            text-indent: 0px;
        }
    }
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
  }
}
.person-group{
  &__fn-bg{
    width: 36px;
    height: 36px;
    display: inline-block;
    top: 0px;
    text-align: center;
    background: $bg5;
    color: #fff;
    font-size:14px;
    font-family: "SimHei";
    border-radius: 36px;
    line-height: 36px;
    font-style: normal;
  }
  &__title {
    font-family: "SimHei";
    font-size:16px;
    line-height: 36px;
  }
  &__check-block{
      width:36px;
      height:36px;
      position: absolute;
      right:9px;
      top:10px;
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
				padding-top: 0px;
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