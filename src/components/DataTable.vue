<template>
  <div>
    {{Data}}
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="dialog=true">新增</el-button>
        <el-button v-if="!['通知管理','公告管理'].includes(name)" type="primary" @click="upload=true">批量导入</el-button>

      </el-form-item>
    </el-form>
<el-table :data="$store.state.data">
<el-table-column  :key="i.name" v-for="i in columns" :label="i.label" :prop="i.name" >
</el-table-column>
  <el-table-column label="操作">
    <template slot-scope="scope">
    <el-button @click="reset_password(scope.row.username)">密码重置</el-button>
    <el-button>查看详情</el-button>
    <el-button type="danger" @click="delete_user(scope.row.username)">删除</el-button>
    </template>
  </el-table-column>
</el-table>
    <el-dialog :title="name" :visible.sync="dialog">
      <AskForLeave v-if="name==='请假'"></AskForLeave>

    </el-dialog>
    <el-dialog :visible.sync="upload">
      <el-form :inline="true">
        <el-form-item><el-button type="primary" @click="download">下载模板</el-button></el-form-item>
        <el-form-item><el-button type="primary" @click="upload_data">导入</el-button></el-form-item>
        <el-form-item><input type="file" ref="fileInput" @change="handleFileChange"></el-form-item>
      </el-form>
      <el-table :data="tableData" v-if="tableData.length>0">
        <el-table-column  :key="i.name" v-for="i in columns" :label="i.label" :prop="i.name" >
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import AskForLeave from "@/components/AskForLeave";
import * as XLSX from "xlsx";
const Excel = require('exceljs');
import axios from "axios";
export default {
  name: "DataTable",
  components: {AskForLeave},
  data() {
    return {
      table:'',
      upload: false,
      dialog: false,
      columns: [],
      tableData: [],
    }
  },
  props: {
    name: String
  },
  mounted() {
    this.getData()
  },
  computed:{
    Data(){
      return this.getData()
    }
  },
  methods: {
    getData(){
      let t=this.$store.state.filter({name: this.name}, this.$store.state.tableData)[0]
      this.columns = t.column
      this.table=t.table
      console.log(t.table)
      let name = this.name
      this.$store.dispatch('getData', {name})
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = event.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
        this.tableData = sheetData
      }
      reader.readAsBinaryString(file)
    },
    download(){

      let workbook = new Excel.Workbook();
      workbook.created = new Date();
      workbook.modified = new Date();
      let worksheet = workbook.addWorksheet('Sheet1');
      let cols=[]
      this.columns.forEach(item=>{
        cols.push({header:item.name})
      })
      worksheet.columns=cols
      workbook.xlsx.writeBuffer().then((buffer) => {
        let blob = new Blob([buffer], { type: 'application/octet-stream' })
        const downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = this.name+'导入模板.xlsx'
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
      });
    },
    upload_data(){
      if (this.tableData.length === 0) {
        this.$message.warning("没有数据")
        console.log("warning")
        return
      }
      let path='http://43.143.116.236:5001/upload/data'
      let params={
        data:this.tableData,
        table:this.table
      }
      axios.post(path, params).then(res=>{
        if (res.data.code===200){
          this.$message({
            type: "success",
            message: '上传成功',
            showClose: true
          })
        }
        if (res.data.code===404){
          this.$message({
            type: "error",
            message: '上传失败',
            showClose: true
          })
        }
        this.upload=false
        let name = this.name
        this.$store.dispatch('getData', {name})
      })
    },
    reset_password(username){
      let path='http://43.143.116.236:5001/password/reset'
      let parmas={username:username}
      axios.get(path,{params:parmas}).then(res=>{
        if (res.data.code===200){
          this.$message({
            type: "success",
            message: '重置成功',
            showClose: true
          })
        }
        if (res.data.code===404){
          this.$message({
            type: "error",
            message: '重置失败',
            showClose: true
          })
        }
      })
    },
    delete_user(username){
      let path='http://43.143.116.236:5001/user/delete'
      let parmas={username:username,table:this.table}
      axios.get(path,{params:parmas}).then(res=>{
        if (res.data.code===200){
          this.$message({
            type: "success",
            message: '删除成功',
            showClose: true
          })
        }
        if (res.data.code===404){
          this.$message({
            type: "error",
            message: '删除失败',
            showClose: true
          })
        }
      })
      let name = this.name
      this.$store.dispatch('getData', {name})
    }
  }
}
</script>

<style scoped>

</style>
