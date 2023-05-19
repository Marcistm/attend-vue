<template>
<div>
  <el-form :inline="true">
    <el-form-item label="课程" >
      <el-select v-model="course">
        <el-option v-for="i in courses" :label="i.result" :key="i.result" :value="i.result"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getResult">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="data">
    <el-table-column label="时间" prop="time"></el-table-column>
    <el-table-column label="出勤人数" prop="attend"></el-table-column>
    <el-table-column label="请假人数" prop="leave_count">
      <template slot-scope="scope">
        <el-button type="text" @click="open(scope.row.leave)">{{scope.row.leave_count}}</el-button>
      </template>
    </el-table-column>
    <el-table-column label="缺席人数" prop="absent_count">
      <template slot-scope="scope">
        <el-button type="text" @click="open(scope.row.leave)">{{scope.row.absent_count}}</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog :visible.sync="tag">
    <el-table :data="usernames">
      <el-table-column label="学号">
        <template slot-scope="scope">
          <span>{{usernames[scope.$index]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <div id="attend" style="width:100%;height: 500px"></div>
</div>
</template>

<script>
import {getUser} from "@/utils/auth";
import axios from "axios";
import * as echarts from "echarts"
function drawAttendanceRateLineChart(data) {
  const myChart = echarts.init(document.getElementById('attend'));
  const option = {
    title: {
      text: '出勤率折线图'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b} <br/>{a}: {c}%',
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      data: data.map(item => item.time),
      axisPointer: {
        snap: true
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [{
      name: '出勤率',
      type: 'line',
      smooth: true,
      data: data.map(item => ({name: item.time, value: item.attend_rate})),
      markLine: {
        lineStyle: {
          type: 'dashed'
        },
        data: [{
          type: 'average',
          name: '平均值'
        }]
      }
    }]
  };
  myChart.setOption(option);
}


export default {
  name: "AttendStatistics",
  data(){
    return{
      tag:false,
      course:'',
      courses:[],
      data:[],
      usernames:[]
    }
  },
  methods:{
    open(data){
      this.tag=true
      this.usernames=data.split(',')
      console.log(this.usernames)
    },
    getResult(){
      let path='http://43.143.116.236:5001/attend/statistics'
      let params={
        course:this.course
      }
      axios.get(path,{params:params}).then(res=>{
        res.data.data.forEach(item=>{
          item['time']=this.$store.state.formatTime(item.time)
          item['attend_rate']=item.attend_rate*100
        })
        drawAttendanceRateLineChart(res.data.data)
        this.data=res.data.data
      })
    },
    getCourse(){
      let path='http://43.143.116.236:5001/course/get'
      let params={
        teacher:getUser()
      }
      axios.get(path,{params:params}).then(res=>{
        this.courses=res.data.data
      })
    }
  },
  mounted() {
    this.getCourse()
  }
}
</script>

<style scoped>

</style>
