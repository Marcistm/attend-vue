<template>
<el-form style="width:60%" :model="form">
  <el-form-item v-if="this.role==='1'" label="课程">
    <el-select  v-model="form.course">
    </el-select>
  </el-form-item>
  <el-form-item label="通知内容">
    <el-input autosize v-model="form.text"></el-input>
  </el-form-item>
  <el-form-item>
    <file-upload ref="notice_files" type="通知" :original_id="id" :disabled="tag"></file-upload>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submit">提交</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import FileUpload from "@/components/FileUpload";
import axios from "axios";
import {getUserName} from "@/utils/auth";
export default {
  name: "Notice",
  components: {FileUpload},
  props:{
    id:String,
    see_data:Array
  },
  data(){
    return{
      tag:true,
      role:'',
      form:{
        class:'',
        text:'',
        author:getUserName(),
      }
    }
  },methods:{
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
      this.form=this.see_data[0]
    }
  }
}
</script>

<style scoped>

</style>
