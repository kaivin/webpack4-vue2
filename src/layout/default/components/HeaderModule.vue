<template>
    <div class="header">
        <div class="nav-left">
            <div class="logo"><router-link to="/"><strong><i></i><i></i><i></i><i></i></strong><span>红星机器工作台</span></router-link></div>
            <ul class="cate-list">
                <li v-for="item in rootMenu" v-bind:key="item.id" v-bind:class="item.isOn?'active':''" v-on:click="menuClick(item.id)"><span>{{item.name}}</span></li>
            </ul>
        </div>
        <div class="nav-right">
            <div class="item-nav"><a href="javascript:void(0);">消息</a></div>
            <div class="item-nav"><a href="javascript:void(0);">{{userInfo.name}}</a></div>
            <div class="item-nav">
                <a href="javascript:void(0);" class="user"><img v-bind:src="userInfo.avatars" alt=""></a>
                <div class="user-panel">
                    <div class="user-header"><img v-bind:src="userInfo.avatars" alt=""><span>{{userInfo.name}}</span></div>
                    <div class="user-body">
                        <div class="item-link"><a href="">账号设置</a></div>
                    </div>
                    <div class="user-footer"><a href="javascript:void(0);" v-on:click="logout">退出登录</a></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"HeaderModule",
    data(){
        return{
        }
    },
    props:["rootMenu"],
    computed:{
        userInfo(){
            if(this.$store.getters.userData.data){
                return this.$store.getters.userData.data;
            }else{
                return {};
            }
        },
        // menuList(){
        //     var $this = this;
        //     var menuInfo = [];
        //     var menuData = $this.$store.getters.menuData;
        //     if(menuData.length>0){
        //         menuData.forEach(function(item,index){
        //             if(item.pid==0){
        //                 menuInfo.push(item);
        //             }
        //         });
        //         menuInfo.forEach(function(item,index){
        //             if(index==0){
        //                 item.isOn=true;
        //             }else{
        //                 item.isOn =false;
        //             }
        //         });
        //     }
        //     return menuInfo
        // }
    },
    methods:{
        // 退出登录
        logout(){
            var $this = this;
            $this.$store.dispatch('user/logout').then(() => {
                $this.$router.push({ path: '/login' })
                // $this.loading = false
            }).catch((error) => {
                console.log(error);
                // $this.loading = false
            });
        },
        // 菜单点击事件
        menuClick(id){
            var $this = this;
            $this.$emit("update",id);
            $this.$forceUpdate();
        }
    }
}
</script>

<style lang="scss" scoped>
.header{
    width:100%;
    height:50px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
    position: relative;
    z-index: 100;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    .nav-left,.nav-right{
        display: flex;
        -webkit-box-align: center;
        align-items: center;
    }
    .logo{
        float:left;
        height:100%;
        a{
            padding:9px 10px;
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
                left:10px;
                top:9px;
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
                font-size:18px;
                font-weight:bold;
                color: #333;
            }
        }
    }
    .cate-list{
        float:left;
        overflow: hidden;
        margin-left: 30px;
        li{
            float:left;
            span{
                cursor: pointer;
                display: block;
                padding: 0 15px;
                height: 50px;
                line-height: 50px;
            }
            &:hover{
                span{
                    color: $primary;
                }   
            }
            &.active{
                color: #fff;
                background: lighten($primary,10%);
                &:hover{
                    span{
                        color: #fff;
                    }
                }
            }
        }
    }
    .nav-right{
        .item-nav{
            display: inline-block;
            >a{
                display: block;
                height: 50px;
                line-height: 50px;
                padding: 0 12px;
            }
            .user{
                padding: 9px 12px;
                img{
                    display: block;
                    width: 32px;
                    height: 100%;
                    border-radius: 100%;
                }
            }
            &:hover{
                .user-panel{
                    top: 100%;
                    opacity: 1;
                    visibility: visible;
                }
            }
        }
    }
}
.user-panel{
    display: block;
    position: absolute;
    visibility: hidden;
    opacity: 0;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
    width: 240px;
    color: rgb(51, 51, 51);
    border-width: 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.0980392);
    border-image: initial;
    transition: all 360ms ease;
    transform: translate(0px, -10px);
    z-index: 100;
    top: 150%;
    right: 0px;
    .user-header{
        padding: 10px;
        overflow: hidden;
        img{
            display: block;
            float: left;
            width: 32px;
            height: 32px;
            border-radius:100%;
            margin-right: 15px;
        }
        span{
            display: inline-block;
            height: 32px;
            line-height:32px;

        }
    }
    .user-body{
        border-top: 1px solid #e7e7e7;
        border-bottom: 1px solid #e7e7e7;
        padding: 10px 0;
        overflow: hidden;
        .item-link{
            width:100%;
            overflow: hidden;
            a{
                display: block;
                height: 32px;
                line-height: 32px;
                padding: 0 10px;
                background: #ffffff;
                transition: all 360ms ease;
                &:hover{
                    background: #f5f5f5;
                }
            }
        }
    }
    .user-footer{
        width: 100%;
        overflow: hidden;
        a{
            display: block;
            height: 36px;
            overflow: hidden;
            background: rgb(247, 247, 247);
            text-align: center;
            line-height: 36px;
            color: $primary;
            transition: all 360ms ease;
            &:hover{
                color: rgb(85,85,85);
            }
        }
    }
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


