<template>
  <div>
  <el-form :inline="true">
    <el-form-item><el-button type="primary" @click="download">下载模板</el-button></el-form-item>
    <el-form-item>
      <el-upload
          action="http://43.143.116.236:5001/upload/data"
          :show-file-list="false"
          :on-success="handleSuccess"
          :before-upload="beforeUpload">
        <el-button type="primary" >导入</el-button>
      </el-upload>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
import Excel from "exceljs";

export default {
  name: "UserManage",
  data() {
    return{

    }
  },methods:{
    beforeUpload (file) {
      const isExcel = file.type === 'application/vnd.ms-excel' ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isExcel) {
        this.$message.error('只能上传Excel文件')
      }
      return isExcel
    },

    handleSuccess (response) {
      this.$message.success('上传成功')
      this.$store.state.dialog=false
      this.$emit('search');
    },
    download(){
      let workbook = new Excel.Workbook();
      workbook.created = new Date();
      workbook.modified = new Date();
      let worksheet = workbook.addWorksheet('Sheet1');
      worksheet.columns=[
        {header:'用户名'},
        {header:'姓名'},
        {header:'身份'}
      ]
      workbook.xlsx.writeBuffer().then((buffer) => {
        let blob = new Blob([buffer], { type: 'application/octet-stream' })
        const downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = '导入模板.xlsx'
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
      });
    },
  }
}
</script>

<style scoped>

</style>
