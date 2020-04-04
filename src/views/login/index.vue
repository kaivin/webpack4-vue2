<template>
    <div class="login-container">
        <Particles />
        <LoginFormModule />
    </div>
</template>
<script>
import Particles from '@/components/Particles/index.vue';
import LoginFormModule from './components/login1.vue';
export default {
    name:'Login',
    components: {
        Particles,
        LoginFormModule
    },
}
</script>
<style lang="scss" scoped>
.login-container{
    width:100%;
    height:100%;
    overflow: hidden;
    position: relative;
}
</style>
