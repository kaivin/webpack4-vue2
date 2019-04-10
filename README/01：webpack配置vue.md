# 配置 vue

在 `webpack4.x` 中我们已经安装了 `vue` 以及 `vue-router` 插件，此次又是基于 `webpack4.x` 做进一步配置，所以不再重复安装，只是配置 `vue`，还需要其他的一些基础插件。

首先安装相关插件
```
yarn add vue-loader vue-style-loader vue-template-compiler -D
```

1. `vue-loader`:因为`.vue`文件模板中包含了`template`,`script`,`style`这三个顶级语言模块，而且还支持添加自定义模块，所以要想`webpack`能正确的识别各个语言模块并编译，就需要`vue-loader`来解析文件，并提取出每个语言块。而且该插件还支持使用非默认语言，比如`css`的预处理器，预编译的`html`模板语言，通过设置`lang`属性值来确认使用的语言，比如：

```
<style lang='scss'>
    /*scss*/
</style>
```
* `template` 标签内主要是写 `html` 代码的部分，需要注意的是，只允许有一个顶级父标签，也就是`template`只允许有一个子级
* `script` 没什么好说的，`.vue`文件的 `js` 代码都在这里
* `style` 这个就是样式的部分，需要注意的是，`lang` 代表所使用的处理器 可以是 `css` `scss` `less` `postcss` 等。
* 还有一个值得一说的是，`scoped` 表明 `style` 里的 `css` 样式只适用于当前组件元素 

> 使用了`scoped`属性之后，父组件的`style`样式将不会渗透到子组件中，然而子组件的根节点元素会同时被设置了`scoped`的父`css`样式和设置了`scoped`的子`css`样式影响，这么设计的目的是父组件可以对子组件根元素进行布局。 
> `.vue`模板中的样式是根据需要按需加载，访问一个页面该组件中的样式就会追加到`head`标签中，如果父子组件中都对某个子组件根节点元素进行了控制，则父组件里的样式会被后来的覆盖。
> 如果想对设置了`scoped`的子组件里的元素进行控制可以使用`>>>`或者`deep`

```
<template>
  <div id="app">
    <gHeader></gHeader>
  </div>
</template>

<style lang="css" scoped>
  .gHeader /deep/ .name{ //第一种写法
    color:red;
  }
  .gHeader >>> .name{   //二种写法
    color:red;
  }
</style>
```

```
// 子组件
<div class="gHeader">
  <div class="name"></div>
</div>
```

一些预处理程序例如`sass`不能解析`>>>`属性，这种情况下可以用`deep`，它是`>>>`的别名，工作原理相同。

当然一个 `.vue` 文件，可以有多个 `style` 可以分别设置不同的预处理，不同的使用范围

使用`v-html`动态创建的`DOM`内容，不受设置`scoped`的样式影响，但依然可以使用深选择器进行控制

**个人不建议使用scoped，甚至不建议使用页面内的 style，完全可以通过在script中引用外部样式文件**

虽然不建议使用，但是配置里还是要做相关配置来处理这些样式的。

2. `vue-style-loader`: `vue-loader`可以解析`.vue`文件，并提取各个语言块，但是对于`.vue`文件内的样式，在提取出来后，对样式进行处理，就需要用到`vue-style-loader`插件了。

3. `vue-template-compiler`:`.vue`文件的模板解析器。


插件安装完成后，首先需要做的是配置 `vue-loader`， `webpack4.x`对于 `vue-loader` 有特殊配置，在三个 `webpack`配置文件中添加如下代码：

```
const { VueLoaderPlugin } = require('vue-loader');
// 插件配置项
plugins: [
    new VueLoaderPlugin(),
]
```

然后修改`webpack.dev.conf.js`文件，在`rules`中添加如下代码：

```
{
    test: /\.vue$/,
    use:[
        {
            loader: 'vue-loader',
            options:{
                // 去除模板中的空格
                preserveWhitespace: false,
                // postcss配置,把vue文件中的样式部分,做后续处理
                postcss:{
                    plugins:postcss.plugins,
                    options:{parser: 'postcss-scss'}
                },
                loaders:{
                    css: ['vue-style-loader', 'css-loader'],
                    scss: ['vue-style-loader', 'css-loader', 'scss-loader'],
                }
            }
        }
    ],
},
```

这里使用了`postcss`配置，`vue-loader`配合`postcss`使用，`postcss`的配置项需要放在`options`内，其写法如下：

```
{
    test: /\.vue$/,
    loader: 'vue-loader',
    // `vue-loader` 选项放这里
    options: {
        // ...
        postcss: [require('postcss-cssnext')()]
    }
}
// 或者
{
    test: /\.vue$/,
    loader: 'vue-loader',
    // `vue-loader` 选项放这里
    options: {
        // ...
        postcss: {
            plugins: [...], // 插件列表
            options: {
                parser: 'postcss-scss' // 使用 postcss-scss 解析器
            }
        }
    }
}
```
这里我使用的是第二种方法，到了这一步，那么开发环境的`vue`基础配置就算完成了，接下来需要修改一下测试及生产环境的配置：
```
// webpack.test.conf.js、webpack.prod.conf.js

// rules中添加
{
    test: /\.vue$/,
    use:[
        {
            loader: 'vue-loader',
            options:{
                // 去除模板中的空格
                preserveWhitespace: false,
                // postcss配置,把vue文件中的样式部分,做后续处理
                postcss:{
                    plugins:postcss.plugins,
                    options:{parser: 'postcss-scss'}
                },
                loaders:{
                    css: [MiniCssExtractPlugin.loader, 'css-loader'],
                    scss: [MiniCssExtractPlugin.loader, 'css-loader', 'scss-loader'],
                }
            }
        }
    ],
},
```

此时关于`webpack`配置`vue`就已经可以正常使用了，先执行`yarn start`，页面能正常先，则配置没有大问题，那么就可以删除项目`src`文件夹下现有的这些文件，并新建`vue`的项目文件进行测试及正常开发了。

这里先删除不需要的文件，然后可以先通过`@vue/cli`创建一个初始化的`vue`项目，然后将该项目的代码全部复制过来，不用管它的配置问题，我们需要的是：
1. 入口文件`main.js`的代码（复制并覆盖`src/idnex.js`文件中的代码，并将`src/index.js`文件名修改为`src/main.js`）
2. 模板文件`public/index.html`的代码（复制并覆盖`src/index.html`文件中的代码，删除头部引用图标`icon`的相关代码，然后将该文件移到根目录下）
3. 组件`components/HelloWorld.vue`文件
4. `src/App.vue`文件（修改图片引用路径）
5. 他们的`logo`（`logo`图片放到`src/assets/images`中）
6. 修改`webpack`配置中关于上述修改的入口文件名`src/main.js`，以及模板文件路径`index.html`

然后运行`yarn start`，此时终端会报一堆的`eslint`检测出的语法错误，修改这些语法错误后，`vue`初始化项目就被拷贝过来了，也能在浏览器中正常显示。

此时就说明，我们的项目已经可以支持`vue`开发了~

说明：

`vue-loader` 升级到 `15.x` 后，会导致旧的 `commonjs` 写法加载有问题，需要使用 `require('com.vue').default` 的方式引用组件

`13`的版本还可以设置 `esModule`，`14` 以后的版本不能设置了，`vue` 文件导出的模块一定是 `esModule`

解决办法：使用 `require('com.vue').default` 或者 `import` 的方式引用组件。