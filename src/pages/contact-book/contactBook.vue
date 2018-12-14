/*
 * @Author: LG
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-25 19:34:23
 */
/**
|--------------------------------------------------
| 通讯录功能/模块
|--------------------------------------------------
*/
<template>
<div class="contact-book pr">

    <bimHeader title="通讯录" left-arrow override :overrideBack="overrideBack"/>

    <!--面包屑导航-->
    <div class="g-line-bottom" style="padding-top:45px;">
        <div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
            <div class="mui-scroll">
                <a 
                    class="mui-control-item other" 
                    v-for="(crumb,index) in crumbs" 
                    :key="index" 
                    :class="{now:(index+1==crumbs.length) ? true : false}" 
                    @tap="changeCrumb(crumb.companyObj, index)">
                    {{crumb.companyName}}
                </a>
            </div>
        </div>
    </div>

    <!--搜索@search="onSearch"-->
    <div class="p10">
        <van-search
            placeholder="搜索通讯录人员"
            class="search"
            v-model.trim="searchValue"
        />
    </div>

    <div class="scroll-block" style="top:137px;">

        <!-- 部门列表 -->
        <div v-if="isDepartment && isSearchValue" class="mb10">
            <bimCellGroup2 :bimCellGroup2Array="bimCellGroup2Data1" @departmentData="departmentObj"/>
        </div>
    
        <!-- 人员列表 -->
        <div v-if="isPerson && isSearchValue">
            <bimPersonGroup1 :bimPersonGroup1Array="bimPersonGroup1Data1" @bimCellGroup2Obj="personDetailObj"/>
        </div>

        <!-- 搜索人员列表 -->
        <div v-if="isSearchPerson">
            <bimPersonGroup1 :bimPersonGroup1Array="bimPersonSearchData1" @bimCellGroup2Obj="personDetailObj"/>
        </div>
    </div>
</div>
</template>
<script>
// import { getOrgTreeAllAndUserNotRole } from '@/api/orgTree'
import { getOrgTreeByParameter } from '@/api/oaOrgTree'
import { getUserInfo } from '@/common/app.js'
import { Search } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
import bimPersonGroup1 from '@/component/bimPersonGroup1/bimPersonGroup1'
import bimCellGroup2 from '@/component/bimCellGroup2/bimCellGroup2'
/* global mui */
/* global plus */
export default {
    components: {
        [Search.name]: Search,
        bimHeader,
        bimPersonGroup1,
        bimCellGroup2
    },
    data() {
        return {
            searchValue: '',
            isDepartment: false, // 是否有部门
            isPerson: false, // 是否有人
            isSearchPerson: false, // 是否有搜索结果
            isSearchValue: true, // 输入框有有效结果
            bimHeaderMyInfoData: {
                name: '',
                date: ''
            },
            bimCellGroup2Data1: [], // 部门数据
            bimPersonGroup1Data1: [], // 部门下人员数据
            personDetailParentObj: {}, // 人员详情
            crumbs: [], // 面包屑
            bimPersonSearchAllData: [], //   所有人员数据
            bimPersonSearchData1: [] // 人员搜索
        }
    },
    created() {
        this.init()
    },
    mounted() {
        var userInfo = getUserInfo()
        if (userInfo && userInfo.name !== '') {
            this.bimHeaderMyInfoData.name = userInfo.name
        }
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
        searchValue(newVal, oldVal) {
            this.bimPersonSearchData1 = []
            if (newVal === '') {
                this.isSearchValue = true
            } else { // 有值
                newVal = newVal.toLowerCase()
                this.searchPersonList(newVal)
                // this.bimPersonSearchAllData.forEach(v => {
                //     if (v.user) {
                //         const name = v.user.name || ''
                //         const pinyin = v.user.pinyin || ''
                //         if (name.indexOf(newVal) !== -1 || pinyin.indexOf(newVal) !== -1) {
                //             this.bimPersonSearchData1.push(v)
                //         }
                //     }
                // })
                // if (this.bimPersonSearchData1.length > 0) {
                //     this.isSearchValue = false
                //     this.isSearchPerson = true
                // } else {
                //     this.isSearchValue = true
                //     this.isSearchPerson = false
                // }
            }
        }
    },
    methods: {
        // 搜索人员
        searchPersonList(searchValue) {
            this.bimPersonSearchAllData.forEach(v => {
                if (v.user) {
                    const name = v.user.name || ''
                    const pinyin = v.user.pinyin || ''
                    if (name.indexOf(searchValue) !== -1 || pinyin.indexOf(searchValue) !== -1) {
                        this.bimPersonSearchData1.push(v)
                    }
                }
            })
            if (this.bimPersonSearchData1.length > 0) {
                this.isSearchValue = false
                this.isSearchPerson = true
            } else {
                this.isSearchValue = true
                this.isSearchPerson = false
            }
        },
        handleCompanyObj(co, isChild) {
            this.isPerson = co.userList && co.userList.length > 0
            // 处理人员
            if (this.isPerson) {
                this.bimPersonGroup1Data1 = []
                co.userList.forEach(personObj => {
                    this.bimPersonGroup1Data1.push(personObj)
                })
            }

            // 处理部门  false第一次 true第二次
            const coData = isChild ? co.children : co
            if (coData) {
                this.isDepartment = true
                this.bimCellGroup2Data1 = []
                coData.forEach(departmentObj => {
                    departmentObj.isPerson = Number(departmentObj['personNum']) > 0
                    departmentObj.isChildren = !!departmentObj['childrenList'] || departmentObj.isPerson
                    this.bimCellGroup2Data1.push({
                        title: departmentObj['name'],
                        isChildren: departmentObj.isChildren,
                        childrenNum: Number(departmentObj['personNum']),
                        children: departmentObj['childrenList'],
                        isPerson: departmentObj.isPerson,
                        nodeId: departmentObj['id'],
                        userList: departmentObj['userList'],
                        iconUrl: require('@/assets/images/application-active.png')
                    })
                })
            } else {
                this.isDepartment = false
            }
        },
        init() { // 初始化
            plus.nativeUI.showWaiting()
            getOrgTreeByParameter()
                .then(res => {
                    if (!res) return plus.nativeUI.toast('暂无数据')
                    this.crumbs = []
                    this.crumbs.push({
                        companyName: '通讯录',
                        companyObj: res
                    })
                    this.bimPersonSearchAllData = []
                    const personList = []
                    const fn = obj => {
                        obj.forEach(item => {
                            Array.prototype.push.apply(personList, item['userList'])
                            item['childrenList'] && fn(item['childrenList'])
                        })
                    }
                    fn(res)
                    this.bimPersonSearchAllData = personList
                    this.handleCompanyObj(res, false) // false第一次 true第二次
                })
                .catch(e => {
                    plus.nativeUI.toast(e && e.message)
                })
                .finally(() => {
                    plus.nativeUI.closeWaiting()
                })
        },
        departmentObj(data) { // 点击部门组建emit回来该部门下数据
            // 处理面包屑数据
            this.crumbs.push({
                companyName: data.title,
                companyObj: data
            })
            this.handleCompanyObj(data, true) // false第一次 true第二次
            this.crumbScroll()
        },
        personDetailObj(data) { // 人员数据输入人员详情页面
            this.personDetailParentObj = data
        },
        // onSearch() {
        //     this.bimPersonSearchData1 = []
        //     this.searchValue = this.searchValue.toLowerCase()
        //     this.searchPersonList(this.searchValue)
        // this.bimPersonSearchAllData.forEach(v => {
        //     const name = v.user.name || ''
        //     const pinyin = v.user.pinyin || ''
        //     if (name.indexOf(this.searchValue) !== -1 || pinyin.indexOf(this.searchValue) !== -1) {
        //         this.bimPersonlSearchData1.push(v)
        //     }
        // })
        // if (this.bimPersonSearchData1.length > 0) {
        //     this.isSearchValue = false
        //     this.isSearchPerson = true
        // } else {
        //     this.isSearchValue = true
        //     this.isSearchPerson = false
        // }
        // },
        changeCrumb(companyObj, index) { // 点击面包屑操作
            this.aPlus = index
            if (index === 0) {
                this.handleCompanyObj(companyObj, false)
            } else {
                this.handleCompanyObj(companyObj, true)
            }
            this.crumbScroll()
        },
        crumbScroll() {
            var screenWidth = window.screen.width
            this.$nextTick(() => {
                var mScrollWidth = document.querySelector('.mui-scroll').offsetWidth
                var xMovie = screenWidth - mScrollWidth
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
                    this.handleCompanyObj(this.crumbs[this.aDouble - 1].companyObj, true)
                } else {
                    this.handleCompanyObj(this.crumbs[this.aDouble - 1].companyObj, false)
                }
            }
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/css/c.css';
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
.detail-show{
    position: absolute;
    width: 100%;
    top:0;
    bottom:0;
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

.bim-scroll-nav{
    &__txt{
        font-size: 14px;
        line-height: 24px;
        color: $textc6;
        font-family: "SimHei";
        a:last-child {color:$textc6}
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