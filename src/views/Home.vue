<template>
  <el-container>

      <el-aside width="200px" >
        <el-menu>
        <el-menu-item  v-for="i in table" :key="i.id" :lable="i.name" @click="change(i.name)">
          {{i.name}}
        </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <Board v-if="name==='首页'||name===''"></Board>
        <DataTable v-if="['请假'].includes(name)" :name="name"></DataTable>
      </el-main>
  </el-container>
</template>

<script>
import DataTable from "@/components/DataTable";
import Board from "@/components/Board";

export default {
  name: "Home",
  components: {Board, DataTable},
  data(){
    return{
      table:[],
      name:''
    }
  },methods:{
    change(name){
     this.name=name
    }
  },
  mounted() {
    let role=localStorage.getItem('permission')
    this.table=this.$store.state.filter({role:role},this.$store.state.table)[0].item
  }
}

</script>

<style scoped>

</style>
