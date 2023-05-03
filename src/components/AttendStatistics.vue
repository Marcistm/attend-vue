<template>
<div>
  <el-form :inline="true">
    <el-form-item label="课程" >
      <el-select v-model="course">
        <el-option v-for="i in courses" :label="i.result" :key="i.result" :value="i.result"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">查询</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {getUser} from "@/utils/auth";
import axios from "axios";

export default {
  name: "AttendStatistics",
  data(){
    return{
      course:'',
      courses:[],
      class:''
    }
  },
  methods:{
    getCourse(){
      let path='http://127.0.0.1:5001/course/get'
      let params={
        teacher:getUser()
      }
      axios.get(path,{params:params}).then(res=>{
        this.courses=res.data.data
      })
    }
  },
  mounted() {
    this.getCourse()
  }
}
</script>

<style scoped>

</style>
