<template>
<el-upload
    ref="upload"
    :auto-upload="false"
    multiple
    :action="'http://43.143.116.236:5001/ask_for_leave/add'"
    :file-list="fileList"
    :on-preview="previewFile"
    :on-change="handleChange"
    :on-remove="handleRemove"
    show-file-list>
  <el-button type="primary">选取</el-button>
</el-upload>
</template>

<script>
export default {
  name: "Upload",
  props:{

  },
  data(){
    return{
      fileList:[],
    }
  },methods:{
    handleRemove(file, fileList) {
      this.fileList=fileList
    },
    handleChange(file, fileList) {
      this.fileList=fileList
    },
    previewFile(file) {
      console.log(file)
      console.log(file.name);
      let downloadElement = document.createElement('a');
      downloadElement.href = file.url;
      downloadElement.download = file.name;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
    },
  }
}
</script>

<style scoped>

</style>
