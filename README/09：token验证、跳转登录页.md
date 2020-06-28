# token验证

`Token`是在客户端频繁向服务端请求数据，服务端频繁的去数据库查询用户名和密码并进行对比，判断用户名和密码正确与否，并作出相应提示，在这样的背景下，`Token`便应运而生。

`Token`是服务端生成的一串字符串，以作客户端进行请求的一个令牌，当第一次登录后，服务器生成一个`Token`便将此`Token`返回给客户端，以后客户端只需带上这个`Token`前来请求数据即可，无需再次带上用户名和密码。

`Token`的目的是为了减轻服务器的压力，减少频繁的查询数据库，使服务器更加健壮。

`token`其实说的更通俗点可以叫暗号，在一些数据传输之前，要先进行暗号的核对，不同的暗号被授权不同的数据操作。

`Token`的主要作用有两个：
1. 防止表单重复提交

防止表单重复提交一般还是使用前后端都限制的方式，比如：在前端点击提交之后，将按钮置为灰色，不可再次点击，然后客户端和服务端的`token`各自独立存储，客户端存储在`Cookie`或者`Form`的隐藏域（放在`Form`隐藏域中的时候，需要每个表单）中，服务端存储在`Session`（单机系统中可以使用）或者其他缓存系统（分布式系统可以使用）中。

主要的理念是，客户端初始化的时候，一般就是刚刚进入页面的时候就调用后端代码，后端代码生成一个`token`,返回给客户端，客户端储存`token`（可以在前台使用`Form`表单中使用隐藏域来存储这个`Token`，也可以使用`cookie`）,然后就将`request`请求中的`token`与`session`中的`token`进行比较

2. 用来作身份验证

* 客户端使用用户名跟密码请求登录
* 服务端收到请求，去验证用户名与密码
* 验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
* 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里
* 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token
* 服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据

ajax中传递`token`的方式：
1. 放在请求头中：
```
$.ajax({
    type: "POST",
    headers: {
        Accept: "application/json; charset=utf-8",
        userToken: "" + userToken
    },
    url: "/index",
    data: JSON.stringify(mytable.params),
    contentType: "application/json",
    dataType: "json",
    success:function(data){
                    
    },error:function(data){
                    
    }
});
```

2. 使用beforeSend方法设置请求头：
```
$.ajax({
    type: "POST",
    url: "/index",
    data: JSON.stringify(mytable.params),
    contentType: "application/json",
    dataType: "json",
    beforeSend: function(request) {                
               request.setRequestHeader("Authorization", token);
    },
    success: function(data) {

    },
    error: function(data) {

    }
});  
```
从上面可以看出，登录操作本身是不会去验证`token`的，这一步是直接验证用户名和密码，正确了，服务端会生成一个`token`，返回给客户端，客户端保存到`vuex`以及`cookie`中，之后的所有请求，都将这个`token`带给服务端，服务端通过验证这个`token`和服务端的一致性，来返回相应的数据。

这里就涉及到首次登陆的问题了，首次登陆后，`cookie`中已经缓存了`token`，在未清除缓存的情况下，关闭该浏览器再重新打开，并访问该网站的其他链接，不需要再次登陆，就可以直接访问页面，或者很久未再从该浏览器访问该网站，再次访问时，提示登陆过期，需要重新登陆，这就需要用带时效性的token机制。下面就一步一步来

# cookie配置token

既然用到`token`，并且需要缓存到`cookie`中，那么首先需要做的就是，利用`cookie`设置、获取、删除`token`,新建`src/utils/token.js`:
```
import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

```
这里我们设置一个默认的`token`,值为`Admin-Token`，这里将`token`的设置、获取、删除三个方法写为公共方法并暴露出去，以便其他多个地方都能够调用

# vuex管理token

`cookie`已经写了方法去设置、获取、删除`token`，我们还需要使用`vuex`去管理我们的`token`，以便在不同页面都可以调用、修改这个`token`，那么我们设置`token`是只在登录的时候，服务端返回给我们`token`了，我们才会去设置，所以，设置`token`的操作是在登录操作内完成的，此时我们可以先把`token`的状态管理除了设置的部分写一下，新建`src/store/modules/user.js`:
```
import { getToken, removeToken } from '@/utils/token';

const state = {
    token: getToken(),
};
const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
};
const actions = {
    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '');
            removeToken();
            resolve();
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
```
修改`src/store/getters.js`文件：
```
const getters = {
    sidebar: state => state.header.sidebar,
    token: state => state.user.token,
};
export default getters;
```

此时我们就可以在其他页面获取到状态管理里面的`token`了，接下来我们需要做登录的流程，登录流程的过程中，完成`token`状态管理的设置问题

# 登录流程

先梳理一下流程：
>> 浏览器打开网址，这时需要在页面渲染出来之前判断浏览器是否缓存有`token`，如果存在，则直接登录并跳转到网址所在页面，如果不存在，则跳转到登录页面先进行登录， 输入用户名密码，点击登录，通过接口传参向服务端发出登录请求，服务端验证通过后，返回成功状态码，并给客户端传递一个`token`值，客户端缓存该`token`值，并保存到状态管理中，然后客户端通过重定向路由跳转到网址所在页面


## 跳转登录页

首先是自动跳转到登录页，这里需要用到`vue-router`的导航守卫，修改`src/main.js`：


```
import router from './router';
import { getToken } from '@/utils/token'

const whiteList = ['/login']; // 不需要登录就可以显示的页面白名单
router.beforeEach((to, from, next) => {
    const hasToken = getToken();// 获取cookie存储的token
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

此时运行代码页面就会自动跳转到登录页了，接下来就需要做登录操作了，上一章已经做了前端的登录验证，差的就是将用户名和密码通过服务端提供的接口，传回给服务端，这时我们就需要用到`axios`了


