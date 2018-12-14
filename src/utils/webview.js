/**
 * 打开一个webview窗口
 */
var openID = ''
export function openWebview(config, style = {}, extras = {}) {
    openID = config.id
    // 如果之前创建过就显示
    const v = plus.webview.getWebviewById(openID)
    if (v) {
        plus.webview.show(openID)
        return
    }
    var wv = plus.webview.create(
        config.url,
        config.id,
        {
            top: 0, // 新页面顶部位置
            bottom: 0, // 新页面底部位置
            render: 'always',
            popGesture: 'close',
            bounce: 'vertical',
            bounceBackground: '#efeff4',
            ...style
        },
        extras
    )
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

// webview.open  打开得很快 但是不能传参
export function openWebviewFast(url, id, title) {
    plus.nativeUI.showWaiting('加载中')
    plus.webview.open(
        url,
        id,
        {
            // titleNView: {
            //     backgroundColor: "#f7f7f7", // 导航栏背景色
            //     titleText: title, // 导航栏标题
            //     titleColor: "#666", // 文字颜色
            //     // type: "transparent", // 透明渐变样式
            //     autoBackButton: false, // 自动绘制返回箭头
            //     splitLine: {
            //         // 底部分割线
            //         color: "#cccccc"
            //     }
            // },
        },
        'pop-in',
        420,
        function() {
            plus.nativeUI.closeWaiting()
        }
    )
}
// 预加载页面 速度很快,但是不要加载超过10个
export function preLoad(webviews = []) {
    webviews.map(webview => {
        const fullExtras = {
            webviewPreload: true,
            ...webview.extras
        }
        plus.webview.create(
            webview.url,
            webview.id,
            {
                top: 0, // 新页面顶部位置
                bottom: 0, // 新页面底部位置
                // render: "always",
                // popGesture: "hide",
                // bounce: "vertical",
                // bounceBackground: "#efeff4",
                // titleNView: {
                //     // 详情页原生导航配置
                //     backgroundColor: "#f7f7f7", // 导航栏背景色
                //     titleText: webview.title, // 导航栏标题
                //     titleColor: "#000000", // 文字颜色
                //     type: "transparent", // 透明渐变样式
                //     autoBackButton: false, // 自动绘制返回箭头
                //     splitLine: {
                //         // 底部分割线
                //         color: "#cccccc"
                //     }
                // },
                ...webview.style
            },
            fullExtras
        )
    })
}

export function showWebviewById(id) {
    plus.webview.show(id, 'pop-in', 200)
}

// 回到登录页
export function backToLogin() {
    const views = plus.webview.all()
    if (views && views.length) {
        views.forEach(view => {
            if (view.id !== 'login') {
                plus.webview.close(view.id)
            } else {
                // 解决登录页 loading 问题
                plus.nativeUI.closeWaiting()
            }
        })
    }
}
