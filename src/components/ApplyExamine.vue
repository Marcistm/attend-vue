<template>
  <div>
    <el-table :data="data">
      <el-table-column label="发起人" prop="username"></el-table-column>
      <el-table-column label="发起时间" prop="time"></el-table-column>
      <el-table-column label="类型" prop="type"></el-table-column>
      <el-table-column label="状态" prop="condition">
        <template slot-scope="scope">
          <span v-if="scope.row.condition===0">审核中</span>
          <span v-if="scope.row.condition===1">已通过</span>
          <span v-if="scope.row.condition===-1">已打回</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.condition===0" @click="approval(scope.row.id,scope.row.type,'1')">批准</el-button>
          <el-button v-if="scope.row.condition===0" @click="approval(scope.row.id,scope.row.type,'-1')">打回</el-button>
          <el-button @click="see(scope.row.type,scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="name" :visible.sync="$store.state.dialog">
      <AskForLeave v-if="name==='请假'"></AskForLeave>
      <leave-school v-if="name==='离校申请'" :see_data="see_data" :id="id" ></leave-school>
      <return-school v-if="name==='返校申请'" :see_data="see_data" :id="id" ></return-school>
    </el-dialog>
  </div>
</template>

<script>

import ReturnSchool from "@/components/ReturnSchool";
import LeaveSchool from "@/components/LeaveSchool";
import AskForLeave from "@/components/AskForLeave";
import {getUser, getUserName} from "@/utils/auth";
import axios from "axios";

export default {
  name: "ApplyExamine",
  components: { ReturnSchool, LeaveSchool,  AskForLeave},
  data(){
    return{
      data:[],
      name:'',
      see_data:[],
      id:'',
    }
  },
  methods:{
    see(type,id){
      this.name=type
      let path = 'http://43.143.116.236:5001/see'
      let table=''
      if (this.name==='请假'){
        table='ask_for_leave'
      }else{
        table='process'
      }
      let params = {id: id,table:table}
      axios.get(path,{params:params}).then(res=>{
        if (res.data.data.length){
          this.see_data=res.data.data
          this.id=id
          this.$store.state.dialog = true
        }
      })
    },
    approval(id,type,condition){
      let path='http://43.143.116.236:5001/process/approval'
      let parmas={
        id:id,
        type:type,
        condition:condition
      }
      axios.get(path,{params:parmas}).then(res=>{
        this.$message.success('审批成功')
      })

    },
    get_process(){
      let path='http://43.143.116.236:5001/process/get'
      let parmas={
        name:getUserName()
      }
      axios.get(path,{params:parmas}).then(res=>{
        this.data=res.data.data
      })
    }
  },
  mounted() {
    this.get_process()
  }
}
</script>

<style scoped>

</style>
