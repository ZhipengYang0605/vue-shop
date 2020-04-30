import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 1.引入fastclick
import FastClick from 'fastclick'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(document.body);
  }, false);
}

// 2.引入公共的全局样式
import '@/style/common.less'

// 3.引入全局UI组件库
import './plugins/vant'

// 4. 引入rem.js
import './config/rem'

// 5. 全局引入过滤器
import './config/filter'

// 6.引入vue-qriously插件（生成微信支付二维码）
import vueQriously from 'vue-qriously'
Vue.use(vueQriously);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
