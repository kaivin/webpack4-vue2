const getters = {
    sidebar: state => state.header.sidebar,
    token: state => state.user.token,
    info: state => state.user.info,
    // visitedViews: state => state.tagsView.visitedViews,
    // cachedViews: state => state.tagsView.cachedViews,
};
export default getters;