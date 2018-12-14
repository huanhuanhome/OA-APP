<template>
    <div>
        <bimHeader title="God Mod"></bimHeader>

        <div class="collapse-block">
            <van-cell-group class="mt10">
                <van-cell>
                    <ul class="g-list-2">
                        <li @click="switchEnv('prod')"><span class="label">PROD</span></li>
                    </ul>
                </van-cell>
                <van-cell>
                    <ul class="g-list-2">
                        <li @click="switchEnv('uat')"><span class="label">UAT</span></li>
                    </ul>
                </van-cell>
                <van-cell>
                    <ul class="g-list-2">
                        <li @click="switchEnv('dev')"><span class="label">DEV</span></li>
                    </ul>
                </van-cell>
            </van-cell-group>
            <div id="parogress-block" v-if="progressShow">
                <van-progress
                    :percentage="progress"
                    :pivot-text="progress+''"
                    pivot-color="#ED6A5A"
                    color="linear-gradient(to right, #FFEA82, #ED6A5A)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { Cell, CellGroup, Progress } from 'vant'
import bimHeader from '@/component/bimHeader/bimHeader'
import { getToken } from '@/common/app'
import TestEnv from '../../../config/test.env.js' // 测试环境
import ProdEnv from '../../../config/prod.env.js' // 正式环境
import UatEnv from '../../../config/uat.env.js' // 正式环境
/* global plus */
export default {
    components: {
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        [Progress.name]: Progress,
        bimHeader
    },
    data() {
        return {
            progress: 0,
            progressShow: false
        }
    },
    methods: {
        switchEnv(env) {
            plus.nativeUI.confirm('确认更新[' + env + ']？', e => {
                if (e.index === 1) this.checkUpdate(env)
            }, '切换模式', ['否', '是'])
        },
        // 获取环境地址
        getUrlByEnv(env) {
            switch (env) {
                case 'prod':
                    return ProdEnv.API_ENDPOINT
                case 'dev':
                    return TestEnv.API_ENDPOINT
                case 'uat':
                    return UatEnv.API_ENDPOINT
            }
        },
        // 安装更新包
        installWgt(path) {
            plus.nativeUI.showWaiting('更新资源安装中...', { back: 'none' })
            plus.runtime.install(path, { force: true }, _ => {
                plus.nativeUI.closeWaiting()
                plus.runtime.restart()
            }, e => {
                plus.nativeUI.closeWaiting()
                plus.nativeUI.toast('更新资源安装失败[' + e.code + ']：' + e.message)
            })
        },
        // 下载更新包
        updateWgt(fileUrl) {
            plus.nativeUI.showWaiting('下载更新文件...', { back: 'none' })
            const donwloader = plus.downloader.createDownload(fileUrl, { filename: '_doc/update/' }, (d, status) => {
                if (status === 200) {
                    this.installWgt(d.filename) // 安装更新
                } else {
                    plus.nativeUI.alert('下载更新文件失败, 请检查网络！')
                }
                plus.nativeUI.closeWaiting()
            })
            donwloader.addEventListener('statechanged', this.onStateChanged, false)
            this.progressShow = true
            donwloader.start()
        },
        // 进度条
        onStateChanged(download, status) {
            if (status === 200 && download.totalSize > 0) {
                this.progress = Math.round(download.downloadedSize / download.totalSize * 100)
            }
        },
        // 更新
        checkUpdate(env) {
            const $this = this
            console.log(env)
            let url = this.getUrlByEnv(env)
            url = url.replace(/"|'/g, '') + '/version/app/getLatestWgt'
            const options = {
                dataType: 'json',
                type: 'post',
                timeout: 30000,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': getToken(),
                    'loginPlatform': 'App'
                },
                success: function(result, textStatus, xhr) {
                    plus.nativeUI.closeWaiting()
                    if (result && result.status > 0) {
                        const newVersion = result.data
                        if (newVersion) {
                            $this.updateWgt(newVersion.url)
                        }
                    } else {
                        // 成功返回,但检测失败, 忽略...
                        plus.nativeUI.toast('检测更新失败')
                    }
                },
                error: function(xhr, type, errorThrown) {
                    plus.nativeUI.closeWaiting()
                    plus.nativeUI.toast('检测更新失败[' + xhr.status + ']')
                }
            }
            console.log(url)
            this.customizeReq(url, options)
        },
        // 自定义请求
        customizeReq(url, options) {
            options = options || {}
            options.dataType = options.dataType || 'json'
            options.type = options.type || 'post'
            options.timeout = options.timeout || 30000
            const xhr = new plus.net.XMLHttpRequest()
            xhr.open(options.type.toUpperCase(), url)
            xhr.timeout = options.timeout
            if (options.headers) {
                const headers = options.headers
                for (const key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        const element = headers[key]
                        xhr.setRequestHeader(key, element)
                    }
                }
            }
            if (options.error) {
                xhr.onerror = options.error
            }
            xhr.send(JSON.stringify(options.data))
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    const protocol = /^([\w-]+:)\/\//.test(url) ? RegExp.$1 : window.location.protocol
                    const isLocal = protocol === 'file:'
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && isLocal && xhr.responseText)) {
                        const result = xhr.responseText
                        if (options.success) {
                            const succCb = options.success
                            succCb(JSON.parse(result), xhr, null)
                        }
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/css/c.css';
@import '../../assets/font/iconfont.css';
@import '@/assets/css/defalut-theme/color.scss';
#parogress-block{
    position: absolute;
    width:100%;
    text-align: center;
    bottom: 80px;
}
</style>