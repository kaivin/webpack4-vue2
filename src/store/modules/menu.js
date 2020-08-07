import { getMenuData } from '@/api/menu';
// import router, { resetRouter } from '@/router'

const state = {
    menuData:[]
};

const mutations = {
    SET_MENU: (state, data) => {
        state.menuData = data;
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
                console.log(data,'菜单信息');
                commit('SET_MENU', data);// 字段根据后端返回而定
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
