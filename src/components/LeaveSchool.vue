<template>
<div>
  <el-table :show-header="false" :data="data">
    <el-table-column prop="item1"></el-table-column>
    <el-table-column >
      <template slot-scope="scope">
        <el-input v-if="scope.$index!==0" v-model="scope.row.item2"></el-input>
        <span v-else>{{scope.row.item2}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="item3"></el-table-column>
    <el-table-column prop="item4"></el-table-column>
    <el-table-column prop="item5"></el-table-column>
    <el-table-column prop="item6"></el-table-column>
  </el-table>
</div>
</template>

<script>
import {getUserName} from "@/utils/auth";

export default {
  name: "LeaveSchool",
  data(){
    return{
      data:[
          {item1:'姓名',item2:'11',item3:'性别',item4:'',item5:'班级',item6:''},
        {item1:'身份证号',item2:'',item5:'联系电话',item6:''},
        {item1:'监护人姓名',item2:'',item3:'',item4:'监护人电话',item5:'',item6:''},
        {item1:'去向地址',item2:'',item3:'',item4:'',item5:'',item6:''},
        {item1:'离校时间',item2:'',item3:'',item4:'返校时间',item5:'',item6:''},
        {item1:'离校原因',item2:''},
        {item1:'离校方式',item2:'',item3:'',item4:'车次航班',item5:'',item6:''},
      ]
    }
  },
  mounted() {
    this.data[0].item2=getUserName()
    console.log(this.data)
  }
}
</script>

<style scoped>

</style>
