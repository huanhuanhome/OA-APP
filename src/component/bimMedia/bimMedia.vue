/*
 * @Author: BAICHONG 
 * @Date: 2018-09-20 17:06:33 
 * @Last Modified by: BAICHONG
 * @Last Modified time: 2018-10-10 10:54:19
 */
/**
|--------------------------------------------------
| 媒体查看组件
|      files:  传入媒体数据,数组对象形式
|      upload: 支持上传
|--------------------------------------------------
*/
<template>
    <div class="component-img-views">
        <template>
            <van-row>
                <!-- 图片 -->
                <template   v-if="filterFiles.images.length > 0">
                    <van-col span="6" v-for="(item, index) in filterFiles.images" :key="index" style="position:relative;">
                        <div class="img-content" @click.stop="imgPreview(item, index)">
                            <img class="compimg" v-wh="item.thumbnail ? item.thumbnail : item.filePath"><!-- thumbnail -->
                            <div  v-if="upload" class="media-close" @click.stop="imgdelete(item, index, $event)">-</div>
                        </div>
                    </van-col>
                </template>
                <!-- 添加 -->
                <van-col span="6" v-if="upload" class="pr">
                    <div class="addimg" @click="addUpload">
                        <div class="bg-block"></div>
                            <i class="iconfont icon-add1 i-add"></i>
                        <img src="@/assets/images/imgadd.jpg" class="img-opacity-none"/>
                    </div>
                </van-col>
            </van-row>
            <van-row v-if="filterFiles.others.length > 0">
                <ul class="g-list-2--nolabel">
                    <li v-for="item in filterFiles.others" @click="otherExts(item, index)" class="preview-li" style="margin-right:0;">
                        <span class="preview-span">{{item.fileName}}</span>
                    </li>
                </ul>
            </van-row>
        </template>
        
        <template v-if="files.length <= 0 && !upload">
            <ul class="g-list-2--nolabel">
                <li>暂无附件</li>
            </ul>
        </template>
    </div>
</template>

<script>
import { Row, Col, ImagePreview } from 'vant'
import { getToken } from '@/common/app.js'
import md5 from 'md5'
/* global plus */
export default {
    name: 'bimMedia',
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [ImagePreview.name]: ImagePreview
    },
    props: {
        files: {
            type: Array,
            default: _ => []
        },
        upload: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 当前服务器地址
            url: `${process.env.API_ENDPOINT.slice(0, -5)}`,
            // 图片后缀格式
            optionType: ['JPG', 'JPEG', 'GIF', 'PNG', 'BMP'],
            // 选择图片参数
            options: {
                filter: 'image',
                multiple: true,
                maximum: 6, // 最多选择6张图片
                system: false
            },
            showAction: false,
            timeOutEvent: 0,
            tempImages: '',
            active: 0
        }
    },
    computed: {
        // 图片
        filterFiles() {
            const content = { images: [], others: [] }
            this.files.forEach(item => {
                const fileExt = item.fileName.split('.').pop().toUpperCase()
                // 1.支持的图片类型 2.不能是删除状态
                this.optionType.indexOf(fileExt) >= 0 && (item.state !== 'Delete') && content.images.push(item)
                this.optionType.indexOf(fileExt) < 0 && content.others.push(item)
            })
            return content
        }
    },
    directives: {
        wh: {
            bind(el, binding, vnode, oldVnode) {
                el.src = vnode.context.url + binding.value
                if (el.complete) {
                    if (el.naturalWidth > el.naturalHeight) {
                        el.style.height = '100%'
                        el.style.left = '50%'
                        el.style.marginLeft = '-100%'
                    } else {
                        el.style.width = '100%'
                        setTimeout(_ => {
                            el.style.marginTop = '-' + (el.height - 80) / 2 + 'px'
                        }, 300)
                    }
                } else {
                    el.onload = function() {
                        if (el.naturalWidth > el.naturalHeight) {
                            el.style.height = '100%'
                            el.style.left = '50%'
                            el.style.marginLeft = '-100%'
                        } else {
                            el.style.width = '100%'
                            el.style.marginTop = '-' + (el.height - 80) / 2 + 'px'
                        }
                    }
                }
            },
            update(el, binding, vnode, oldVnode) {
                el.src = vnode.context.url + binding.value
                if (el.complete) {
                    if (el.naturalWidth > el.naturalHeight) {
                        el.style.height = '100%'
                        el.style.left = '50%'
                        el.style.marginLeft = '-100%'
                    } else {
                        el.style.width = '100%'
                        setTimeout(_ => {
                            el.style.marginTop = '-' + (el.height - 80) / 2 + 'px'
                        }, 300)
                    }
                } else {
                    el.onload = function() {
                        if (el.naturalWidth > el.naturalHeight) {
                            el.style.height = '100%'
                            el.style.left = '50%'
                            el.style.marginLeft = '-100%'
                        } else {
                            el.style.width = '100%'
                            el.style.marginTop = '-' + (el.height - 80) / 2 + 'px'
                        }
                    }
                }
            },
            inserted() { },
            componentUpdated() { },
            unbind() { }
        }
    },
    methods: {
        // 打开文件
        openFileFn(path) {
            plus.runtime.openFile(path, {}, e => {
                plus.nativeUI.toast('未找到支持此格式软件')
                plus.nativeUI.closeWaiting()
                const btn = ['确定', '取消']
                plus.nativeUI.confirm('建议使用WPS Office阅读器打开?', '下载', btn, e => {
                    if (e.index === 0) {
                        plus.runtime.openURL('http://www.wps.cn/product/wps2016/', e => {
                            plus.nativeUI.toast('打开失败,建议下载WPS阅读软件')
                        })
                    }
                })
            })
        },
        // 非图片查看
        otherExts(file, index) {
            // 获取文件类型
            let fileLocalName
            const pathTemporary = file.filePath.split('/files/')
            // 文件路径安全处理
            if (pathTemporary.length > 1 && pathTemporary[1]) {
                fileLocalName = 'file' + pathTemporary[1].replace(/\/|_/g, '')
            } else {
                fileLocalName = file.fileName
            }
            plus.nativeUI.showWaiting('加载中...')
            const fileUri = '_downloads/' + fileLocalName
            plus.io.resolveLocalFileSystemURL(fileUri, entry => {
                this.openFileFn(fileUri)
                plus.nativeUI.closeWaiting()
            }, e => {
                plus.nativeUI.toast('开始下载...')
                const dtask = plus.downloader.createDownload(
                    this.url + file.filePath,
                    { filename: '_downloads/' + fileLocalName, timeout: 10 },
                    (d, status) => {
                        plus.nativeUI.closeWaiting()
                        // 下载完成
                        if (status === 200) {
                            plus.nativeUI.toast('下载完成')
                            this.openFileFn(d.filename)
                        } else {
                            plus.nativeUI.toast('下载失败')
                        }
                    }
                )
                dtask.start()
            })
        },
        // images 删除方法
        imgdelete(targetimg, index, event) {
            const buttons = ['确定', '取消']
            if (event.target.className.match(new RegExp('(\\s|^)media-close(\\s|$)'))) {
                plus.nativeUI.confirm('确定删除？', event => {
                    if (event.index === 0) {
                        let index
                        for (let i = 0; i < this.files.length; i++) {
                            const ele = this.files[i]
                            ele.id === targetimg.id && (index = i)
                        }
                        const [deleteItem] = this.files.splice(index, 1)
                        deleteItem.state = 'Delete' // 添加删除状态
                        this.files.push(deleteItem)
                    }
                }, { buttons })
            }
        },
        // 图片预览
        imgPreview(file, index) {
            const imagesArr = this.filterFiles.images.map(item => this.url + item.filePath)
            // plus.nativeUI.previewImage(imagesArr, { current: index })
            this.tempImages = ImagePreview({ images: imagesArr, startPosition: index })
            this.active = index
            document.addEventListener('touchstart', this.touchStart, false)
            document.addEventListener('touchmove', this.touchmove, false)
            document.addEventListener('touchend', this.touchend, false)
        },
        touchStart(e) {
            const _this = this
            this.active = this.tempImages.$refs['swipe'].active
            const item = this.filterFiles.images[this.active]
            this.timeOutEvent = setTimeout(_ => {
                this.timeOutEvent = 0
                if (!this.showAction) {
                    this.showAction = true
                    const actionstyle = { cancel: '取消', buttons: [{ title: '保存到手机' }] }
                    plus.nativeUI.actionSheet(actionstyle, e => {
                        if (e.index === 1) {
                            _this.saveImage(item)
                        }
                    })
                }
            }, 500)
            e.preventDefault()
        },
        touchmove() {
            clearTimeout(this.timeOutEvent)
            this.timeOutEvent = 0
        },
        touchend() {
            clearTimeout(this.timeOutEvent)
            if (this.timeOutEvent !== 0) {
                console.log('你这是点击，不是长按')
            }
            this.showAction = false
            return false
        },
        saveImage(item) {
            const fileUrl = this.url + item.filePath
            plus.nativeUI.showWaiting('加载中...')
            var dtask = plus.downloader.createDownload(fileUrl, {}, function(d, status) {
                // 下载完成
                if (status === 200) { //
                    plus.gallery.save(d.filename, function() { // 保存到相册方法
                        plus.nativeUI.closeWaiting()
                        plus.nativeUI.toast('已保存到手机相册')
                    }, function() {
                        plus.nativeUI.closeWaiting()
                        plus.nativeUI.toast('保存失败，请重试！')
                    })
                } else {
                    plus.nativeUI.toast('下载失败')
                }
            })
            dtask.start()
        },
        // 压缩文件路径
        localTargetPath(path) {
            return '_downloads/image/' + md5(path) + '.jpg'
        },
        // 选择拍照,图片
        addUpload() {
            const actionstyle = { cancel: '取消', buttons: [{ title: '拍照' }, { title: '选择图片' }] }
            plus.nativeUI.actionSheet(actionstyle, e => {
                if (e.index === 1) {
                    // 拍照
                    this.camera()
                } else if (e.index === 2) {
                    // 选择图片
                    this.add()
                }
            })
        },
        // 拍照
        camera() {
            try {
                plus.nativeUI.showWaiting()
                const cmr = plus.camera.getCamera()
                const fmt = cmr.supportedImageFormats[0]
                cmr.captureImage(async path => {
                    const compressImage = await this.compressImage(path)
                    const task = this.createUploadFiles()
                    task.addFile(compressImage.target, { key: 'files' })
                    task.start()
                }, e => {
                    // 取消选择
                    console.warn(e)
                    plus.nativeUI.closeWaiting()
                }, {
                    format: fmt,
                    filename: '_doc/camera/pic' + +new Date() + '.jpg'
                })
            } catch (e) {
                console.warn(e)
                plus.nativeUI.toast(e && e.message)
            }
        },
        // 选择图片上传
        async add() {
            try {
                let compressFilePath
                const task = this.createUploadFiles()
                // 选择图片
                const files = await this.gallery().catch(console.warn)
                // 兼容处理,未选择返回
                if (!files) return
                plus.nativeUI.showWaiting()
                for (let i = 0; i < files.length; i++) {
                    const ele = files[i]
                    const entry = await this.resolveURL(ele)
                    if (entry.isFile) {
                        // 文件不存在
                        const compressFile = await this.resolveURL(this.localTargetPath(ele)).catch(async e => {
                            const compression = await this.compressImage(ele)
                            compressFilePath = compression.target
                        })
                        // 文件存在
                        if (compressFile && compressFile.isFile) {
                            compressFilePath = compressFile.fullPath
                        }
                        task.addFile(this.leftPadFilePrefix(compressFilePath), { key: 'files' + i })
                    }
                }
                task.start()
            } catch (e) {
                plus.nativeUI.toast(e && e.message)
                console.warn(e)
            }
        },
        // 上传图片
        createUploadFiles() {
            const url = this.url + '/rest/form/uploadFileAttMap'
            const options = { method: 'POST', blocksize: 204800, priority: 100, timeout: 20 }
            const uploadFn = (t, status) => {
                plus.nativeUI.closeWaiting()
                if (status === 200) {
                    if (t.responseText && t.responseText.length > 0) {
                        const result = JSON.parse(t.responseText)
                        if (result.status > 0) {
                            result.data.forEach(item => {
                                item.state = 'New'
                                this.files.push(item)
                            })
                        } else {
                            plus.nativeUI.toast(result.message)
                        }
                    }
                } else {
                    console.warn(t)
                    plus.nativeUI.toast('上传失败')
                }
            }
            const task = plus.uploader.createUpload(url, options, uploadFn)
            task.setRequestHeader('loginPlatform', 'App')
            task.setRequestHeader('authorization', getToken())
            task.addData('filies', [])
            return task
        },
        // 选择图片
        gallery() {
            return new Promise((resolve, reject) => {
                plus.gallery.pick(cb => {
                    resolve(cb.files)
                }, e => {
                    console.warn(e)
                    reject(e)
                }, this.options)
            })
        },
        // 路径修复
        leftPadFilePrefix(path) {
            path && path.lastIndexOf('file://', 0) !== 0 && (path = 'file://' + path)
            return path
        },
        // 获取文件对象
        resolveURL(url) {
            return new Promise((resolve, reject) => {
                plus.io.resolveLocalFileSystemURL(url, entry => {
                    resolve(entry)
                }, e => {
                    console.warn(e)
                    reject(e)
                })
            })
        },
        // 图片压缩
        compressImage(path) {
            return new Promise((resolve, reject) => {
                plus.zip.compressImage({
                    quality: 20,
                    src: path,
                    dst: this.localTargetPath(path),
                    format: 'jpg',
                    overwrite: false
                }, event => {
                    resolve(event)
                }, e => {
                    plus.nativeUI.toast('目标文件压缩失败')
                    console.warn(e)
                    reject(e)
                })
            })
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
.preview-span{
    color: #2776bf;
    text-decoration: underline;
    font-size:  14px;
    padding-left:  10px;
    line-height:  32px;
}
.preview-li{
    background: #f5f5f5;
    margin-bottom: 1px;
}
.component-img-views{
    padding-top:10px;
    padding-bottom:10px;
    padding-right:0;
    .img-content{
        margin-bottom: 5px;
        margin-right: 5px;
        background: #eee;
        overflow: hidden;
        height: 80px;
        text-align: center;
        display:block;
        .compimg{
            position: relative;
        }
        .compimg1{
            height: 100%;
            margin-left:-50%;
        }
        .compimg2{
            width: 100%;
            top:50%;
            margin-top: -50%;
        }
    }
    .img-content--last{
        margin-right: 0px;
    }
    .addimg{
        position: relative;
        margin-right:5px;
        overflow:hidden;
        .bg-block{
            position:absolute;
            border:1px solid rgba(39, 118, 191, 0.6);
            background: hsl(0, 0%, 96%);
            top:0;
            right:0;
            bottom:0;
            left:0;
        }
        .img-opacity-none{width:auto;height:80px;opacity:0;}
        i.i-add{
            position: absolute;
            left:50%;
            top:50%;
            font-size:42px;
            color:#2776bf;
            line-height:42px;
            margin-left: -21px;
            margin-top: -21px;
            opacity:0.6;
        }
    }
    .media-close {
    font-family: 'Heiti SC'; 
	position: absolute;
	right: 0px;
	top: -3px;
	width: 16px;
	height: 16px;
	text-align: center;
	line-height: 14px;
	border-radius: 50%;
	background-color: #FF5053;
	color: #f3f3f3;
	border: solid 1px #FF5053;
    font-size: 24px;
	font-weight: 200;
	z-index: 1;
	cursor: pointer;
}
}
</style>