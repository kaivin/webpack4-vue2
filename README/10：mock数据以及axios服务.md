# 登录流程

先梳理一下流程：
>> 浏览器打开网址，这时需要在页面渲染出来之前判断浏览器是否缓存有`token`，如果存在，则直接登录并跳转到网址所在页面，如果不存在，则跳转到登录页面先进行登录， 输入用户名密码，点击登录，通过接口传参向服务端发出登录请求，服务端验证通过后，返回成功状态码，并给客户端传递一个`token`值，客户端缓存该`token`值，并保存到状态管理中，然后客户端通过重定向路由跳转到网址所在页面


## 跳转登录页

首先是自动跳转到登录页，这里需要用到`vue-router`的导航守卫：


```
import router from './router';

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
```

这里的导航守卫这段代码需要放在`src/main.js`文件中`new Vue` 实例化之前，这里设置了一个白名单，token不存在的情况下，有些页面是不需要登录就可以直接显示的，这些页面不需要重定向到登录页，登录页本身也不需要重定向

此时运行代码页面就会自动跳转到登录页了
