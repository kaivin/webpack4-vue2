const getters = {
    sidebar: state => state.header.sidebar,
    loginInfo: state => state.user.loginInfo,
    token: state => state.user.token,
    userData: state => state.user.userData,
    menuData: state => state.menu.menuData,
    // visitedViews: state => state.tagsView.visitedViews,
    // cachedViews: state => state.tagsView.cachedViews,
};
export default getters;