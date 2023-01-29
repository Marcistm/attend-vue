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
import axios from "axios";
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
    let t=this.$store.state.filter({name:this.name},this.$store.state.tableData)
    this.columns=t[0].column
    let path='http://127.0.0.1:5000/get/data'
    let sql='select a.'
    sql=sql+t[0].column.map(function (t){return t.name;}).join(',a.');
    sql=sql+' from '+t[0].table+' a'
    axios.get(path,{params:{sql:sql}}).then(res=>{
      console.log(res)
    })
  }
}
</script>

<style scoped>

</style>
