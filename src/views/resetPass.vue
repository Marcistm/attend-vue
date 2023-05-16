<template>
    <div class="login">
        <!-- 重设密码面板 -->
        <div class="login-box">
            <div class="login-box-title">
                修改密码
            </div>
            <div class="login-box-from">
                <el-form :model="loginForm" :rules="rules" ref="loginForm"  class="demo-ruleForm">
                    <el-form-item prop="password" label="新密码">
                        <el-input v-model="loginForm.password" placeholder="请输入密码" size="medium" type="password">
                            <el-button slot="prepend" icon="el-icon-key"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="repass" label="重复密码">
                        <el-input v-model="loginForm.repass"  placeholder="请重复密码" size="medium" type="password">
                            <el-button slot="prepend" icon="el-icon-key"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" :loading="loading" style="width:100%" @click="submitForm('loginForm')">确认重设</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>

</template>

<script>
import axios from 'axios'
import { getUser } from "@/utils/auth";

export default {
    data(){
      const validatePass = (rule, value, callback) => {
        this.$refs.loginForm.validateField('re_passwd');
        callback();
      };
      const validateRePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.loginForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
        return {
            loading: false, //登陆状态
            loginForm:{  // 登陆表单
                password: '',
                repass: ''
            },
            rules:{  //登陆验证规则
                password:[
                    { validator: validatePass, trigger: 'blur' }
                ],
                repass: [
                    { validator: validateRePass, trigger: 'blur' }
                ]
            }
        }
    },
  methods:{
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.login()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        login(){
          let path = 'http://43.143.116.236:5001/change_pswd'
          let value = {
            'username': getUser(),
            'password': this.loginForm.password
          }
          axios.put(path, value).then(responses => {
            if (responses.data.code === 200) {
              let role=localStorage.getItem('permission')
              console.log(role==='0')
              if(role==='0'){
                this.$router.push({
                  path: this.$route.query.redirect || '/info'
                })
              }else {
                this.$router.push({
                  path: this.$route.query.redirect || '/home'
                })
              }

            } else {
              this.loading = false
              this.$message.error(responses.data.msg)
            }
          })
        }
    }
}
</script>

<style scoped>
.login{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  background: url("../../public/background.png") no-repeat;
  background-size: 100% 100%;
}
.login-box{
    width: 350px;
    /* height: 287px; */
    background: hsla(0,0%,100%,.3);
    border-radius: 5px;
    box-shadow: 0 0 2px #f7f7f7;
    border: 1px solid #f7f7f7;
}
.login-box-title{
    line-height: 50px;
    font-size: 20px;
    color: #ffffff;
    text-align: center;
    border-bottom: 1px solid #ffffff;
}
.login-box-from{
    width: 100%;
    height: auto;
    padding: 30px;
    box-sizing: border-box;
}
</style>
