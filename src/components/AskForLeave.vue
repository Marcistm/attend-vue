<template>

  <el-form  >
    <el-form-item label="学号">
      {{username}}
    </el-form-item>
    <el-form-item label="姓名">
      {{name}}
    </el-form-item>
    <el-form-item label="理由">
      <el-input autosize></el-input>
    </el-form-item>
    <el-form-item label="请假日期">
      <el-date-picker
          v-model="daterange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="附件">
      <el-upload
          ref="upload"
          :auto-upload="false"
          multiple
          :file-list="fileList"
          @file-click="previewFile"
          :on-preview="handlePreview"
      >
        <el-button>上传</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "AskForLeave",
  data(){
    return{
      daterange:'',
      username:'',
      name:'',
      fileList:[]
    }
  },
  methods:{
    submit(){
      console.log(1)
    },
    handlePreview(file) {
      if (!file.url) {
        this.$message.error('下载失败')
        return
      }
      const type = file.url.split('.')[4]
      // 判断文件类型
      if (type === 'doc' || type === 'docx' || type === 'xlsx' || type === 'xls' || type === 'ppt' || type === 'pptx') {
        // 在当前浏览器直接下载
        document.location.href = file.url
      } else {
        // 图片在浏览器打开 新的页面展示
        window.open(file.url, 'hello')
      }
    },
    previewFile(file) {
      const url = URL.createObjectURL(file.raw);
      window.open(url);
    },
  },
  mounted() {
    this.username=localStorage.getItem('username')
    this.name=localStorage.getItem('name')
  }
}
</script>

<style scoped>

</style>
