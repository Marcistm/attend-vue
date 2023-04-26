<template>
  <div>
    <div v-if="$store.state.stu_info.tag" >
      <div >今日健康申报已填写</div>
    </div>
    <el-form v-else :model="form" ref="form" label-width="150px" style="width: 50%">
      <el-form-item label="体温度数" prop="temperature">
        <el-input-number v-model="form.temperature" :min="35" :max="42" :step="0.1"></el-input-number>
      </el-form-item>
      <el-form-item label="目前所在地" prop="location">
        <el-input v-model="form.location" placeholder="请输入地点"></el-input>
      </el-form-item>
      <el-form-item label="身体状况">
        <el-input v-model="form.body_condition"></el-input>
      </el-form-item>
      <el-form-item label="是否疑似感染新冠">
        <el-switch v-model="form.is_infection"></el-switch>
      </el-form-item>
      <el-form-item v-if="form.is_infection" label="之前新馆感染次数">
        <el-input-number v-model="form.infection_count" :min="0" :max="10" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item v-if="form.is_infection" label="室友状况是否异常" >
        <el-switch v-model="form.other_condition"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import {getUser} from "@/utils/auth";
export default {
  data() {
    return {
      form: {
        username:getUser(),
        is_infection: false,
        temperature: 36.5,
        infection_count:0,
        location: '',
        body_condition: '',
        other_condition:false
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
      axios.get(path, {params:this.form})
          .then((response) => {
            // 请求成功处理
            if (response.data.code === 200) {
              this.$message.success('提交成功')
            }
            else{
              this.$message.error('提交成功')
            }

          })
          .catch((error) => {
            // 请求错误处理
            console.log(error);
          });

    },

  },
  mounted() {
  }
};
</script>

<style scoped>

</style>
