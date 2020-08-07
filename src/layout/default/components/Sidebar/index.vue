<template>
    <el-aside>
        <div class="sidebar-content">
          <ul class="side-nav">
            <li v-for="item in subMenuList" v-bind:key="item.id"><p><i class="el-icon-location"></i><span slot="title">{{item.name}}</span></p></li>
          </ul>
        </div>
    </el-aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data(){
    return{
      currentMenuTree:[],
    }
  },
  computed:{
      subMenuList(){
          var $this = this;
          var menuInfo = [];
          var currentMenu = []
          var menuData = $this.$store.getters.menuData;
          if(menuData.length>0){
              menuInfo = $this.dataToTree(menuData);
              menuInfo.forEach(function(item,index){
                if(item.isOn){
                  currentMenu = item.children;
                }
              });
          }
          return currentMenu;
      }
  },
  methods:{
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
  }
}
</script>
<style lang="scss" scoped>
.el-aside{
  background: #252a2f;
  transition: width .25s ease-out;
  width:220px!important;
  
}
.sidebar-content{
    height:calc(100% - 50px);
    overflow-y: auto;
    transition: transform .25s ease-out;
    position: relative;
    &::-webkit-scrollbar {
        width: 4px
    }
    &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 4px
    }
    &:hover::-webkit-scrollbar-thumb {
        background: hsla(0,0%,53%,.4)
    }
    &:hover::-webkit-scrollbar-track {
        background: hsla(0,0%,53%,.1)
    }
}
.side-nav{
  width: 100%;
  overflow: hidden;
  //padding-bottom: 15px;
  li{
    width: 100%;
    //margin-top: 15px;
    overflow: hidden;
    transition: all .3s linear;
    p{
      width: 100%;
      line-height:0;
      cursor: pointer;
      padding: 15px 10px;
      i,span{
        display: inline-block;
        line-height: 24px;
        color: #666;
        transition: all .3s linear;
      }
      i{
        margin-right:8px;
      }
    }
    &:hover{
      background-color: rgb(30, 34, 38);
      i,span{
        color: #fff; 
      }
    }
  }
  li.active{
    background-color: rgb(30, 34, 38);
    i,span{
      color: #fff; 
    }
  }
}
</style>
