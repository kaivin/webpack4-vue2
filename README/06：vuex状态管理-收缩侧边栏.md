# 增加收缩侧边栏功能

功能需求增加一个按钮，点击可以将侧边栏菜单收缩到只显示一个一级菜单图标的宽度，再次点击按钮可以展开侧边栏，`element-ui`的侧边栏菜单设计的有此功能，这里主要记录一下用`vuex`进行的状态管理。

首先下载`vuex`插件:

```
yarn add vuex
```

`vuex`的核心概念`State`,`Getter`,`Mutation`,`Action`,`Module`

## `state`

该节点保存了驱动应用的数据源

## `getter`

有的组件中获取到 `store` 中的`state`,  需要对其进行加工才能使用，`computed` 属性中就需要写操作函数，如果有多个组件中都需要进行这个操作，那么在各个组件中都写相同的函数，那就非常麻烦，这时可以把这个相同的操作写到`store` 中的`getters`,  每个组件只要引用`getter` 就可以了，非常方便。`Getter` 就是把组件中共有的对`state` 的操作进行了提取，它就相当于 对`state` 的`computed`. 所以它会获得`state` 作为第一个参数。

## `mutation`

在`vue` 中，只有`mutation` 才能改变`state`.  `mutation` 类似事件，每一个`mutation`都有一个类型和一个处理函数，因为只有`mutation` 才能改变`state`, 所以处理函数自动会获得一个默认参数 `state`. 所谓的类型其实就是名字

## `action`

`action`是用来`commit mutations`的

`action` 和`mutions` 的定义方法是类似的，我们要`dispatch` 一个`action`, 所以`actions` 肯定有一个名字，`dispatch action` 之后它要做事情，就是`commit mutation`, 所以还要给它指定一个函数。因为要`commit mutation` ,所以 函数也会自动获得一个默认参数`context`,  它是一个`store` 实例，通过它可以获取到`store` 实例的属性和方法,如 `context.state` 就会获取到 `state` 属性， `context.commit` 就会执行`commit`命令。

## `module`

`module`主要是因为`vuex`是单一树管理状态，如果管理的状态太多，放在一个文件内太过臃肿，`vuex`用`module`来分别存储不同的状态，每个`module`都可以有自己的`state getter mutation action`

新建`src/components/ToggleSidebarMenu/index.vue`:

```
<template>
    <div class="sidebar-menu">
        <span v-bind:class="isCollapse?'el-icon-s-fold':'el-icon-s-unfold'" v-on:click="toggleClick"></span>
    </div>
</template>

<script>
export default {
    name: 'ToggleSidebarMenu',
    props: {
        isCollapse: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        toggleClick() {
            this.$emit('toggleClick');
        }
    }
}
</script>

<style lang="scss" scoped>
.sidebar-menu{
    width:64px;
    height:64px;
    float:left;
    span{
        display: block;
        width:100%;
        height:100%;
        text-align: center;
        line-height: 64px;
        background: #fff;
        font-size:28px;
        cursor: pointer;
        transition: background .3s;
        &:hover{
            background: rgba(0,0,0,.025);
        }
    }
}
</style>

```

这里使用了`element-ui`的字体图标，并通过`props`接收父组件传递过来的一个参数的布尔值，来具体显示哪个图标，给图标添加点击事件用来通过`$emit`触发父组件的自定义事件`toggleClick`

关于`props`接收值的写法问题： 
```
props: {
  // 基础类型检测, null意味着任何类型都行
  propA: Number,
  // 多种类型
  propB: [String, Number],
  // 必传且是String
  propC: {
   type: String,
   required: true
  },
  // 数字有默认值
  propD: {
   type: Number,
   default: 101
  },
  // 数组、默认值是一个工厂函数返回对象
  propE: {
   type: Object,
   default: function() {
    console.log("propE default invoked.");
    return { message: "I am from propE." };
   }
  },
  // 自定义验证函数
  propF: {
   isValid: function(value) {
    return value > 100;
   }
  }
 }
```

新建`src/layout/default/components/HeaderModule.vue`文件：
```
<template>
    <el-header>
        <toggle-sidebar-menu v-bind:is-collapse="isCollapse" v-on:toggleClick="toggleSidebar" />
    </el-header>
</template>

<script>
import ToggleSidebarMenu from '@/components/ToggleSidebarMenu'
export default {
    name:"HeaderModule",
    data() {
      return {
        isCollapse: false
      };
    },
    components:{
        ToggleSidebarMenu,
    },
    methods:{
        toggleSidebar() {
            this.isCollapse = !this.isCollapse;
        },
    }
}
</script>

<style lang="scss" scoped>
.el-header{
    background: #ffffff;
    padding:0!important;
    height:64px!important;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
    position: relative;
    z-index: 1;
}
</style>
```

这里给子组件绑定了`is-collapse`传递`data`中返回的`isCollapse`值，并绑定了一个自定义事件`toggleClick`用来执行改变`isCollapse`值的事件。

到这里还没有开始使用`vuex`的状态管理，先将布局做好并能正常显示，这里需要修改`src/layout/default/components/index.js`文件，引入`HeaderModule.vue`
```
export { default as Sidebar } from './Sidebar/index.vue';
export { default as HeaderModule } from './HeaderModule.vue';
```

然后修改`src/layout/default/index.vue`文件：
```
<template>
  <el-container>
    <sidebar />
    <el-container>
      <header-module />
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import { Sidebar, HeaderModule } from './components';
export default {
  name: 'Layout',
  components: {
    Sidebar,
    HeaderModule,
  },
  methods: {
  }
}
</script>

<style>

  .el-main {
    background-color: #f5f5f5;
    color: #333;
  }
</style>

```

这些做完后，运行项目，按钮的点击操作切换字体图标已经实现了，但是可以发现，布局出现了异常，这是因为使用了`element-ui`的框架布局，`element-ui`的`el-container`标签只有在子元素中包含`<el-header>` 或 `<el-footer>` 时，全部子元素会垂直上下排列，否则会水平左右排列。这里因为将`el-header`移出另写为一个组件了，`el-container`中未发现`el-header`和`el-footer`，所以就变成了水平左右排列，只需要将`el-header`标签及相关样式移回`src/layout/default/index.vue`页面内即可。相关页面修改如下：

```
// src/layout/default/index.vue
<template>
  <el-container>
    <sidebar />
    <el-container>
      <el-header>
        <header-module />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import { Sidebar, HeaderModule } from './components';
export default {
  name: 'Layout',
  components: {
    Sidebar,
    HeaderModule,
  },
  methods: {
  }
}
</script>

<style>
.el-header{
  background: none;
  padding:0!important;
  height:64px!important;
}
.el-main {
  background-color: #f5f5f5;
  color: #333;
}
</style>

// src/layout/default/components/HeaderModule.vue
<template>
    <div class="header">
       <toggle-sidebar-menu v-bind:is-collapse="isCollapse" v-on:toggleClick="toggleSidebar" />
    </div>
</template>

<script>
import ToggleSidebarMenu from '@/components/ToggleSidebarMenu'
export default {
    name:"HeaderModule",
    data() {
      return {
        isCollapse: false
      };
    },
    components:{
        ToggleSidebarMenu,
    },
    methods:{
        toggleSidebar() {
            this.isCollapse = !this.isCollapse;
        },
    }
}
</script>

<style lang="scss" scoped>
.header{
    width:100%;
    height:64px;
    background: #fff;
}
</style>
```

接下来就需要用`vuex`管理按钮的操作状态了

新建`src/store/modules/header.js`:

```
import Cookies from 'js-cookie';

const state = {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    },
  }
  
  
const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```
这里首先用到了`js-cookie`，需要先下载该插件，这里可以直接引用
```
yarn add js-cookie
```
然后是创建侧边栏状态`state.sidebar.opened`,默认是`true`打开状态，`!!`是用来将后面的表达式转换为布尔类型，规则为 `false`、`undefinded`、`null`、`0`、`""` 为 `false`;`true`、`1`、`"somestring"`、`[Object]` 为 `true`

在之后就是分别创建了`mutations`用来改变状态，`actions`用来提交改变，最后就是将该文件暴露出去，剩下的事情就是在需要改变该状态的地方通过分发`dispatch`来触发`action`提交`mutations`里设置的方法对状态所做的改变，`mutations`必须是同步函数，而`actions`专门用来处理异步操作，`actions`提交的是`mutations`，而不是直接改变状态。

侧边栏状态管理模块创建好了，接下来是注册到`vuex`实例中，修改`src/store/index.js`

```
import Vue from 'vue';
import Vuex from 'vuex';

import header from './modules/header';

Vue.use(Vuex);


const store = new Vuex.Store({
  modules:{
    header
  }
});
  
export default store;
```
这里`store`中的`header`就相当于`header:header`的简写。

最后将`store`挂着到项目中，修改`src/main.js`
```
import Vue from 'vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css

import store from './store'
import App from './App.vue';
Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});

```
接下来就是在用到该状态的地方通过`mapState`获取状态值，通过`dispatch`分发`action`触发`mutation`对状态做出改变。

修改`src/layout/default/components/HeaderModule.vue`:
```
<template>
    <div class="header">
        <toggle-sidebar-menu v-bind:is-collapse="sidebar.opened" v-on:toggleClick="toggleSidebar" />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ToggleSidebarMenu from '@/components/ToggleSidebarMenu';
export default {
    name:"HeaderModule",
    components:{
        ToggleSidebarMenu,
    },
    computed:{
        ...mapState({
            sidebar: state => state.header.sidebar,
        }),
    },
    methods:{
        toggleSidebar() {
            this.$store.dispatch('header/toggleSideBar');
        },
    }
}
</script>

<style lang="scss" scoped>
.header{
    width:100%;
    height:64px;
    background: #fff;
}
</style>
```
这里删除了之前写在该页面的静态数据，引入`mapState`，并通过`...mapState`获取`vuex`中的数据状态，并将数据绑定在按钮传值`is-collapse`上。修改自定义事件`toggleClick`所监听的`toggleSidebar`方法，通过`dispatch`分发`action`触发`mutation`对状态做出改变。


到此整个`vuex`的一个流程就全部写完了，运行项目，可以看到切换字体图标的行为还是成功，这里只是按钮本身使用了该状态管理，接下来要通过该状态管理实现侧边栏的关闭和展开，侧边栏是另一个组件，这里就体现出`vuex`状态管理的好处了，没有麻烦的跨组件传值问题

前面说到过，多组件使用同一个操作，那么可以提取到`getters`中，这里再做以下修改，首先新建`src/store/getters.js`文件：

```
const getters = {
    sidebar: state => state.header.sidebar,
};
export default getters;
```
然后修改`src/store/index.js`文件：
```
import Vue from 'vue';
import Vuex from 'vuex';

import header from './modules/header';
import getters from './getters';

Vue.use(Vuex);


const store = new Vuex.Store({
    modules:{
        header,
    },
    getters
});
  
export default store;
```
最后修改`src/layout/default/components/HeaderModule.vue`:
```
<template>
    <div class="header">
        <toggle-sidebar-menu v-bind:is-collapse="sidebar.opened" v-on:toggleClick="toggleSidebar" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ToggleSidebarMenu from '@/components/ToggleSidebarMenu';
export default {
    name:"HeaderModule",
    components:{
        ToggleSidebarMenu,
    },
    computed:{
        ...mapGetters([
            'sidebar',
        ]),
    },
    methods:{
        toggleSidebar() {
            this.$store.dispatch('header/toggleSideBar');
        },
    }
}
</script>

<style lang="scss" scoped>
.header{
    width:100%;
    height:64px;
    background: #fff;
}
</style>
```
再次运行项目，功能依然完好。目前来说`src/store/modules`中只有一个`header`模块，但是整个项目肯定不止拆分这一个模块，每一个都需要在`src/store/index.js`中引入在注册到实例中，其实也非常麻烦，这里也可以做一下修改：
```
import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';

Vue.use(Vuex);

const modulesFiles = require.context('./modules', false, /\.js$/);
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './header.js' => 'header'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules;
}, {});
  

const store = new Vuex.Store({
    modules,
    getters
});
  
export default store;
```
从此以后在`src/store/modules`文件夹下创建的模块都不用再手动引入到`src/store/index.js`文件中了，这里已经可以自动执行这些操作了。

接下来修改`src/layout/default/components/Sidebar/index.vue`文件：

```
// 引入`mapGetter`
import { mapGetters } from 'vuex';
//添加计算属性
computed:{
    ...mapGetters([
        'sidebar',
    ]),
    isCollapse() {
      return !this.sidebar.opened;
    }
},

// 为el-menu标签添加其自身的绑定事件
:collapse="isCollapse"
```
此时运行项目可以看到菜单栏的菜单已经可以隐藏并只显示一级菜单的图标了，现在需要将侧边栏收缩，也简单，只需给根级标签`el-aside`添加一个根据状态改变绑定不同的类，从而通过这个类去控制该标签下所有其他标签的样式变：

```
// 添加类绑定
<el-aside v-bind:class="!isCollapse?'':'hideSideBar'">

// 添加相关样式
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
```

这里需要说明的是`element-ui`的`el-menu`的绑定事件`:collapse="isCollapse"`是是否折叠，默认是`false`，也就是不折叠，而我这里保存的状态是侧边栏是否打开`sidebar.opened`，默认是`true`，也就是打开的，两者意思一样，但是表现在值上是相反的，所以这里在用到`isCollapse`时，`el-aside`会是`!isCollapse`才会是正常的写法~

此时运行项目点击侧边栏控制按钮，就已经实现了收缩侧边栏菜单的功能了，这里有过渡效果是在之前就已经在`el-aside`这个类中写了`transition: width .25s ease-out;`这个过渡样式。

还有一点就是因为这个状态做了`cookie`存储，所以即使`f5`刷新页面也还能保存之前修改的状态。

到这里针对`vue`的`vue-router`和`vuex`就全部都已经用在项目中了。