<template>
    <div class="tag-wrapper">
        <el-scrollbar 
            ref="scrollWrapper" 
            v-bind:native="false" 
            wrapClass="el-scrollbar-wrap" 
            viewClass="el-scrollbar-view" 
            v-bind:noresize="false"
            tag="div"
            class="el-scrollbar-wrapper"
            v-on:wheel.native.prevent="handleScroll"
        >
            <el-tag
                :key="tag.tagID"
                v-for="tag in tags"
                closable
                :disable-transitions="false"
            >
            {{tag.tagName}}
            </el-tag>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    name:"TagsView",
    data() {
        return {
            tags:[
                {tagID:0,tagName:'首页'},
                {tagID:1,tagName:'引导页'},
                {tagID:2,tagName:'小组件'},
                {tagID:3,tagName:'权限测试'},
                {tagID:4,tagName:'地图管理中心'},
                {tagID:5,tagName:'图片管理中心'},
                {tagID:6,tagName:'订单管理'},
                {tagID:7,tagName:'第三方物流'},
                {tagID:8,tagName:'会员中心'},
                {tagID:9,tagName:'权限管理'},
                {tagID:10,tagName:'修改密码'},
                {tagID:11,tagName:'国际化啊'},
                {tagID:12,tagName:'错误日志'},
                {tagID:13,tagName:'错误页面'},
                {tagID:14,tagName:'表格'},
                {tagID:15,tagName:'地图派单管理'},
                {tagID:16,tagName:'公告系统'},
                {tagID:17,tagName:'商品管理'},
                {tagID:18,tagName:'分类管理'},
                {tagID:19,tagName:'电商装修'},
            ]
        }
    },
    computed: {
        scrollWrapper() {
            return this.$refs.scrollWrapper.$refs.wrap;
        }
    },
    methods:{
        handleScroll(e) {
            // wheelDelta：获取滚轮滚动方向，向上120，向下-120，但为常量，与滚轮速率无关
            // deltaY：垂直滚动幅度，正值向下滚动。电脑鼠标滚轮垂直行数默认值是3
            // wheelDelta只有部分浏览器支持，deltaY几乎所有浏览器都支持
            const eventDelta = -e.wheelDelta || e.deltaY * 40;
            const $scrollWrapper = this.scrollWrapper;
            // 0到scrollLeft为滚动区域隐藏部分
            $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
        },
    }
}
</script>

<style lang="scss" scoped>
.tag-wrapper{
    width:100%;
    overflow: hidden;
    padding:8px 8px 0;
    height:48px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
    .el-scrollbar-wrapper{
        width:100%;
        overflow: hidden;
        height:40px;
        /deep/ .el-scrollbar-wrap{
            width:100%;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            position: relative;
            height:57px;
            /deep/ .el-scrollbar-view{
                height:32px;
            }
        }
        /deep/ .el-scrollbar__bar{
            bottom:1px;
        }
    }
}

.el-tag+.el-tag{
    margin-left:8px;
}

</style>
