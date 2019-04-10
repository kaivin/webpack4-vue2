import Vue from 'vue';
import {Container,Header,Aside,Main,Footer,Button} from 'element-ui';
import App from './App.vue';

Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Button);
Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
