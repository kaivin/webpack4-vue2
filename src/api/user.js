import request from './index';

export function login(data) {
    return request({
        url: '/api/user/login',
        method: 'post',
        data
    });
}

export function getInfo() {
    return request({
        url: '/api/user/info',
        method: 'get',
        //params: token 
    });
}

export function logout(data) {
    return request({
        url: '/api/user/logout',
        method: 'post',
        data
    });
}