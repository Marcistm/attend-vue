<template>
  <el-container>

      <el-aside width="200px" >
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
          <h3>学生出勤管理系统</h3>
        <el-menu-item  v-for="i in table" :key="i.id" :lable="i.name" @click="change(i.name)">
          {{i.name}}
        </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <Index v-if="name==='首页'||name===''"></Index>
        <DataTable v-if="['用户管理','通知管理','公告管理','离校申请','返校申请','班级管理','考勤管理'].includes(name)" :name="name"></DataTable>
        <HealthRecord v-if="name==='健康档案'"></HealthRecord>
        <HealthDeclaration v-if="name==='每日健康申报'"></HealthDeclaration>
        <AskForLeave v-if="'请假'===name"></AskForLeave>
        <attend-statistics v-if="name==='考勤统计'"></attend-statistics>
        <student-attend v-if="name==='上课签到'"></student-attend>
      </el-main>

  </el-container>
</template>

<script>
import DataTable from "@/components/DataTable";
import Index from "@/components/Index";
import Attend from "@/components/Attend";
import HealthRecord from "@/components/HealthRecord";
import HealthDeclaration from "@/components/HealthDeclaration";
import AskForLeave from "@/components/AskForLeave";
import {getUserName} from "@/utils/auth";
import axios from "axios";
import AttendStatistics from "@/components/AttendStatistics";
import AttendBoard from "@/components/AttendBoard";
import StudentAttend from "@/components/StudentAttend";

export default {
  name: "Home",
  components: {
    StudentAttend,
    AttendBoard, AttendStatistics, AskForLeave, HealthRecord, Attend, DataTable,Index,HealthDeclaration},
  data(){
    return{
      table:[],
      name:''
    }
  },methods:{
    change(name){
     this.name=name
    },
    getInfo(){
     let username=getUserName()
      let path='http://43.143.116.236:5001/student/info/get'
      let parmas={
       username:username
      }
      axios.get(path,{params:parmas}).then(res=>{
        this.$store.state.stu_info=res.data.data[0]
        if (this.$store.state.stu_info.tag==false){
          this.$message.info('今日健康申报未填写')
        }
      })

    },
  },
  mounted() {
    let role=localStorage.getItem('permission')
    this.table=this.$store.state.filter({role:role},this.$store.state.table)[0].item
    if (role==='0'){
      this.getInfo()
    }
  }
}

</script>

<style scoped>

.el-menu {
  height: 100%;
  border: none;}

h3 {
  color: #ffffff;
  text-align: center;
  line-height: 48px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;}

</style>
