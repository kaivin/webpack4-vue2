import { login,getInfo,logout } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/token';
import { getUserName, setUserName, getUserAvatars, setUserAvatars } from '@/utils/user';
// import router, { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: getUserName(),
    avatar: getUserAvatars(),
//   introduction: '',
//   roles: []
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    //   SET_INTRODUCTION: (state, introduction) => {
    //     state.introduction = introduction
    //   },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
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
                commit('SET_TOKEN', data.token);// 字段根据后端返回而定
                setToken(data.token);// 设置token,字段根据后端返回而定
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    },
    getInfo({commit},token){
        return new Promise((resolve,reject)=>{
            getInfo({token:token}).then(response=>{
                const {data} = response;
                console.log(data);
                commit('SET_NAME', data.data.user_name);// 字段根据后端返回而定
                commit('SET_AVATAR', data.data.avatars);// 字段根据后端返回而定
                setUserName(data.data.user_name);// 设置token,字段根据后端返回而定
                setUserAvatars(data.data.avatars);// 设置token,字段根据后端返回而定
                resolve();
            }).catch(error=>{
                reject(error);
            });
        });
    },
    logout({commit},token){
        return new Promise((resolve,reject)=>{
            logout({token:token}).then(response=>{
                const {data} = response;
                console.log(data);
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
