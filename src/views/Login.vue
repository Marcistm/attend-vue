<template>
  <div class="login-page" >
    <div class="login-panel">
    <el-form>
      <div class="text">
        <div>LOGIN</div>
        <br>
      </div>

      <el-form-item>
        <el-input v-model="user" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item><el-input v-model="pwd" type="password" placeholder="请输入密码"></el-input></el-form-item>
      <el-form-item>
        <el-button type="danger" @click="login" >登录</el-button>
        </el-form-item>
    </el-form>
      </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      user:'',
      pwd:'',
    }
  },
  methods:{
    login(){
      this.$router.push({name:'home'})
    }
  }
}
</script>

<style scoped>
.login-page{

  position: absolute;
  height: 100%;
  width: 100%;
  background: url("../assets/background.png");
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
  width: 800px;
  height: 250px;
  opacity: 1;
}
</style>
