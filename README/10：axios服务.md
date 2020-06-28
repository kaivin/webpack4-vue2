
# axios服务

现在已经能跳转登录页，接下来就是输入用户名密码后点击登录，实现正常登录操作，这时就需要有一个服务端接口，我们利用服务端提供的接口，给服务端传递用户名和密码，服务端接收并验证成功后，返回给我们需要的数据，对登录操作来说，就是服务端会返回给我们一个`token`

这个过程我们要使用服务端提供的接口，这里就需要用到`axios`来处理请求，`axios`是什么这里就不说了，其和`ajax`是一类东西，都是处理服务端请求的，只是比`ajax`能实现的功能更多，更适合于现在的前端技术，或者说，更适合于`vue`这类新兴的框架类前端技术，`ajax`能实现的，`axios`也都能实现，甚至实现的更好、更安全。

这里开始牵扯到服务端接口了，那么就需要分开发环境和生产环境了，其接口的ip端口号部分，开发环境和生产环境肯定是不一样的，这里为了不每次都要手动修改接口，就需要做一些其他配置了。

新建`src/config/index.js,src/config/dev.env.js,src/config/prod.env.js`:

```
// src/config/dev.env.js
'use strict';
module.exports = {
    NODE_ENV: "development",
    BASE_API:"/api"
};

// src/config/prod.env.js
'use strict';
module.exports = {
    NODE_ENV: "production",
    BASE_API:"http://172.16.10.121:8343"
};

// src/config/index.js
const ip = require('ip').address();
module.exports = {
    build:{
        env:require('./prod.env'),
    },
    dev:{
        env:require('./dev.env'),
        port: 8080,
        proxyTable:{
            '/api':{// 这里会替代我们在 target 里的写的后端的请求接口
                target:`http://${ip}:${this.port}`,// 后端请求的域名或ip：端口号部分
                changeOrigin: true, // 是否允许跨域
                pathRewrite:{
                    // 重写,用代理首先得告诉node，只要是以/api开头的才用代理，所以接口的代理路径就是：http://${ip}:${this.port}/api/xx/xx
                    // 但是可能我们正常的后端给的接口路径里并没有/api这一层，所以就要用pathRewrite把/api这一层去掉，这样既能有正确的标识，又能在请求的时候去掉/api
                    '^/api':'', 
                }
            }
        }
    }
};
```
这里的`src/config/prod.env.js`中的`BASE_API`就是当项目发布到生产环境时，生产环境的接口域名（ip:端口号）部分

`src/config/index.js`里我使用了本机ip来做代理，实际上`target`那里是需要填后端程序给的开发环境的接口的ip:端口号部分,开发环境在开发过程中会遇到跨域问题，所以这里需要做代理

做完代理，需要修改啊`webpack.dev.conf.js`文件：

```
// 引入src/config/index.js
const config = require('./src/config');

// 开发服务配置项
devServer: {
    port: config.dev.port,
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    host: ip,
    overlay:true,
    hot:true,
    proxy:config.dev.proxyTable,
    inline:true,
    after() {
        open(`http://${ip}:${this.port}`)
        .then(() => {
            console.log(chalk.cyan(`成功打开链接： http://${ip}:${this.port}`));
        })
        .catch(err => {
            console.log(chalk.red(err));
        });
    }
},
```

到此我们的准备工作就做完了，上面我们区分开发环境和生产环境是要是通过定义的`NODE_ENV`字段来判断，而这个字段是我们在运行开发环境命令和生产环境命令里，有写入的，在`package.json`的`scripts`字段中，我们有这些命令：
```
"dev": "cross-env NODE_ENV=development webpack --config webpack.dev.conf.js",
"start": "webpack-dev-server --config webpack.dev.conf.js --color --progress",
"test": "cross-env NODE_ENV=production webpack --config webpack.test.conf.js",
"build": "cross-env NODE_ENV=production webpack --config webpack.prod.conf.js"
```

接下来就是具体的服务接口代码，这里我们能知道，在请求时是如何知道是开发还是生产环境的，新建`src/api/index.js`文件：

```
import axios from 'axios';
import Qs from 'qs';
import store from '@/store';
import { getToken } from '@/utils/token';
const config = require('../config');
const env = process.env.NODE_ENV;// node通过process.env获取用户执行命令的NODE_ENV字段的值
axios.defaults.baseURL = env=="development"?config.dev.env.BASE_API: config.build.env.BASE_API;// 判断值是哪个，确定请求的baseURL是哪个环境的

let http = axios.create({
    withCredentials: true, //前端配置了这个withCredentials=true，后段设置Access-Control-Allow-Origin不能为 " * ",必须是前端的源地址（也就是前端开发过程中项目跑起来的ip:端口号）
    timeout: 20000,
});
// token的时效性问题，这里需要使用axios的拦截器功能
// axios 请求拦截
http.interceptors.request.use(
    config => {
        // do something before request is sent
        config.transformRequest=[function(data){
            // let newData = JSON.stringify(data);
            let newData = Qs.stringify(data);
            return newData;
            // return data;
        }];
        if (store.getters.token) {// 获取vuex状态管理中的token值
            // let each request carry token --['Access-Token'] as a custom key.
            // please modify it according to the actual situation.
            config.headers['Access-Token'] = getToken();
        }
        return config;
    },
    error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);
// axios 响应拦截
http.interceptors.response.use(
    response => {
        // 定时刷新access-token
        if (!response.data.value && response.data.data.message === 'token invalid') {//这里需要看后端返回的是什么，以及后端返回的数据结构做调整
            // 刷新token
            store.dispatch('user/resetToken').then(() => {// 通过状态管理删除失效token值，并刷新页面，此时会重新走导航守卫，发现没有token值，重定向到登录页
                location.reload();
            }).catch(error => {
                throw new Error('token刷新:' + error);
            });
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);
export default http;
```
这里我们使用到了上一章我们在状态管理中设置的`token`，以及通过状态管理删除`token`，该文件最后声明的`http`暴露出来，供具体接口使用，这里用到了两个新的项目依赖插件，需要先行安装：

```
yarn add axios
yarn add qs
```

此时我们的`axios`服务就算配置完成了，接下来就是使用该文件暴露出来的`http`，完成`axios`的请求，假设服务端给我们的登录接口为`ip:端口号/user/login`这样的地址，我们可以先将请求数据的方法写出来，常规来说，请求数据的代码一般都是那个页面需要请求就写在哪里，不过对于大项目而言，这样后期的维护就增加了难度，所以本项目会把项目所有接口写在项目的`src/api`文件夹内，以便后期对接口维护和修改，具体返回数据，因为这里不涉及后端，之后会使用`mock`来模拟后端返回请求数据，我们先新建`src/api/user.js`:

```
import request from './index';

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    });
}
```
这里写了一个登录方法，并将其暴露出去，在上一章说过，因为`token`状态管理的设置是在登录操作内完成的，所以，这里需要修改`scr/store/modules/user.js`:

```
import { login } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/token';

const state = {
    token: getToken(),
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
};

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {// 字段名根据后端而定
                const { data } = response;
                commit('SET_TOKEN', data.token);// 字段根据后端返回而定
                setToken(data.token);// 字段根据后端返回而定
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    },
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

这里设置了`login`的`acttions`它调用了之前写的登录请求接口，并在请求成功时调用`cookie`的设置`token`，此时我们只需要在登录操作的地方去分发这里写的`login`这个`acttions`就可以了，修改`src/views/login/components/login1.vue`文件中的`handleLogin`方法：

```
handleLogin(formName){
    var $this = this;
    $this.$refs[formName].validate(valid => {
        if (valid) {
            $this.$store.dispatch('user/login', $this.loginForm).then(() => {
                $this.$router.push({ path: $this.redirect || '/' })
            }).catch((error) => {
                console.log(error);
            });
        } else {
            console.log('error submit!!');
            return false;
        }
    });
}
```
到这里，整个请求的前端部分已经基本完成，接下来，需要服务端响应我们的请求，并返回给我们想要的数据，这里因为不涉及服务端，所以接下来会使用`mock`来模拟后端返回数据