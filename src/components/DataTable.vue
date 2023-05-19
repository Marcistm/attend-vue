<template>
  <div>
    <el-form>
      <el-form-item>
        <el-button v-if="!['用户管理'].includes(name)" type="primary" @click="$store.state.dialog=true">新增</el-button>
        <el-button v-if="'用户管理'===name" type="primary" @click="$store.state.dialog=true">批量导入</el-button>
      </el-form-item>
    </el-form>
<el-table :data="data">
  <el-table-column v-if="i.show" :key="i.name" v-for="i in columns" :label="i.label" :prop="i.name"></el-table-column>
  <el-table-column label="操作">
    <template slot-scope="scope">
    <el-button v-if="name=='用户管理'" type="primary" @click="reset_password(scope.row.username)">密码重置</el-button>
    <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
      <el-button v-if="!['用户管理','考勤管理'].includes(name)" type="success" @click="see(scope.row.id,table)">查看详情</el-button>
      <el-button v-if="name==='考勤管理'" type="primary" @click="attend(scope.row.class,scope.row.course)">发起考勤</el-button>
    </template>
  </el-table-column>
</el-table>
    <el-dialog :title="name" :visible.sync="$store.state.dialog">
      <board v-if="name==='公告管理'" :see_data="see_data" :id="id" @search="getData"></board>
      <AskForLeave v-if="name==='请假'" :see_data="see_data" :id="id" @search="getData"></AskForLeave>
      <notice v-if="['通知管理','我的通知'].includes(name)" :see_data="see_data" :id="id" @search="getData"></notice>
      <leave-school v-if="name==='离校申请'" :see_data="see_data"  @search="getData"></leave-school>
      <return-school v-if="name==='返校申请'" :see_data="see_data"  @search="getData"></return-school>
      <user-manage v-if="name==='用户管理'" @search="getData"></user-manage>
      <class-manage v-if="name==='班级管理'" @search="getData" :see_data="see_data" :id="id"></class-manage>
      <attend-board v-if="name==='考勤管理'" @search="getData"></attend-board>
    </el-dialog>
    <el-dialog :visible.sync="attend_tag">
      <attend :class_name="this.class" :course="course"></attend>
    </el-dialog>
  </div>
</template>

<script>
import AskForLeave from "@/components/AskForLeave";
function containsField(dictArray, fieldName) {
  return dictArray.some(function(dict) {
    return fieldName in dict;
  });
}

import axios from "axios";
import Notice from "@/components/Notice";
import LeaveSchool from "@/components/LeaveSchool";
import ReturnSchool from "@/components/ReturnSchool";
import UserManage from "@/components/UserManage";
import Board from "@/components/Board";
import ClassManage from "@/components/ClassManage";
import AttendBoard from "@/components/AttendBoard";
import Excel from "exceljs";
import Attend from "@/components/Attend";
export default {
  name: "DataTable",
  components: {Attend, AttendBoard, ClassManage, Board, UserManage, ReturnSchool, LeaveSchool, Notice, AskForLeave},
  data() {
    return {
      attend_tag:false,
      model:'',
      data:[],
      table:'',
      upload: false,
      columns: [],
      tableData: [],
      see_data:[],
      id:'',
      class:'',
      course:''
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
    attend(class_name,course){
      this.class=class_name
      this.course=course
      this.attend_tag=true
    },
    getData:function (){
      let t=this.$store.state.filter({name: this.name}, this.$store.state.tableData)[0]
      this.columns = t.column
      this.table=t.table
      let sql = 'select a.'
      sql = sql + this.columns.map(function (t) { return t.name; }).join(',a.');
      sql = sql + ' from ' + this.table + ' a'
      let path='http://43.143.116.236:5001/get/data'
      axios.get(path, { params: { sql: sql } }).then(res => {
        this.data=res.data.data
        console.log(this.data)
        if (containsField(this.data,'condition')){
          this.data.forEach(item=>{
            if (item['condition']===0){
              item['condition']='审核中'
            }
            if (item['condition']===1){
              item['condition']='已通过'
            }
            if (item['condition']===-1){
              item['condition']='已打回'
            }
          })
        }
            if (containsField(this.data,'time')){
              this.data.forEach(item=>{
                item['time']=this.$store.state.formatTime(item['time'])
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
        if (this.name==='返校申请'){
          this.data=this.$store.state.filter({type:'返校申请'},this.data)
        }

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
    see(id,table){
      let path = 'http://43.143.116.236:5001/see'
      let params = {id: id,table:table}
      axios.get(path,{params:params}).then(res=>{
        if (res.data.data.length){
          this.see_data=res.data.data
          console.log(this.see_data)
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
        let path = 'http://43.143.116.236:5001/delete'
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
