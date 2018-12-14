import Vue from "vue";
import "../../utils/common";
import App from "./main.vue";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: "#app",
    components: { App },
    template: "<App/>"
});
