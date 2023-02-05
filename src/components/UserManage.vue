<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary">导入用户</el-button>
      </el-form-item>
    </el-form>
    <el-table>
      <el-table-column></el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  name: "UserManage",
  data(){
    return{
      data:[]
    }
  },
  props:{
    name:String
  },
  mounted() {
    let name=this.name
    this.$store.dispatch('getData',{name})
    this.data=this.$store.state.data
    console.log(this.$store.state.data)
  }
}
</script>

<style scoped>

</style>
