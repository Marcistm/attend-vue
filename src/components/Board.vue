<template>
  <el-form style="width:60%" :model="form">
    <el-form-item  label="标题">
      <el-input v-if="tag" v-model="form.title"></el-input>
      <span v-else>{{form.title}}</span>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-if="tag" autosize v-model="form.text"></el-input>
      <span v-else>{{form.text}}</span>
    </el-form-item>
    <el-form-item>
      <file-upload ref="board_files" type="公告" :original_id="id" :disabled="tag"></file-upload>
    </el-form-item>
    <el-form-item v-show="tag">
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
import FileUpload from "@/components/FileUpload";
import {getUserName} from "@/utils/auth";
export default {
  name: "Board",
  components: {FileUpload},
  props:{
    id:String,
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
      form:{
        title:'',
        text:'',
        author:getUserName()
      },
      tag:true,
    }
  },
  methods:{
    submit(){
      let path='http://43.143.116.236:5001/board/submit'
      const formData = new FormData();
      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }
      this.$refs.board_files.fileList.forEach(file => {
        formData.append(`board_file`, file.raw)
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
    if (this.see_data.length){
      this.tag=false
      this.form=this.see_data[0]
    }
  }
}
</script>

<style scoped>

</style>
