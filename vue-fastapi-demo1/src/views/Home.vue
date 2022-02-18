<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    {{FirstSting}}<!--显示接口返回值-->
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

//挂载api.js组件
import Api from '@/api/api.js'

export default {
  data() {//定义一个变量
    return {FirstSting: "ABC"};
  },
  mounted()
  {
      Api.index().then((res) => {//访问接口，并把获取的数据复制给FirstSting变量
          this.FirstSting = res.message;
      }).catch(err=>{
          console.log(err)
      });
  },
  name: "Home",
  components: {
    HelloWorld,
  },
};
</script>
