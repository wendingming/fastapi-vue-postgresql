<template>
  <div class="about">
    <h1>管理员信息</h1>
    <div class="all-container">
      <div class="all-container-padding bg" >
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="first">
            <el-form :model="userInfo" :rules="rules" ref="EditorUserForms">
              <el-form-item label="头像" prop="avatar" :label-width="formLabelWidth">
                <el-upload class="avatar-uploader" action="//shujiaoke.oss-cn-hangzhou.aliyuncs.com" :before-upload="beforeupload" :data="uploadParm" :show-file-list="false" :on-success="handleUpSuccess">
                  <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon " style="width:80px;height:80px;"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
                <el-col :span="8"> <el-input v-model="userInfo.username" disabled ></el-input></el-col>
              </el-form-item>
              <el-form-item label="全名" prop="fullname" :label-width="formLabelWidth">
                <el-col :span="8">  <el-input v-model="userInfo.full_name" placeholder="请输入全名"></el-input></el-col>
              </el-form-item>
              <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                <el-col :span="8">  <el-input v-model="userInfo.email" placeholder="请输入邮箱"></el-input></el-col>
              </el-form-item>
              <el-form-item label="用户菜单" prop="permisson" :label-width="formLabelWidth">
                <el-col :span="8">
                  <el-input v-model="userInfo.permisson" disabled ></el-input>
                </el-col>
              </el-form-item>
            </el-form>
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="EditorUserClick('userInfo')" >保存</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="second">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item label="原密码" prop="pass" :label-width="formLabelWidth">
                <el-col :span="8">  <el-input v-model="ruleForm.pass" placeholder="请输入原密码" type="password"></el-input></el-col>
              </el-form-item>
              <el-form-item label="新密码" prop="newpass" :label-width="formLabelWidth">
                <el-col :span="8"><el-input v-model="ruleForm.newpass" placeholder="请输入新密码" id="newkey" type="password"></el-input></el-col>
              </el-form-item>
              <el-form-item label="重复新密码" prop="checknewpass" :label-width="formLabelWidth">
                <el-col :span="8">  <el-input v-model="ruleForm.checknewpass" placeholder="请再次输入新密码" id='newkey1' type="password"></el-input></el-col>
              </el-form-item>
            </el-form>
            <div class="grid-content bg-purple">
              <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
    //挂载api.js组件
    //import Api from '@/api/api.js'

    export default {
        data() {//定义一个变量
            var validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入密码"));
                } else {
                    if (this.ruleForm.checknewpass !== "") {
                        this.$refs.ruleForm.validateField("checknewpass");
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请再次输入密码"));
                } else if (value !== this.ruleForm.newpass) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            };
            return {
                userInfo: [],//用户信息表单
                //uploadParm: {}, //图片的上传
                ruleForm: {},//修改密码的表单
                activeName: "first",
                loading: true,
                baseUrl: process.env.BASE_API,
                userlist: {},//用户信息表单
                formLabelWidth: "150px",
                /***校验***/
                rules: {
                    /*phone: [
                        {
                            required: true,
                            message: "请输入电话号码"
                        },
                        {
                            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                            message: "手机格式不对"
                        }
                    ],*/
                    email: [
                        {
                            required: true,
                            message: "请输入电子邮箱"
                        },
                        {
                            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
                            message: "请输入有效的邮箱"
                        }
                    ],
                    pass: [
                        {
                            required: true,
                            trigger: "blur",
                            message: "请输入密码"
                        }
                    ],
                    newpass: [
                        {
                            validator: validatePass,
                            trigger: "blur"
                        }
                    ],
                    checknewpass: [
                        {
                            validator: validatePass2,
                            trigger: "blur"
                        }
                    ]
                }
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
            //修改密码
            submitForm(ruleForm) {
                let username = this.userInfo.username;
                let oldpwd = ruleForm.pass;
                let newpwd = ruleForm.newpass;
                var obj = {
                    username: username,
                    oldpwd: oldpwd,
                    newpwd: newpwd
                };
                console.log(obj);
            },
            // 编辑提交的方法
            EditorUserClick() {
                this.$refs.EditorUserForms.validate(valid => {
                    if (valid) {
                        console.log(this.userlist);
                    }
                });
            }
        }
    };
</script>
