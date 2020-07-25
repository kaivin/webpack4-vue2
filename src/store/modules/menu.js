import { getMenuData } from '@/api/menu';
import { setToken } from '@/utils/token';
// import router, { resetRouter } from '@/router'

const state = {
    menuList:[]
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_MENU: (state, data) => {
        state.info = data;
    },
//   SET_ROLES: (state, roles) => {
//     state.roles = roles
//   }
};

const actions = {
    getMenuData({commit},token){
        return new Promise((resolve,reject)=>{
            getMenuData({token:token}).then(response=>{
                const {data} = response;
                console.log(data,'登陆信息');
                commit('SET_INFO', data.data);// 字段根据后端返回而定
                commit('SET_TOKEN', data.token);// 字段根据后端返回而定
                setToken(data.token);// 设置token,字段根据后端返回而定
                resolve();
            }).catch(error=>{
                reject(error);
            });
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
