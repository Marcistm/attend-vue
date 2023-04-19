<template>
<el-form>
  <el-form-item  label="班级">
    <el-select>
    </el-select>
  </el-form-item>
  <el-form-item label="通知内容">
    <el-input autosize v-model="text"></el-input>
  </el-form-item>
  <el-form-item>
    <file-upload ref="notice_files" type="通知" :original_id="id" :disabled="tag"></file-upload>
  </el-form-item>
  <el-form-item>
    <el-button @click="submit">提交</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import FileUpload from "@/components/FileUpload";
export default {
  name: "Notice",
  components: {FileUpload},
  data(){
    return{
      id:'',
      tag:false,
      text:''
    }
  }
}
</script>

<style scoped>

</style>
