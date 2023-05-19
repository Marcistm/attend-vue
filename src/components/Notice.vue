<template>
<el-form style="width:60%" :model="form">
  <el-form-item  label="课程">
    <span v-if="!tag">{{form.course}}</span>
    <el-select v-if="tag&role===1" v-model="form.course">
      <el-option v-for="i in course" :label="i.course" :value="i.course" :key="i.course"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="通知内容">
    <span v-if="!tag">{{form.text}}</span>
    <el-input v-else autosize v-model="form.text"></el-input>
  </el-form-item>
  <el-form-item>
    <file-upload ref="notice_files" type="通知" :original_id="id" :disabled="tag"></file-upload>
  </el-form-item>
  <el-form-item v-if="!tag">
    <el-button type="primary" @click="submit">提交</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import FileUpload from "@/components/FileUpload";
import axios from "axios";
import {getUser, getUserName} from "@/utils/auth";
export default {
  name: "Notice",
  components: {FileUpload},
  props:{
    id:Number,
    see_data:Array
  },
  watch: {
    see_data: {
      handler: function(newVal) {
        this.form=newVal[0]
      },
      deep: true
    }
  },
  data(){
    return{
      course:[],
      tag:true,
      role:'',
      form:{
        class:'',
        text:'',
        author:getUserName(),
      }
    }
  },methods:{
    get_course(){
      let path='http://43.143.116.236:5001/course/get'
      let parmas={
        teacher:getUser()
      }
      axios.get(path,{params:parmas}).then(res=>{
        this.course=res.data.data
        console.log(this.course)
      })
    },
    submit(){
      let path='http://43.143.116.236:5001/notice/submit'
      const formData = new FormData();
      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }
      this.$refs.notice_files.fileList.forEach(file => {
        formData.append(`notice_file`, file.raw)
      })
      axios.post(path,formData).then(res=>{
        if (res.data.code===200){
          this.$message.success('操作成功')
          this.$store.state.dialog=false
          this.$emit('search');
        }
      })
    }
  },
  mounted() {
    this.role=localStorage.getItem('permission')
    if (this.see_data.length){
      this.tag=false
      this.form=this.see_data[0]
      console.log(this.form)
    }else {
      this.get_course()
    }
  }
}
</script>

<style scoped>

</style>
