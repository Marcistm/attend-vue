<template>
  <div class="login-page" >
    <div class="login-panel">
    <el-form :model="loginForm" :rules="rules" ref="loginForm" >
      <div class="text">
        <div>LOGIN</div>
        <br>
      </div>

      <el-form-item prop="username" >
        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" >
        <el-input v-model="loginForm.password"  type="password" placeholder="默认密码12345678"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitForm('loginForm')" >登录</el-button>
        </el-form-item>
    </el-form>
      </div>
  </div>
</template>

<script>
import axios from "axios";
import { setUser, setUserName} from "@/utils/auth";
export default {
  name: "Login",
  data(){
    let letterRule = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_-]{4,18}$/
      if (value === '') {
        callback(new Error('输入内容不能为空'));
      }else if(!reg.test(value)) {
        callback(new Error('请输入字母、数字、下划线'));
      }else{
        callback();
      }
    };
    return{
      loading: false, //登陆状态
      loginForm:{  // 登陆表单
        username: '',
        password: ''
      },
      rules:{  //登陆验证规则
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' },
          { validator: letterRule, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          { validator: letterRule, trigger: 'blur' }
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
      let path = 'http://43.143.116.236:5001/login'
      let param = {
        username: this.loginForm.username,
        password: this.loginForm.password
      }
      axios.get(path, { params: param, timeout: 300000 }).then(responses => {
        if (responses.data.code === 200) {
          if (responses.data.privilege === '0') {
            this.loading = false
            this.$message.error('没有登录系统的权限')
          } else {
            localStorage.setItem('name',responses.data.name)
            localStorage.setItem('permission', responses.data.privilege)
            localStorage.setItem('username',this.loginForm.username)
            setUser(this.loginForm.username)
            this.$store
                .dispatch('user/login',{token: responses.data.token})
                .then(()=>{
                  this.loading = true
                  // 登陆成功后重定向
                  // 如果初次登录跳转到更改密码页面
                  setUserName(responses.data.name)

                  if (responses.data.has_login === 0) {
                    this.$router.push({
                      path: this.$route.query.redirect || '/resetPass'
                    })
                  } else {
                    this.$router.push({
                      path: this.$route.query.redirect || '/home'
                    })
                  }
                })
                .catch(err=>{
                  this.loading = true
                  // console.log(err)
                })
          }
        } else {
          this.loading = false
          this.$message.error(responses.data.msg)
        }
      }).catch(error => {
        this.loading = false
        this.$message.error('请求超时，请检查网络连接')
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

.el-form{
  width: 300px;
  text-align: center;
}
.login-page{

  position: absolute;
  height: 100%;
  width: 100%;
  background: url("../../public/background.png");
  background-size: 100% 100%;
  text-align: center;

}
.logo{
  height: 200px;

}
.text{
  color:whitesmoke;
  font-size: 20px;
  margin-top: 15px;
}

.el-input{
  width: 300px;
}
.login-panel{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-color: #CDD0D6;
  border-width: 1px;
  border-style: solid;
  background-color: transparent;
  width: 900px;
  height: 250px;
  opacity: 1;
}
</style>
