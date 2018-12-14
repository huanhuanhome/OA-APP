export function isAndroid() {
    const ua = navigator.userAgent;
    return ua.match(/(Android);?[\s\/]+([\d.]+)?/);
}

export function isIos() {
    const ua = navigator.userAgent;
    return ua.match(/(iPhone\sOS)\s([\d_]+)/);
}

// var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
// var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
//	var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
export function quitApp() {
    plus.key.removeEventListener("backbutton", function () { })
    let backButtonPress = 0
    plus.key.addEventListener(
        "backbutton",
        function () {
            backButtonPress++
            if (backButtonPress > 1) {
                plus.runtime.quit()
            } else {
                plus.nativeUI.toast('再按一次退出应用')
            }
            setTimeout(function () {
                backButtonPress = 0;
            }, 1000);
        },
        false)
}
