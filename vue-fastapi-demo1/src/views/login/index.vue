<template>
    <div class="loginContainer">
        <h1>登录</h1>
        <div>
          <el-form :model="loginForm" label-width="0px" class="login_form" :ref="loginForm">
            用户名：<el-input id="username" class="inputStyle" size="large" v-model="loginForm.username"></el-input>
            <br />
            密&nbsp;&nbsp;&nbsp;&nbsp;码：<el-input
              id="password"
              class="inputStyle"
              size="large"
              type="password"
              v-model="loginForm.password"
              autocomplete="off">
            </el-input>
            <br />
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form>

        </div>
    </div>
</template>
<script>
//挂载api.js组件
import Api from '@/api/api.js'

export default {/* eslint-disable */

    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            }
        };
    },
    mounted()
    {
        //const login_Form =  ref(null);
    },
    methods: {
        submitForm() {
            //console.log(this.loginForm)，，，为什么，VUE会给数组套一层proxy壳，草，怎么想的？，没办法，用JSON.parse转换成可以正常用的数组
            let params = JSON.parse(JSON.stringify(this.loginForm));
            //console.log(params)
            Api.login(params).then((res) => {//访问接口，并传递表单数据
                console.log(res)
            }).catch(err=>{
                console.log(err)
            });
        },
        resetForm(formName) {
            this.loginForm.username = "";
            this.loginForm.password = "";
        },
    },
};
</script>

<style scoped>
    .loginContainer {
        margin: 0 auto;
        width: 600px;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 50px;
        border: 1px solid;
    }
    .loginContainer input {
        margin-bottom: 20px;
    }
    .loginStyle {
        width: 160px;
        height: 40px;
        background: rgb(50, 203, 77);
        color: white;
        font-size: 17px;
    }
    .inputStyle {
        width: 200px;
        height: 60px;
        padding: 5px;
        outline: none;
    }

    .inputStyle:focus {
        border: 1px solid rgb(50, 203, 77);
    }
    form {
        position: relative;
    }
    .exchange {
        position: absolute;
        top: 8px;
        right: 65px;
        color: red;
    }
</style>
