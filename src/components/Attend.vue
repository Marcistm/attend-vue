<template>
  <div>
<el-form :inline="true">
  <el-form-item label="班级">
    <span>{{formInLine.class}}</span>
  </el-form-item>
  <el-form-item label="课程">
    <span>{{formInLine.course}}</span>
  </el-form-item>
  <el-form-item label="时间(分钟)">
    <el-select  v-model="formInLine.time" placeholder="请选择"  >
      <el-option
          v-for="item in timeOption"
          :key="item"
          :label="item"
          :value="item">
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item >
    <el-button type="primary" @click="start">开始考勤</el-button>
  </el-form-item>
</el-form>
<el-container v-if="tag">
  <el-header>
    <h2>考勤码:{{counter}}</h2>
    <h2>剩余时间:{{time}}</h2>
  </el-header>
  <br>
  <el-progress type="circle" :percentage="percentage" ></el-progress>
</el-container>
    <el-dialog>

    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + "分" + (seconds < 10 ? "0" : "") + seconds+'秒';
}

export default {

  name: "Attend",
  props:{
    class_name:String,
    course:String
  },
  data(){
    return{
      id:'',
      time:'',
      counter: "0000", // 初始值为四个零
      intervalId: null,
      formInLine:{
        course:'',
        class:'',
        time:''
      },
      percentage:0,
      tag:false,
      timeOption:[5,10,15],
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#1989fa', percentage: 60},
        {color: '#6f7ad3', percentage: 80},
        {color: '#5cb87a', percentage: 100},
      ]
    }
  },

  methods:{
    start(){
      this.tag=true
      let time=this.formInLine.time*60*1000
      this.time=formatTime(time)
      this.formInLine.time=''
      const randomNum = Math.floor(Math.random() * 10000); // 生成随机的四位数字
      this.counter = randomNum.toString().padStart(4, "0"); // 补零操作，保证显示的数字总共有四位数
      let path1='http://127.0.0.1:5001/attend/insert'
      axios.get(path1,{params:this.formInLine}).then(res=>{
        if (res.data.code===200){
          this.$message.success('考勤开始成功')
          this.id=res.data.id
        }
      })
      this.intervalId = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 10000); // 生成随机的四位数字
        this.counter = randomNum.toString().padStart(4, "0"); // 补零操作，保证显示的数字总共有四位数
        time=time-2000;
        this.time=formatTime(time)
        let path=`http://127.0.0.1:5001/attend/start`
        let parmas={
          code:this.counter,
          id:this.id
        }
        axios.get(path,{params:parmas})
        if (time === 0) {
          clearInterval(this.intervalId); // 关闭定时器
        }
      }, 2000);
    }

    },
  destroyed() {
    clearInterval(this.intervalId); // 防止组件销毁时定时器仍在运行
  },
  mounted() {
    this.formInLine.class=this.class_name
    this.formInLine.course=this.course
  }

}
</script>

<style scoped>

</style>
