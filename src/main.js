import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import './assets/css/style.css'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vuex)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
