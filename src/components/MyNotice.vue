<template>
  <div>
    <el-table :data="data">
      <el-table-column label="课程" prop="course"></el-table-column>
      <el-table-column label="内容" prop="text"></el-table-column>
      <el-table-column label="发起人" prop="author"></el-table-column>
      <el-table-column label="时间" prop="time"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="success" @click="see(scope.row.id,'notice')">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="tag" >
      <notice v-if="tag" :see_data="see_data" :id="id" ></notice>
    </el-dialog>
  </div>

</template>

<script>

import axios from "axios";
import {getUser, getUserName} from "@/utils/auth";
import Notice from "@/components/Notice";
export default {
  name: "MyNotice",
  components: {
    Notice
  },
  data() {
    return{
      see_data:[],
      id:'',
      data:[],
      tag:false
    }
  },
  methods:{
    see(id,table){
      let path = 'http://43.143.116.236:5001/see'
      let params = {id: id,table:table}
      axios.get(path,{params:params}).then(res=>{
        if (res.data.data.length){
          this.see_data=res.data.data
          this.id=id.toString()
          this.tag = true
        }
      })
    },
    get_notice(){
      let path='http://43.143.116.236:5001/notice/get'
      let parmas={
        username:getUser()
      }
      axios.get(path,{params:parmas}).then(res=>{
        this.data=res.data.data
        this.data.forEach(item=>{
          item['time']=this.$store.state.formatTime(item['time'])
        })
      })
    }
  },
  mounted() {
    this.get_notice()
  }
}
</script>

<style scoped>

</style>
