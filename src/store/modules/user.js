import { login,getInfo,logout } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/token';
// import router, { resetRouter } from '@/router'

const state = {
    token:getToken(),
    loginInfo: {},
    userData:{}
//   introduction: '',
//   roles: []
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_LOGIN: (state, data) => {
        state.loginInfo = data;
    },
    SET_INFO: (state, data) => {
        state.userData = data;
    },
//   SET_ROLES: (state, roles) => {
//     state.roles = roles
//   }
};

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({ user_name: username.trim(), password: password }).then(response => {// 字段名根据后端而定
                const { data } = response;
                commit('SET_LOGIN', data);// 字段根据后端返回而定
                commit('SET_TOKEN', data.token);// 字段根据后端返回而定
                setToken(data.token);// 设置token,字段根据后端返回而定
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    },
    getInfo({commit}){
        return new Promise((resolve,reject)=>{
            getInfo().then(response=>{
                const {data} = response;
                console.log(data,'登陆信息');
                commit('SET_INFO', data);// 字段根据后端返回而定
                resolve();
            }).catch(error=>{
                reject(error);
            });
        });
    },
    logout({commit}){
        return new Promise((resolve,reject)=>{
            logout().then(response=>{
                commit('SET_TOKEN', '');
                removeToken();
                resolve();
            }).catch(error=>{
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
