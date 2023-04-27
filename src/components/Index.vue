<template>
  <el-descriptions title="公告栏">
    <el-descriptions-item ></el-descriptions-item>
  </el-descriptions>
</template>

<script>
import axios from "axios";

export default {
  name: "Index",
  data(){
    return{
      board:[]
    }
  },
  methods:{
    get_board(){
      let path='http://43.143.116.236:5001/board/get'
      axios.get(path).then(res=>{
        this.board=res.data.data
      })
    }
  },
  mounted() {
    this.get_board()
  }
}
</script>

<style scoped>

</style>