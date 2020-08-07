import request from './index';

export function getMenuData() {
    return request({
        url: '/api/menu/show',
        method: 'get',
    });
}
