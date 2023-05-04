<template>
<el-table>
  <el-table-column label="发起人"></el-table-column>
  <el-table-column label="发起时间"></el-table-column>
  <el-table-column label="类型"></el-table-column>
  <el-table-column label="操作">
    <template slot-scope="scope">
      <el-button>批准</el-button>
      <el-button>打回</el-button>
      <el-button>查看详情</el-button>
    </template>
  </el-table-column>
</el-table>
</template>

<script>
export default {
  name: "ApplyExamine"
}
</script>

<style scoped>

</style>
