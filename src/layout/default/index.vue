<template>
  <el-container class="is-vertical">
    <header-module v-bind:rootMenu="rootMenu" v-on:update="changeMenu" />
    <el-container>
      <sidebar v-bind:currentMenu="currentMenu" />
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
    data(){
        return {
            rootMenu:[],
            currentMenu:[],
            menuList:[]
        }
    },
  computed:{
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    },
  },
  created:function(){
      var $this = this;
      $this.$store.dispatch('user/getInfo').then(res=>{
          console.log($this.$store.getters.userData,"用户");
      });
      $this.$store.dispatch('menu/getMenuData').then(res=>{
          console.log($this.$store.getters.menuData,"菜单");
          $this.menuList = $this.$store.getters.menuData;
          var menuInfo = [];
          var treeMenu = [];
          var currentMenu = [];
          if($this.menuList.length>0){
                $this.menuList.forEach(function(item,index){
                    if(item.pid==0){
                        menuInfo.push(item);
                    }
                });
                menuInfo.forEach(function(item,index){
                    if(index==0){
                        item.isOn=true;
                    }else{
                        item.isOn =false;
                    }
                });
                $this.rootMenu = menuInfo;
                treeMenu = $this.dataToTree($this.menuList);
                treeMenu.forEach(function(item,index){
                    if(index==0){
                        currentMenu = item.children;
                    }
                });
                $this.currentMenu = currentMenu;
            }
      });
  },
  methods: {
      dataToTree:function(data){
      var $this = this;
      var parents = data.filter(function (item) {
          return item.pid == 0;
      });
      var children = data.filter(function (item) {
          return item.pid != 0;
      });
      $this.convert(parents, children,$this);
      return parents;
    },
    convert:function(parents,children,$this){
      parents.forEach(function (item) {
        item.children = [];
        children.forEach(function (current, index) {
            if (current.pid === item.id) {
                var temp = JSON.parse(JSON.stringify(children)); // 将获得的子集json格式化
                temp.splice(index, 1); // 删除子集中已匹配项
                item.children.push(current);
                $this.convert([current], temp,$this); // 递归
            }
        });
      });
    },
    changeMenu:function(e){
        console.log(e);
        var $this = this;
        $this.rootMenu.forEach(function(item,index){
            if(item.id==e){
                item.isOn= true;
            }else{
                item.isOn=false;
            }
        });
        $this.menuList.forEach(function(item,index){
            if(item.id==e){
                item.isOn= true;
                $this.currentMenu=item.children;
            }else{
                item.isOn=false;
            }
        });
    },
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
