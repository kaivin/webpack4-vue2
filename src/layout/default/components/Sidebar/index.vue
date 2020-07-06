<template>
    <el-aside>
        <div class="sidebar-content">
          <ul class="side-nav">
            <li class="active"><p><i class="el-icon-location"></i><span slot="title">笔记</span></p></li>
            <li><p><i class="el-icon-menu"></i><span slot="title">笔记</span></p></li>
            <li><p><i class="el-icon-document"></i><span slot="title">笔记</span></p></li>
          </ul>
        </div>
    </el-aside>
</template>

<script>
export default {
  name: 'Sidebar',
}
</script>
<style lang="scss" scoped>
.el-aside{
  background: #252a2f;
  transition: width .25s ease-out;
  width:90px!important;
  
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
