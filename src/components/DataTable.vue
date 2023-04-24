<template>
  <div>

    <el-form>
      <el-form-item>
        <el-button type="primary" @click="$store.state.dialog=true">新增</el-button>
        <el-button v-if="['用户管理'].includes(name)" type="primary" @click="upload=true">批量导入</el-button>
      </el-form-item>
    </el-form>
<el-table :data="data">
  <el-table-column v-if="i.show" :key="i.name" v-for="i in columns" :label="i.label" :prop="i.name"></el-table-column>
  <el-table-column label="操作">
    <template slot-scope="scope">
    <el-button v-if="name=='用户管理'" @click="reset_password(scope.row.username)">密码重置</el-button>
    <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
      <el-button type="success" @click="see(scope.row.id)">查看详情</el-button>
    </template>
  </el-table-column>
</el-table>
    <el-dialog :title="name" :visible.sync="$store.state.dialog">
      <AskForLeave v-if="name==='请假'"></AskForLeave>
      <notice v-if="name==='通知管理'"></notice>
      <leave-school v-if="name==='离校申请'" :see_data="see_data" :id="id" @search="getData"></leave-school>
      <return-school v-if="name==='返校申请'" :see_data="see_data" :id="id" @search="getData"></return-school>
    </el-dialog>
    <el-dialog :visible.sync="upload">
      <el-form :inline="true">
        <el-form-item label="类型">
          <el-select v-model="model" placeholder="请选择">
            <el-option label="学生" value="学生"></el-option>
            <el-option label="老师" value="老师"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="model!==''"><el-button type="primary" @click="download">下载模板</el-button></el-form-item>
        <el-form-item>
          <el-upload action="">
            <el-button type="primary" @click="upload_data">导入</el-button>
          </el-upload>
        </el-form-item>

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
function containsField(dictArray, fieldName) {
  return dictArray.some(function(dict) {
    return fieldName in dict;
  });
}
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours() + 16).padStart(2, "0"); // add 8 hours for Shanghai time
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
import axios from "axios";
import Notice from "@/components/Notice";
import LeaveSchool from "@/components/LeaveSchool";
import ReturnSchool from "@/components/ReturnSchool";
export default {
  name: "DataTable",
  components: {ReturnSchool, LeaveSchool, Notice, AskForLeave},
  data() {
    return {
      model:'',
      data:[],
      table:'',
      upload: false,
      columns: [],
      tableData: [],
      see_data:[],
      id:''
    }
  },
  props: {
    name: String
  },
  watch: {
    name: function(newValue, oldValue) {
      this.getData();
    }
  },
  mounted() {
    this.getData()
  },
  methods: {

    getData:function (){
      let t=this.$store.state.filter({name: this.name}, this.$store.state.tableData)[0]
      this.columns = t.column
      this.table=t.table
      let sql = 'select a.'
      sql = sql + this.columns.map(function (t) { return t.name; }).join(',a.');
      sql = sql + ' from ' + this.table + ' a'
      let path='http://127.0.0.1:5001/get/data'
      axios.get(path, { params: { sql: sql } }).then(res => {
        this.data=res.data.data
        if (containsField(this.data,'condition')){
          this.data.forEach(item=>{
            if (item['condition']===0){
              item['condition']='审核中'
            }
          })
        }
            if (containsField(this.data,'time')){
              this.data.forEach(item=>{
                item['time']=formatTime(item['time'])
              })
            }
        if (this.name==='用户管理'){
          this.data = this.data.filter(data => data.username !== 'admin')
          this.data.forEach(item=>{
            if (item['privilege']===0){
              item['privilege']='学生'
            }
            if (item['privilege']===1){
              item['privilege']='老师'
            }
          })
        }
        if (this.name==='离校申请'){
          this.data=this.$store.state.filter({type:'离校申请'},this.data)
        }
      })

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
    see(id){
      let path = 'http://127.0.0.1:5001/see'
      let params = {id: id}
      axios.get(path,{params:params}).then(res=>{
        if (res.data.data.length){
          this.see_data=res.data.data
          this.id=id
          this.$store.state.dialog = true
        }
      })
    },
    del(id) {
      this.$confirm('确定要删除该项吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let path = 'http://127.0.0.1:5001/delete'
        let params = {id: id, table: this.table}
        axios.get(path, {params: params}).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功',
              showClose: true
            })
            this.getData()
          }
        })
      }).catch(() => {
        // 用户取消删除操作
      })
    },

  }
}
</script>

<style scoped>

</style>
