<template>
    <div class="hello-page">
        <img alt="Vue logo" src="@/assets/images/logo.png" />
        <HelloWorld msg="Welcome to Your Vue.js App" />
    </div>
</template>


<script>
import HelloWorld from '@/components/HelloWorld.vue';
export default {
  name: 'HelloWorldPage',
  components: {
    HelloWorld
  }
}
</script>

<style scoped>
.hello-page{
    width:100%;
    overflow: hidden;
    text-align: center;
}
</style>
