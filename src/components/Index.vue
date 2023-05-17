<template>
  <div>
    <el-carousel height="500px" :interval="5000" arrow="always">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <el-image :src="item.image" alt="carousel-item" fit="fit" />
      </el-carousel-item>
    </el-carousel>
    <h2>公告栏</h2>
    <el-table :show-header="false" :data="board">
      <el-table-column >
        <template slot-scope="scope">
          <el-button type="text" @click="see(scope.row.id,'board')">{{scope.row.title}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="tag" @before-close="handleBeforeClose">
      <board :see_data="see_data" :id="id"></board>
    </el-dialog>
  </div>

</template>

<script>
import axios from "axios";
import Board from "@/components/Board";

export default {
  name: "Index",
  components: {Board},
  data(){
    return{
      see_data:[],
      id:'',
      tag:false,
      carouselItems: [
        { image: require('@/assets/index/index1.jpg') },
        { image: require('@/assets/index/index2.jpg') },
        { image: require('@/assets/index/index3.jpg') },
      ],
      board:[]
    }
  },
  methods:{
    handleBeforeClose(done) {
      this.$refs.childComponent.$destroy(); // 销毁子组件
      done();
    },
    see(id,table){
      let path = 'http://43.143.116.236:5001/see'
      let params = {id: id,table:table}
      axios.get(path,{params:params}).then(res=>{
          this.see_data=res.data.data
          this.id=id
          this.tag = true
      })
    },
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
