<template>
  <el-container class="is-vertical">
    <header-module />
    <el-container>
      <sidebar />
      <el-container>
      <el-header>
        <tags-view />
      </el-header>
      <el-main>
        <transition 
          name="fade-transform"
          mode="out-in">
          <keep-alive v-bind:include="cachedViews">
            <router-view :key="key" />
          </keep-alive>
        </transition>
      </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

import { Sidebar, HeaderModule,TagsView } from './components';
export default {
  name: 'Layout',
  components: {
    Sidebar,
    HeaderModule,
    TagsView,
  },
  computed:{
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  methods: {
  }
}
</script>

<style>
.el-header{
  background: none;
  padding:0!important;
  height:112px!important;
}
.el-main {
  background-color: #f5f5f5;
  color: #333;
  overflow: hidden!important;
}
</style>
