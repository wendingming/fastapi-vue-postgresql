<template>
  <div class="about">
    <h1>管理员信息</h1>
    {{userInfo}}
  </div>
</template>

<script>

    //挂载api.js组件
    //import Api from '@/api/api.js'

    export default {
        data() {//定义一个变量
            return {
                userInfo: []
            };
        },
        mounted()
        {
            this.$store.dispatch("GetInfo", '').then((res) => {
                //this.$message.success("获取管理员信息成功");
                let params = JSON.parse(JSON.stringify(res));
                this.userInfo = params;
            })
            /*Api.getInfo().then((res) => {//访问接口，并把获取的数据赋值给userInfo变量
                this.userInfo = res;
            }).catch(err=>{
                console.log(err)
            });*/
        },
        name: "管理员信息",
        methods:{
        }
    };
</script>
