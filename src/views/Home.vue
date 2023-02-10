<template>
  <el-container>

      <el-aside width="200px" >
        <el-menu>
        <el-menu-item  v-for="i in table" :key="i.id" :lable="i.name" @click="change(i.name)">
          {{i.name}}
        </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <Index v-if="name==='首页'||name===''"></Index>
        <DataTable v-if="['请假'].includes(name)" :name="name"></DataTable>
        <StudentManage v-if="name==='学生用户管理'" :name="name"></StudentManage>
        <TeacherManage v-if="name==='教师用户管理'" :name="name"></TeacherManage>
        <Board v-if="name==='公告管理'" :name="name"></Board>
      </el-main>

  </el-container>
</template>

<script>
import DataTable from "@/components/DataTable";
import Board from "@/components/Board";
import StudentManage from "@/components/StudentManage";
import TeacherManage from "@/components/TeacherManage";
import Index from "@/components/Index";

export default {
  name: "Home",
  components: {TeacherManage, StudentManage, Board, DataTable,Index},
  data(){
    return{
      table:[],
      name:''
    }
  },methods:{
    change(name){
     this.name=name
    }
  },
  mounted() {
    let role=localStorage.getItem('permission')
    this.table=this.$store.state.filter({role:role},this.$store.state.table)[0].item
  }
}

</script>

<style scoped>

</style>
