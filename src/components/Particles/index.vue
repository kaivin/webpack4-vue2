<template>
    <div id="particles-js"></div>
</template>
<script>
import particlesJs from "particles.js";
import particlesConfig from "./particles4.json";
export default {
    name:'Particles',
    mounted() {
      this.init();
    },
    methods: {
      init() {
        particlesJS("particles-js", particlesConfig);
      }
    }
}
</script>
<style lang="scss" scoped>
#particles-js{
  width: 100%;
  height: 100%;
  background-color: #020616;
  background-image: url('../../assets/images/login_bg.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
