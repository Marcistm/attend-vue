<template>
  <div>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="dialog=true">新增</el-button>
      </el-form-item>
    </el-form>
<el-table :data="data">
<el-table-column  :key="i.name" v-for="i in columns" :label="i.label" :prop="i.name" >
</el-table-column>
  <el-table-column label="操作">
    <el-button>查看详情</el-button>
    <el-button>删除</el-button>
  </el-table-column>
</el-table>
    <el-dialog :title="name" :visible.sync="dialog">
      <AskForLeave v-if="name==='请假'"></AskForLeave>
    </el-dialog>
  </div>
</template>

<script>
import AskForLeave from "@/components/AskForLeave";

export default {
  name: "DataTable",
  components: {AskForLeave},
  data(){
    return{
      dialog:false,
      columns:[],
      data:[{time:'1',condition:'1'}]
    }
  },
  props:{
    name:String
  },
  mounted() {

    let name=this.name
    this.$store.dispatch('getData',{name})
  }
}
</script>

<style scoped>

</style>
