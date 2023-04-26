<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary">导入学生</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="$store.state.data">
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="身份">
        <template slot-scope="scope">
          <span v-if="scope.row.privilege===2">管理员</span>
          <span v-if="scope.row.privilege===1">教师</span>
          <span v-if="scope.row.privilege===0">学生</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button @click="reset_password(scope.row.username)">密码重置</el-button>
        <el-button>删除</el-button>
          </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "UserManage",
  data(){
    return{

    }
  },
  props:{
    name:String
  },
  mounted() {
    let name=this.name
    this.$store.dispatch('getData',{name})
  },
  methods:{
    reset_password(username){
      let path='http://43.143.116.236:5001/password/reset'
      axios.get(path, { params: { username: username } }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
