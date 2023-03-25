<template>
  <el-form :model="form" ref="form" label-width="100px">
    <el-form-item label="学生姓名" prop="name">
      {{form.name}}
    </el-form-item>
    <el-form-item label="学生学号" prop="id">
      {{form.id}}
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="form.gender">
        <el-radio label="男">男</el-radio>
        <el-radio label="女">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="体温度数" prop="temperature">
      <el-input-number v-model="form.temperature" :min="35" :max="42" :step="0.1"></el-input-number>
    </el-form-item>
    <el-form-item label="地点" prop="location">
      <el-input v-model="form.location" placeholder="请输入地点"></el-input>
    </el-form-item>
    <el-form-item label="是否发烧" prop="hasFever">
      <el-switch v-model="form.hasFever" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        name: '',
        id: '',
        gender: '男',
        temperature: 36.5,
        location: '',
        hasFever: false
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //发送表单
          this.submit()
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    submit(){
      let path = 'http://127.0.0.1:5001/stu/submit' //本地端口
      // let parm = this.data()
      axios.get(path, {params:this.form})
          .then((response) => {
            // 请求成功处理
            if (response.data.code === 200) {
              console.log(response.data);
              alert('提交成功');
            }
            else{
              alert('提交失败');
            }

          })
          .catch((error) => {
            // 请求错误处理
            console.log(error);
          });

    },

  },
  mounted() {
    this.form.id=localStorage.getItem('username')
    this.form.name=localStorage.getItem('name')
  }
};
</script>

<style scoped>

</style>