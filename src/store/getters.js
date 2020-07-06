const getters = {
    sidebar: state => state.header.sidebar,
    token: state => state.user.token,
    name: state => state.user.name,
    avatars: state => state.user.avatar,
    // visitedViews: state => state.tagsView.visitedViews,
    // cachedViews: state => state.tagsView.cachedViews,
};
export default getters;