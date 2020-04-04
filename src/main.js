import Vue from 'vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css
import 'animate.css';

import store from './store';
import App from './App.vue';
Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };
Vue.use(ElementUI);
Vue.config.productionTip = false;

const whiteList = ['/login']; // 不需要登录就可以显示的页面白名单

router.beforeEach((to, from, next) => {
    const hasToken = false;// 预设一个假的token
    if(hasToken){// token存在
        if(to.path === '/login'){
            next({path:'/'});// token存在并且打开的是登录页，那么直接跳转到默认页
        }else{
            next();// token存在，并且不是登录页，那么直接打开访问的页面
        }
    }else{// token不存在
        if (whiteList.indexOf(to.path) !== -1) {// 如果path在白名单里，则直接显示页面
            next();
        }else{
            next(`/login?redirect=${to.path}`);// 如果页面需要先登录才能显示，则重定向到登录页
        }
    }
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
