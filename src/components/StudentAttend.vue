<template>
<div>
  <div v-if="!tag" >
    <div >暂无上课签到</div>
  </div>
  <el-form v-else  label-width="150px" style="width: 50%">
    <el-form-item label="签到码">
      <el-input v-model="code"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="attend">签到</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import axios from "axios";
import {getUser} from "@/utils/auth";

export default {
  name: "StudentAttend",
  data(){
    return{
    tag:false,
      code:''
    }
  },
  methods:{
    get_tag(){
      let path='http://127.0.0.1:5001/attend/get'
      let parmas={
        username:getUser()
      }
      axios.get(path,{params:parmas}).then(res=>{
        this.tag=res.data.tag
        console.log(res)
      })
    },
    attend(){
      let path='http://127.0.0.1:5001/attend/check'
      let parmas={
        code:this.code,
        username:getUser()
      }
      axios.get(path,{params:parmas}).then(res=>{
        if (res.data.tag){
          this.$message.success('签到成功')
          this.tag=false
        }
        else {
          this.$message.error('签到失败')
        }
      })
    }
  },
  mounted() {
    this.get_tag()
  }
}
</script>

<style scoped>

</style>
