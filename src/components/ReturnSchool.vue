<template>
  <div>
    <el-table :show-header="false" :data="data" :span-method="span">
      <el-table-column prop="item1"></el-table-column>
      <el-table-column >
        <template slot-scope="scope">
          <el-input v-if="[3,5].includes(scope.$index)" v-model="scope.row.item2"></el-input>
          <el-date-picker v-model="scope.row.item2" v-else-if="scope.$index===4" type="date"></el-date-picker>
          <el-select v-else-if="scope.$index===6" v-model="scope.row.item2">
            <el-option v-for="i in options" :label="i" :value="i" :key="i"></el-option>
          </el-select>
          <span v-else>{{scope.row.item2}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="item3">
      </el-table-column>
      <el-table-column prop="item4"></el-table-column>
      <el-table-column prop="item5">
        <template slot-scope="scope">
          <el-input v-if="[4,6].includes(scope.$index) " v-model="scope.row.item5"></el-input>
          <span v-else>{{scope.row.item5}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="item6"></el-table-column>
    </el-table>
    <br>
    <el-button type="primary" v-if="id===''" @click="submit">提交</el-button>
    <el-button type="success" v-else @click="update">更新</el-button>
  </div>
</template>

<script>
import {getUser, getUserName} from "@/utils/auth";
import axios from "axios";

export default {
  name: "ReturnSchool",
  props:{
    id:String,
    see_data:Array
  },
  data(){
    return{
      options:['高铁','飞机','自驾','公交'],
      data:[
        {item1:'姓名',item2:'',item3:'性别',item4:'',item5:'班级',item6:''},
        {item1:'身份证号',item2:'',item3:'',item4:'',item5:'联系电话',item6:''},
        {item1:'监护人姓名',item2:'',item3:'',item4:'监护人电话',item5:'',item6:''},
        {item1:'身体情况描述',item2:'',item3:'',item4:'',item5:'',item6:''},
        {item1:'返校时间',item2:'',item3:'',item4:'家庭地址',item5:'',item6:''},
        {item1:'同行人员',item2:''},
        {item1:'返校方式',item2:'',item3:'',item4:'车次航班',item5:'',item6:''},
      ]
    }
  },methods:{
    span({row, column, rowIndex, columnIndex}){
      if (rowIndex===1){
        if (columnIndex===1){
          return{
            rowspan:1,
            colspan:3
          }
        }
        if ([2,3].includes(columnIndex)){
          return{
            rowspan:0,
            colspan:0
          }
        }
      }
      if ([2,4,6].includes(rowIndex)){
        if ([1,4].includes(columnIndex)){
          return {
            rowspan: 1,
            colspan: 2
          }
        }
        if ([2,5].includes(columnIndex)){
          return {
            rowspan: 0,
            colspan: 0
          }
        }

      }
      if ([3,5].includes(rowIndex)){
        if (columnIndex>0){
          if (columnIndex===1){
            return {
              rowspan: 1,
              colspan: 5
            }
          }else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }

    },
    submit(){
      let path='http://43.143.116.236:5001/process/submit'
      let params={
        username:getUser(),
        type:'返校申请',
        table:this.data,
      }
      axios.post(path,params).then(res=>{
        if (res.data.code===200){
          this.$message.success('提交成功')
          this.$store.state.dialog=false
          this.$emit('search');
        }
      })
    },
    update(){
      let path='http://43.143.116.236:5001/process/update'
      let params={
        id:this.id,
        table:this.data
      }
      axios.post(path,params).then(res=>{
        if (res.data.code===200){
          this.$message.success('更新成功')
          this.$store.state.dialog=false
          this.$emit('search');
        }
      })
    }
  },
  mounted() {
    if (this.see_data.length){
      this.data=this.see_data
    }else {
      this.data[0].item2=getUserName()
      let path='http://43.143.116.236:5001/student/info/get'
      let params={
        username:getUserName()
      }
      axios.get(path,{params:params}).then(res=>{
        let data=res.data.data[0]
        this.data[0].item4=data.sex
        this.data[0].item6=data.class
        this.data[1].item2=data.identity
      })
    }
  }
}
</script>

<style scoped>

</style>
