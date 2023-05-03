<template>
<div>
    <el-form :model="form" style="width: 60%">
      <el-form-item label="课程名称">
        <el-input v-model="form.course"></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="form.class">
          <el-option v-for="i in this.class" :label="i.class" :value="i.class" :key="i.class"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
</div>
</template>

<script>
import axios from "axios";
import {getUser} from "@/utils/auth";

export default {
  name: "AttendBoard",
  data() {
    return{
      tag:false,
      form:{
        course:'',
        class:'',
        teacher:getUser()
      },
      class:[]
    }
  },methods:{
    add(){
      this.tag=true
      this.getClass()
    },
    getClass(){
      let path='http://127.0.0.1:5001/class/get'
      axios.get(path).then(res=>{
        this.class=res.data.data
      })
    },
    submit(){
      let path='http://127.0.0.1:5001/attend/submit'
      axios.post(path,this.form).then(res=>{
        if (res.data.code===200){
          this.$store.state.dialog=false
          this.$message.success('操作成功')
          this.$emit('search')
        }
      })
    },

  },
  mounted() {
    this.getClass()
  }
}
</script>

<style scoped>

</style>
