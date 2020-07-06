import axios from 'axios';
// import Qs from 'qs';
import store from '@/store';
import { getToken } from '@/utils/token';
const configAPI = require('../../config');
const env = process.env.NODE_ENV;// node通过process.env获取用户执行命令的NODE_ENV字段的值

const http = axios.create({
    baseURL: env=="development"?configAPI.dev.env.BASE_API: configAPI.build.env.BASE_API,// 判断值是哪个，确定请求的baseURL是哪个环境的
    withCredentials: false, //前端配置了这个withCredentials=true，后段设置Access-Control-Allow-Origin不能为 " * ",必须是前端的源地址（也就是前端开发过程中项目跑起来的ip:端口号）
    timeout: 20000,
    // headers:{
    //     'Content-Type':'application/x-www-form-urlencoded;charset=utf-8',
    //     "Access-Control-Allow-Origin":"*"
    // },
});
// token的时效性问题，这里需要使用axios的拦截器功能
// axios 请求拦截
http.interceptors.request.use(
    config => {
        // do something before request is sent
        // config.transformRequest=[function(data){
        //     // let newData = JSON.stringify(data);
        //     let newData = Qs.stringify(data);
        //     return newData;
        //     // return data;
        // }];
        if (store.getters.token) {
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
        const res = response.data;
        console.log(res);
        // 定时刷新access-token
        if (!response.data.token && response.data.msg === 'token invalid') {//这里需要看后端返回的是什么，以及后端返回的数据结构做调整
            // 刷新token
            store.dispatch('user/resetToken').then(() => {
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