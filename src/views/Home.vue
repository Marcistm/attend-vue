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
        <DataTable v-if="['学生用户管理','教师用户管理','通知管理','公告管理','审批项目管理','离校申请','返校申请'].includes(name)" :name="name"></DataTable>
        <Attend v-if="name==='发起考勤'"></Attend>
        <HealthRecord v-if="name==='健康档案'"></HealthRecord>
        <HealthDeclaration v-if="name==='每日健康申报'"></HealthDeclaration>
        <AskForLeave v-if="'请假'===name"></AskForLeave>
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

export default {
  name: "Home",
  components: {AskForLeave, HealthRecord, Attend, DataTable,Index,HealthDeclaration},
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
