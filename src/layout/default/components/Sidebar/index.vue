<template>
    <el-aside v-bind:class="!isCollapse?'':'hideSideBar'">
        <div class="logo"><router-link to="/"><strong><i></i><i></i><i></i><i></i></strong><span>中台前端管理模板数据库</span></router-link></div>
        <div class="sidebar-content">
          <el-menu class="el-menu-panel"
          :collapse="isCollapse"
          background-color="#252a2f"
          text-color="#fff"
          active-text-color="#fff"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">笔记</span>
              </template>
              <el-submenu index="1-1">
                <span slot="title">前端</span>
                <el-submenu index="1-1-1">
                  <span slot="title">vue</span>
                  <el-submenu index="1-1-1-1">
                    <span slot="title">vue-router</span>
                    <router-link to="/front-end/vue/vue-router/page-1"><el-menu-item index="1-1-1-1-1">页面1</el-menu-item></router-link>
                    <router-link to="/front-end/vue/vue-router/page-2"><el-menu-item index="1-1-1-1-2">页面2</el-menu-item></router-link>
                  </el-submenu>
                </el-submenu>
              </el-submenu>
              <el-submenu index="1-2">
                <span slot="title">vuex</span>
                <el-menu-item index="1-2-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">vuex测试</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">禁用</span>
            </el-menu-item>
          </el-menu>
        </div>
    </el-aside>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Sidebar',
  computed:{
      ...mapGetters([
          'sidebar',
      ]),
      isCollapse() {
        return !this.sidebar.opened;
      }
  },
}
</script>

<style lang="scss" scoped>
.hideSideBar.el-aside{
  width:64px!important;
  .logo{
    a{
      span{
        overflow: hidden;
        visibility: hidden;
      }
    }
  }
}
.el-aside{
  background: #252a2f;
  transition: width .25s ease-out;
  width:256px!important;
  .logo{
      width:100%;
      height:64px;
      a{
          padding:16px;
          display: block;
          width:100%;
          height:100%;
          overflow: hidden;
          position: relative;
          font-size:0;
          strong{
              display: inline-block;
              position: absolute;
              width:32px;
              height:32px;
              left:16px;
              top:16px;
              z-index: 1;
              -webkit-animation:rotateMove 5s infinite linear;
              animation:rotateMove 5s infinite linear;
              i{
                  display: block;
                  width:32%;
                  height:32%;
                  position: absolute;
                  background: $--color-primary;
                  border-radius:100%;
              }
              i:first-child{
                  top:0;
                  left:34%;
                  opacity: .4;
                  -webkit-animation:opacityMove1 2s infinite linear;
                  animation:opacityMove1 2s infinite linear;
              }
              i:first-child+i{
                  top:34%;
                  right:0;
                  opacity: .6;
                  -webkit-animation:opacityMove2 2s infinite linear;
                  animation:opacityMove2 2s infinite linear;
              }
              i:first-child+i+i{
                  bottom:0;
                  left:34%;
                  opacity: .8;
                  -webkit-animation:opacityMove3 2s infinite linear;
                  animation:opacityMove3 2s infinite linear;
              }
              i:first-child+i+i+i{
                  top:34%;
                  left:0;
                  opacity: 1;
                  -webkit-animation:opacityMove4 2s infinite linear;
                  animation:opacityMove4 2s infinite linear;
              }
          }
          span{
              display: inline-block;
              width:100%;
              height:100%;
              padding-left:44px;
              line-height: 32px;
              overflow: hidden;
              vertical-align: middle;
              font-size:16px;
              color: $white;
          }
      }
  }
}
.sidebar-content{
    height:calc(100% - 64px);
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
 
  .el-menu-panel{
    border-right:none!important;
    transition: transform .25s ease-out;
    width:100%;
  }
  .el-menu-item.is-active{
    color: rgb(255, 255, 255)!important; background-color: rgb(30, 34, 38)!important;
  }
@keyframes rotateMove
{
  0%{
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
  }
  80%{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
  }
  100%{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
  }
}

@-webkit-keyframes rotateMove /*Safari and Chrome*/
{
  0%{
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
  }
  80%{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
  }
  100%{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
  }
}

@keyframes opacityMove1
{
  0%{
    opacity: .4;
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: .4;
  }
}

@-webkit-keyframes opacityMove1
{
    0%{
        opacity: .4;
    }
    50%{
        opacity: 1;
    }
    100%{
        opacity: .4;
    }
}
@keyframes opacityMove2
{
  0%{
    opacity: .6;
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: .6;
  }
}

@-webkit-keyframes opacityMove2
{
    0%{
        opacity: .6;
    }
    50%{
        opacity: 1;
    }
    100%{
        opacity: .6;
    }
}
@keyframes opacityMove3
{
  0%{
    opacity: .8;
  }
  50%{
    opacity: .4;
  }
  100%{
    opacity: .8;
  }
}

@-webkit-keyframes opacityMove3
{
    0%{
        opacity: .8;
    }
    50%{
        opacity: .4;
    }
    100%{
        opacity: .8;
    }
}
@keyframes opacityMove4
{
  0%{
    opacity: 1;
  }
  50%{
    opacity: .4;
  }
  100%{
    opacity: 1;
  }
}

@-webkit-keyframes opacityMove4
{
    0%{
        opacity: 1;
    }
    50%{
        opacity: .4;
    }
    100%{
        opacity: 1;
    }
}
</style>
