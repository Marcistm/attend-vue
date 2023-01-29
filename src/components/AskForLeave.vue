<template>

  <el-form :inline="true" >
    <el-form-item label="学号"></el-form-item>
    <el-form-item label="姓名"></el-form-item>
    <el-form-item label="理由">
      <el-input autosize></el-input>
    </el-form-item>
    <el-form-item>
      <el-date-picker
          v-model="daterange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="success">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "AskForLeave",
  data(){
    return{
      daterange:''
    }
  }
}
</script>

<style scoped>

</style>
