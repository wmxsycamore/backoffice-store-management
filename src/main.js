import Vue from 'vue';
import ElementUi from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store';

// 引入全局配置文件
import $conf from './common/config/config';

Vue.config.productionTip = false;


Vue.prototype.$conf = $conf;
Vue.use(ElementUi);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
