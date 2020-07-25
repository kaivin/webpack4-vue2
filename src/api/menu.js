import request from './index';

export function getMenuData(token) {
    return request({
        url: '/api/menu/show',
        method: 'get',
        params: token
    });
}
