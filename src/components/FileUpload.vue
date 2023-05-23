<template>
<el-upload
    :auto-upload="false"
    multiple
    :action="'http://43.143.116.236:5001/upload'"
    :file-list="fileList"
    :on-preview="previewFile"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :disabled="!disabled"
    show-file-list>
  <el-button type="primary">{{text}}</el-button>
</el-upload>
</template>
<script>
import axios from "axios";

export default {
  name: "FileUpload",
  props:{
    original_id:String,
    type:String,
    disabled:Boolean
  },
  data(){
    return{
      text:'',
      fileList:[],
      file_path:''
    }
  },
  watch: {
    disabled: {
      handler: function(newVal) {
        if (newVal===false){
          this.text='文件列表'
        }else {
          this.text='选取附件'
        }
      },
      deep: true
    },
  },
  methods:{
    handleRemove(file, fileList) {
      this.fileList=fileList
    },
    handleChange(file, fileList) {
      this.fileList=fileList
    },
    get_old_file(){
      let params={
        original_id:this.original_id,
        type:this.type
      }
      let path='http://43.143.116.236:5001/old_file/get'
      axios.get(path,{params:params}).then(res=>{
       res.data.data.forEach(item=>{
         let fileObj = {
           uid: Math.random(),
           name: item['file_name'],
           url: item['file_url']
         }
         this.fileList.push(fileObj)
       })
      })
    },
    previewFile(file) {
      let downloadElement = document.createElement('a');
      downloadElement.href = file.url;
      downloadElement.download = file.name;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
    },
  },
  mounted() {
    if (this.disabled===false){
      this.text='文件列表'
    }else {
      this.text='选取附件'
    }
    this.get_old_file()
  }
}
</script>

<style scoped>

</style>
