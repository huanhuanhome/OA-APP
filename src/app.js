import Vue from "vue";
import "./utils/common";
import App from "./app.vue";

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    components: { App },
    template: "<App/>"
});
