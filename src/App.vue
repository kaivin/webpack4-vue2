<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-button type="primary">主要按钮</el-button>
      </el-main>
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
