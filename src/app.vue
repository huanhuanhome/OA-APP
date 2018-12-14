<template>
	<div>
        <div class="logo">
            <img src="./assets/images/bg.png" alt="log">
        </div>
        <div id="parogress-block">
            <van-progress
                :percentage="progress"
                :pivot-text="progress+''"
                pivot-color="#ED6A5A"
                color="linear-gradient(to right, #FFEA82, #ED6A5A)"
            />
        </div>
        <div class="footer">
            中路高科交通检测检验认证有限公司<br /> 北京公科桥梁技术有限公司
            <br /> 联合出品
        </div>
	</div>
</template>

<script>
/*global plus */
var onStateChanged

var checkUpdateUrl = process.env.API_ENDPOINT + '/version/app/check'
var customizeReq = function(url, options) {
    options = options || {}
    options.dataType = options.dataType || 'json'
    options.type = options.type || 'post'
    options.timeout = options.timeout || 30000
    var xhr = new plus.net.XMLHttpRequest()
    xhr.open(options.type.toUpperCase(), url)
    xhr.timeout = options.timeout
    if (options.headers) {
        var headers = options.headers
        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                var element = headers[key]
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
            var protocol = /^([\w-]+:)\/\//.test(url) ? RegExp.$1 : window.location.protocol
            var isLocal = protocol === 'file:'
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && isLocal && xhr.responseText)) {
                var result = xhr.responseText
                if (options.success) {
                    var succCb = options.success
                    succCb(JSON.parse(result), xhr, null)
                }
            }
        }
    }
}
var isDebugVersion = function() {
    var debug = localStorage.getItem('$debug')
    if (debug === 'true') {
        return true
    }
    return false
}
var showWaiting = function(message) {
    plus.nativeUI.showWaiting(message, { back: 'none' })
}
var enterApp = function() {
    var wv = plus.webview.create('login.html', 'login', {
        top: 0, // 新页面顶部位置
        bottom: 0, // 新页面底部位置
        render: 'always',
        popGesture: 'hide',
        bounce: 'vertical',
        bounceBackground: '#efeff4'
    })
    var w = plus.nativeUI.showWaiting()
    // 监听窗口加载成功
    wv.addEventListener(
        'loaded',
        function() {
            wv.show('pop-in') // 显示窗口
            w.close()
            w = null
        },
        false
    )
}
var installWgt = function(path) {
    showWaiting('更新资源安装中...')
    plus.runtime.install(path, {}, function() {
        plus.nativeUI.closeWaiting()
        plus.runtime.restart()
    }, function(e) {
        plus.nativeUI.closeWaiting()
        plus.nativeUI.alert('更新资源安装失败[' + e.code + ']：' + e.message, function() {
            // 忽略, 进入登录
            enterApp()
        })
    })
}
var installApk = function(path) {
    showWaiting('更新安装中...')
    plus.runtime.install(path, {}, function() {
        plus.nativeUI.closeWaiting()
    }, function(e) {
        plus.nativeUI.closeWaiting()
        plus.nativeUI.alert('更新安装失败', function() {
            // 忽略, 进入登录
            enterApp()
        })
    })
}
// var onStateChanged = function onStateChanged(download, status) {
//     if (status == 200 && download.totalSize > 0) {
//         var progress = download.downloadedSize / download.totalSize;
//         bar.set(progress)
//     }
// }
var updateWgt = function(newVersion, fileUrl) {
    var updateFn = function() {
        showWaiting('下载更新文件...')
        var donwloader = plus.downloader.createDownload(fileUrl, { filename: '_doc/update/' }, function(d, status) {
            if (status === 200) {
                installWgt(d.filename) // 安装更新
            } else {
                plus.nativeUI.alert('下载更新文件失败, 请检查网络！')
                enterApp()
            }
            plus.nativeUI.closeWaiting()
        })
        donwloader.addEventListener('statechanged', onStateChanged, false)
        document.getElementById('parogress-block').style.display = 'block'
        donwloader.start()
    }
    if (newVersion.desc) {
        plus.nativeUI.confirm(newVersion.desc, function(e) {
            if (e.index === 0) {
                updateFn()
            } else {
                enterApp()
            }
        }, newVersion.title, ['立即更新', '取  消'])
    } else {
        updateFn()
    }
}
var upgrade = function(newVersion) {
    var confirmTxt = newVersion.confirmTxt || '立即更新'
    var cancelTxt = newVersion.cancelTxt || '取　　消'
    var desc = newVersion.desc || ''
    plus.nativeUI.confirm(desc, function(i) {
        if (i.index === 0) {
            if (newVersion.url) {
                var osName = plus.os.name
                if (osName === 'iOS') {
                    plus.runtime.openURL(newVersion.url)
                } else if (osName === 'Android') {
                    showWaiting('下载更新安装包...')
                    var donwloader = plus.downloader.createDownload(newVersion.url, {}, function(d, status) {
                        plus.nativeUI.closeWaiting()
                        if (status === 200) {
                            installApk(d.filename)
                        } else {
                            plus.nativeUI.alert('下载更新文件失败, 请检查网络！', function() {
                                enterApp()
                            })
                        }
                    })
                    donwloader.addEventListener('statechanged', onStateChanged, false)
                    document.getElementById('parogress-block').style.display = 'block'
                    donwloader.start()
                }
            } else {
                enterApp()
            }
        } else {
            enterApp()
        }
    }, newVersion.title, [confirmTxt, cancelTxt])
}
function plusReady() {
    if (localStorage.getItem('$debug') === 'true') return enterApp()
    plus.runtime.getProperty(plus.runtime.appid, function(inf) {
        var appVersion = inf.version
        showWaiting('更新检测中...')
        var retryTimes = 0
        var checkUpdate = function(options) {
            customizeReq(checkUpdateUrl, options)
        }
        var successCb = function(result, textStatus, xhr) {
            plus.nativeUI.closeWaiting()
            if (result && result.status > 0) {
                var newVersion = result.data

                if (newVersion) {
                    if (newVersion.majorVersion) {
                        // 整包更新
                        upgrade(newVersion)
                    } else {
                        // 资源更新
                        updateWgt(newVersion, newVersion.url)
                    }
                } else {
                    // 无更新
                    enterApp()
                }
            } else {
                // 成功返回,但检测失败, 忽略...
                enterApp()
            }
        }

        var failCb = function(xhr, type, errorThrown) {
            retryTimes++
            if (retryTimes < 3) {
                if (retryTimes === 1) {
                    reqOptions.timeout = 4000
                } else if (retryTimes === 2) {
                    reqOptions.timeout = 6000
                }
                checkUpdate(reqOptions)
            } else {
                plus.nativeUI.closeWaiting()
                // 错误,忽略更新暂时
                enterApp()
            }
        }
        var debugVersionFlag = isDebugVersion()
        var reqOptions = {
            data: { version: appVersion, 'debug': debugVersionFlag, os: plus.os.name },
            timeout: 2000,
            headers: {
                'Content-Type': 'application/json'
            },
            success: successCb,
            error: failCb
        }
        checkUpdate(reqOptions)
    })
}
import FastClick from 'fastclick'
// 去除300ms延迟
document.addEventListener(
    'DOMContentLoaded',
    function() {
        FastClick.attach(document.body)
    },
    false
)
import { Progress } from 'vant'
export default {
    components: {
        [Progress.name]: Progress
    },
    data() {
        return {
            progress: 0
        }
    },
    created() {
        var _this = this
        onStateChanged = function onStateChanged(download, status) {
            if (status === 200 && download.totalSize > 0) {
                var progress = download.downloadedSize / download.totalSize
                _this.progress = Math.round(progress * 100)
            }
        }
        if (window.plus) {
            plusReady()
        } else {
            document.addEventListener('plusready', plusReady, false)
        }
    },
    mounted() {
        // document.addEventListener('plusready', plusReady)
    }
}
</script>


<style>
*,body{ margin:0; padding:0; font-family: Microsoft YaHei,Helvetica,STHeiti STXihei, Microsoft JhengHei,  Tohoma, Arial;-webkit-font-smoothing:antialiased;}
html,body{
    width:100%;
    height:100%;
}
.logo > img{
    width: 100%;
}
.mui-progressbar.download {
    position: absolute;
    bottom: 60px;
    text-align: center;
    width: 100%;
    top: auto;
}

.footer {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    padding: 0;
    margin: 0;
    text-align: center;
    color: #ccc;
    font-size: 10px;
    line-height: 14px;
}

#parogress-block{
    position: absolute;
    width:100%;
    text-align: center;
    bottom: 80px;
    display: none;
}

/deep/ .van-progress__pivot{
    font-size:0.4em;
    padding-top:2px;
    line-height:10px;
}
</style>

