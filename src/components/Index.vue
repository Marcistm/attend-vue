<template>
  <div>
    <el-carousel height="500px" :interval="5000" arrow="always">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <el-image :src="item.image" alt="carousel-item" :fit="fit" />
      </el-carousel-item>
    </el-carousel>
    <el-descriptions title="公告栏">
      <el-descriptions-item ></el-descriptions-item>
    </el-descriptions>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "Index",
  data(){
    return{
      carouselItems: [
        { image: require('@/assets/index/index1.jpg') },
        { image: require('@/assets/index/index2.jpg') },
        { image: require('@/assets/index/index3.jpg') },
      ],
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
