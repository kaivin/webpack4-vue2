# 引入element-ui

#### 整体引入

修改`src/main.js`文件：

```
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');

```

如此就已经完成了`element-ui`的引入。

先做个测试，从`element-ui`官网的组件-布局容器中选一种布局方式，复制代码到`src/App.vue`文件中，并对样式做部分修改：

```
<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'app',
  // components: {
  //   HelloWorld
  // }
}
</script>

<style>
html,body{
  margin:0;
  padding:0;
  height:100vh;
  overflow: hidden;
}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    height:100%;
  }
</style>

```

然后运行`yarn start` 页面能正常显示且布局正确，则说明引入成功。

整体引入并不是多么完美的办法，项目也许并不会用到该`ui`库的所有组件，有些无用组件通过整体引入，也被打包到了项目中，这就增加了项目的体积，所以，按需引入更适合项目开发

#### 按需引入

按需引入需要借助`babel-plugin-component`插件，可以只引入用到的组件，达到减小项目体积的目的

```
yarn add babel-plugin-component -D
```

然后修改`.babelrc`文件，在`plugins`中添加如下插件：

```
[
    "component",
    {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
    }
]
```

本项目目前的布局容器用到了`Container,Header,Aside,Main,Footer`，所以，修改`src/main.js`的引入：

```
import Vue from 'vue';
import {Container,Header,Aside,Main,Footer} from 'element-ui';
import App from './App.vue';

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
```

再次运行`yarn start` 查看效果，此时页面依然能正常显示，则说明配置成功！~

# 全局配置

`element` 支持配置全局对象，该对象目前支持`size`和`zIndex`字段。`size` 用于改变组件的默认尺寸，`zIndex` 设置弹框的初始 `z-index`（默认值：`2000`）

#### 整体引入时配置如下：

```
import Element from 'element-ui';
Vue.use(Element, { size: 'small', zIndex: 3000 });
```

#### 按需引入时配置如下：

```
import {Container,Header,Aside,Main,Footer,Button} from 'element-ui';
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Button);
```
修改`src/main.js`文件，这里增加了`Button`的引入，以作测试用。

按照以上设置，项目中所有拥有 `size` 属性的组件的默认尺寸均为 'small'，弹框的初始 `z-index` 为 3000。

修改`src/App.vue`文件在`el-main`中添加按钮组件：

```
<el-button type="primary">主要按钮</el-button>
```
运行`yarn start`，按钮可以正常显示。查看`Button`组件的`size`属性，可看到其有三种值供选择：`medium / small / mini`，这里可以修改全局配置的`size`参数值查看具体按钮变化。
